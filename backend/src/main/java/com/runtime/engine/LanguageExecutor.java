package com.runtime.engine;

import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

public interface LanguageExecutor
{
    ApiResponse<ExecutionResult> execute(String code);
}
