package com.runtime.jobs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.runtime.engine.DockerExecutorUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class JobConsumer {

    private final StringRedisTemplate redisTemplate;
    private static final String QUEUE_NAME = "Runtime";
    private final DockerExecutorUtil dockerExecutorUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JobConsumer(StringRedisTemplate redisTemplate, DockerExecutorUtil dockerExecutorUtil) {
        this.redisTemplate = redisTemplate;
        this.dockerExecutorUtil = dockerExecutorUtil;
    }

    @Scheduled(fixedDelay = 1000)
    public void processQueue() {
        String jobData = redisTemplate.opsForList().rightPop(QUEUE_NAME, Duration.ofSeconds(1));

        if (jobData != null)
        {
            System.out.println("Popped and processing job: " + jobData);
            try
            {
                JsonNode node = objectMapper.readTree(jobData);
                String jobId    = node.get("jobId").asText();
                String code     = node.get("code").asText();
                String language = node.get("language").asText();
                String stdin    = node.get("stdin").asText();

                ApiResponse<ExecutionResult> result = dockerExecutorUtil.execute(code, language, stdin);


                String resultJson = objectMapper.writeValueAsString(result);
                redisTemplate.opsForValue().set("result:" + jobId, resultJson);
                System.out.println("Result saved for jobId: " + jobId);

            }
            catch (Exception e)
            {
                System.err.println("Failed to process job: " + e.getMessage());
            }
        }
    }
}
