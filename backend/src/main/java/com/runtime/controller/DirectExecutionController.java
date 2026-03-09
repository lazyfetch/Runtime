package com.runtime.controller;

import com.runtime.engine.DockerExecutorUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.model.ExecutionResult;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@ConditionalOnProperty(name = "redis.enabled", havingValue = "false", matchIfMissing = true)
public class DirectExecutionController
{

    private final DockerExecutorUtil dockerExecutorUtil;

    public DirectExecutionController(DockerExecutorUtil dockerExecutorUtil) {
        this.dockerExecutorUtil = dockerExecutorUtil;
    }

    @PostMapping("/execute")
    public ApiResponse<ExecutionResult> execute(@RequestBody CodeExecutionRequest request) {
        System.out.println(">>> DirectExecutionController handling request");
        return dockerExecutorUtil.execute(
                request.getCode(),
                request.getLanguage(),
                request.getStdin()
        );
    }
}
