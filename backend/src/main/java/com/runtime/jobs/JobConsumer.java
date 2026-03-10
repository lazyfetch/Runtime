package com.runtime.jobs;

import java.time.Duration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.runtime.engine.DockerExecutorUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;
import com.runtime.service.SubmissionService;

@Service
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true")
public class JobConsumer
{
    private final StringRedisTemplate redisTemplate;
    private static final String QUEUE_NAME = "Runtime";
    private final DockerExecutorUtil dockerExecutorUtil;
    private final SubmissionService submissionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JobConsumer(StringRedisTemplate redisTemplate,
                       DockerExecutorUtil dockerExecutorUtil,
                       SubmissionService submissionService)
    {
        this.redisTemplate = redisTemplate;
        this.dockerExecutorUtil = dockerExecutorUtil;
        this.submissionService = submissionService;
    }

    @Scheduled(fixedDelay = 1000)
    public void processQueue()
    {
        String jobData = redisTemplate.opsForList().rightPop(QUEUE_NAME, Duration.ofSeconds(1));

        if (jobData != null)
        {
            System.out.println("Popped job: " + jobData);
            String jobId = null;

            try
            {
                JsonNode node = objectMapper.readTree(jobData);
                jobId            = node.get("jobId").asText();
                String code     = node.get("code").asText();
                String language = node.get("language").asText();
                String stdin    = node.get("stdin").asText();
                String cacheKey = node.has("cacheKey") ? node.get("cacheKey").asText() : null;

                redisTemplate.opsForValue().set("status:" + jobId, "RUNNING");

                ApiResponse<ExecutionResult> result = dockerExecutorUtil.execute(code, language, stdin);

                String resultJson = objectMapper.writeValueAsString(result);

                redisTemplate.opsForValue().set("result:" + jobId, resultJson, Duration.ofHours(1));
                redisTemplate.opsForValue().set("status:" + jobId, "COMPLETED", Duration.ofHours(1));

                if (cacheKey != null)
                {
                    redisTemplate.opsForValue().set(cacheKey, resultJson, Duration.ofHours(1));
                    System.out.println("Result cached: " + cacheKey);
                }

                if (result.getData() != null && node.has("userId"))
                {
                    try
                    {
                        Long userId    = Long.parseLong(node.get("userId").asText());
                        Long projectId = node.has("projectId") ? Long.parseLong(node.get("projectId").asText()) : null;
                        submissionService.record(userId, language, code, result.getData(), projectId);
                    }
                    catch (Exception e)
                    {
                        System.err.println("Failed to record submission: " + e.getMessage());
                    }
                }

                System.out.println("Job completed: " + jobId);
            }
            catch (Exception e)
            {
                System.err.println("Failed to process job: " + e.getMessage());
                if (jobId != null)
                {
                    redisTemplate.opsForValue().set("status:" + jobId, "FAILED");
                }
            }
        }
    }
}
