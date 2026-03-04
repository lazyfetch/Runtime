package com.runtime.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.runtime.jobs.JobProducer;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
public class ExecutionService
{

    private final JobProducer jobProducer;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ExecutionService(JobProducer jobProducer, StringRedisTemplate redisTemplate)
    {
        this.jobProducer = jobProducer;
        this.redisTemplate = redisTemplate;
    }

    private String hashRequest(String code, String language, String stdin) throws Exception
    {
        String raw = language + "|" + code + "|" + stdin;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(raw.getBytes());
        return HexFormat.of().formatHex(hash);
    }

    public ApiResponse<String> execute(CodeExecutionRequest request)
    {
        try
        {
            String stdin = request.getStdin() != null ? request.getStdin() : "";
            String cacheKey = "cache:" + hashRequest(request.getCode(), request.getLanguage(), stdin);

            // Check cache if hit skip queue entirely
            String cachedResult = redisTemplate.opsForValue().get(cacheKey);
            if (cachedResult != null)
            {
                System.out.println("Cache hit! Returning cached result.");
                String jobId = UUID.randomUUID().toString();
                redisTemplate.opsForValue().set("result:" + jobId, cachedResult);
                redisTemplate.opsForValue().set("status:" + jobId, "COMPLETED");

                redisTemplate.expire("result:" + jobId, Duration.ofHours(1));
                redisTemplate.expire("status:" + jobId, Duration.ofHours(1));

                return ApiResponse.success("Job submitted", jobId);
            }

            // Cache miss: queue the job
            String jobId = UUID.randomUUID().toString();
            String jobData = objectMapper.writeValueAsString(Map.of(
                    "jobId", jobId,
                    "code", request.getCode(),
                    "language", request.getLanguage(),
                    "stdin", stdin,
                    "cacheKey", cacheKey
            ));

            redisTemplate.opsForValue().set("status:" + jobId, "QUEUED");
            jobProducer.submitJob(jobData);
            return ApiResponse.success("Job submitted", jobId);

        }
        catch (Exception e)
        {
            return ApiResponse.error("Failed to submit job: " + e.getMessage());
        }
    }
}
