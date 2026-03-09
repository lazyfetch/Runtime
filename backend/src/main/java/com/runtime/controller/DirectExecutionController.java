package com.runtime.controller;

import com.runtime.config.JwtUtil;
import com.runtime.engine.DockerExecutorUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.model.ExecutionResult;
import com.runtime.service.SubmissionService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@ConditionalOnProperty(name = "redis.enabled", havingValue = "false", matchIfMissing = true)
public class DirectExecutionController
{

    private final DockerExecutorUtil dockerExecutorUtil;
    private final SubmissionService submissionService;
    private final JwtUtil jwtUtil;

    public DirectExecutionController(DockerExecutorUtil dockerExecutorUtil,
                                     SubmissionService submissionService,
                                     JwtUtil jwtUtil) {
        this.dockerExecutorUtil = dockerExecutorUtil;
        this.submissionService = submissionService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/execute")
    public ApiResponse<ExecutionResult> execute(
            @RequestBody CodeExecutionRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        System.out.println(">>> DirectExecutionController handling request");
        ApiResponse<ExecutionResult> response = dockerExecutorUtil.execute(
                request.getCode(),
                request.getLanguage(),
                request.getStdin()
        );

        // Record submission if the user is authenticated
        if (authHeader != null && authHeader.startsWith("Bearer ") && response.getData() != null) {
            try {
                Long userId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
                submissionService.record(userId, request.getLanguage(), request.getCode(),
                        response.getData(), request.getProjectId());
            } catch (Exception e) {
                // Non-fatal: don't fail the execution response if submission recording fails
                System.err.println(">>> Failed to record submission: " + e.getMessage());
            }
        }

        return response;
    }
}
