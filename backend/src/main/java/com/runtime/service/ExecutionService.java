package com.runtime.service;

import com.runtime.engine.DockerExecutorUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.model.ExecutionResult;
import org.springframework.stereotype.Service;


@Service
public class ExecutionService {

    private final DockerExecutorUtil dockerExecutorUtil;

    public ExecutionService(DockerExecutorUtil dockerExecutorUtil) {
        this.dockerExecutorUtil = dockerExecutorUtil;
    }

    public ApiResponse<ExecutionResult> execute(CodeExecutionRequest request) {
        return dockerExecutorUtil.execute(request.getCode(), request.getLanguage(), request.getStdin());
    }
}
