package com.runtime.service;

import java.security.MessageDigest;
import java.time.Duration;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.runtime.jobs.JobProducer;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;

@Service
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true")
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

    public ApiResponse<String> execute(CodeExecutionRequest request, Long userId)
    {
        try
        {
            String stdin = request.getStdin() != null ? request.getStdin() : "";
            String cacheKey = "cache:" + hashRequest(request.getCode(), request.getLanguage(), stdin);

            String cachedResult = redisTemplate.opsForValue().get(cacheKey);
            if (cachedResult != null)
            {
                System.out.println("Cache hit! Returning cached result.");
                String jobId = UUID.randomUUID().toString();
                redisTemplate.opsForValue().set("result:" + jobId, cachedResult, Duration.ofHours(1));
                redisTemplate.opsForValue().set("status:" + jobId, "COMPLETED", Duration.ofHours(1));
                return ApiResponse.success("Job submitted", jobId);
            }

            String jobId = UUID.randomUUID().toString();
            Map<String, String> jobDataMap = new HashMap<>();
            jobDataMap.put("jobId", jobId);
            jobDataMap.put("code", request.getCode());
            jobDataMap.put("language", request.getLanguage());
            jobDataMap.put("stdin", stdin);
            jobDataMap.put("cacheKey", cacheKey);
            if (userId != null) jobDataMap.put("userId", userId.toString());
            if (request.getProjectId() != null) jobDataMap.put("projectId", request.getProjectId().toString());

            String jobData = objectMapper.writeValueAsString(jobDataMap);
            redisTemplate.opsForValue().set("status:" + jobId, "QUEUED");
            jobProducer.submitJob(jobData);
            return ApiResponse.success("Job submitted", jobId);
        }
        catch (Exception e)
        {
            return ApiResponse.error("Failed to submit job: " + e.getMessage());
        }
    }

    public ApiResponse<String> getResult(String jobId)
    {
        String status = redisTemplate.opsForValue().get("status:" + jobId);
        if (status == null) return ApiResponse.error("Invalid jobId");
        if ("QUEUED".equals(status) || "RUNNING".equals(status)) return ApiResponse.success(status, null);
        String result = redisTemplate.opsForValue().get("result:" + jobId);
        return ApiResponse.success(status, result);
    }
}
