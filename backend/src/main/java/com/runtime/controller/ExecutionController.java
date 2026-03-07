package com.runtime.controller;

import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.service.ExecutionService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true")

public class ExecutionController
{

    private final ExecutionService executionService;
    private final StringRedisTemplate redisTemplate;

    public ExecutionController(ExecutionService executionService, StringRedisTemplate redisTemplate)
    {
        this.executionService = executionService;
        this.redisTemplate = redisTemplate;
    }

    @PostMapping("/execute")
    public ApiResponse<String> execute(@RequestBody CodeExecutionRequest request)
    {
        System.out.println(">>> ExecutionController (Redis) handling request");
        return executionService.execute(request);
    }

    @GetMapping("/result/{jobId}")
    public ApiResponse<String> getResult(@PathVariable String jobId)
    {
        String status = redisTemplate.opsForValue().get("status:" + jobId);

        if (status == null)
        {
            return ApiResponse.error("Invalid jobId");
        }


        if (status.equals("QUEUED") || status.equals("RUNNING"))
        {
            return ApiResponse.success(status, null);
        }

        String result = redisTemplate.opsForValue().get("result:" + jobId);
        return ApiResponse.success(status, result);
    }
}
