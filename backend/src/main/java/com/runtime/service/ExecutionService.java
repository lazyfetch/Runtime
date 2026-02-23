package com.runtime.service;

import com.runtime.engine.CodeExecutor;
import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.model.ExecutionResult;
import org.springframework.stereotype.Service;

@Service

public class ExecutionService
{
    public ApiResponse<ExecutionResult> execute(CodeExecutionRequest request)
    {
        CodeExecutor ce = new CodeExecutor();
        return ce.execute(request.getCode(), request.getLanguage());
    }
}
