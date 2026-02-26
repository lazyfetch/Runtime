package com.runtime.engine.executors;

import com.runtime.engine.LanguageExecutor;
import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

public class CppExecutor extends BaseExecutor implements LanguageExecutor {

    @Override
    public ApiResponse<ExecutionResult> execute(String code)
    {
        return executeCompiled(code, "Main.cpp", "g++", null);
    }
}
