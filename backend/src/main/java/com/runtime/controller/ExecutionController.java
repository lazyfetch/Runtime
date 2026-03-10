package com.runtime.controller;

import com.runtime.config.JwtUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.service.ExecutionService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true")
public class ExecutionController
{
    private final ExecutionService executionService;
    private final JwtUtil jwtUtil;

    public ExecutionController(ExecutionService executionService, JwtUtil jwtUtil)
    {
        this.executionService = executionService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/execute")
    public ApiResponse<String> execute(
            @RequestBody CodeExecutionRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader)
    {
        Long userId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
            } catch (Exception ignored) {}
        }
        return executionService.execute(request, userId);
    }

    @GetMapping("/result/{jobId}")
    public ApiResponse<String> getResult(@PathVariable String jobId)
    {
        return executionService.getResult(jobId);
    }
}
