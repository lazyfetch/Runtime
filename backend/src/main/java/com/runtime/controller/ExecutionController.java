package com.runtime.controller;

import com.runtime.model.ApiResponse;
import com.runtime.model.CodeExecutionRequest;
import com.runtime.model.ExecutionResult;
import com.runtime.service.ExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")


public class ExecutionController
{
    @Autowired
    private ExecutionService executionService;

    @PostMapping("/execute")
    public ApiResponse<ExecutionResult> execute(@RequestBody CodeExecutionRequest request)
    {
        return executionService.execute(request);
    }
}
