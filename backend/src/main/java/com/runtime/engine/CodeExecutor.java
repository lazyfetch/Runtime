package com.runtime.engine;

import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;
import com.runtime.engine.executors.*;

import java.util.HashMap;
import java.util.Map;

public class CodeExecutor {

    private final Map<String, LanguageExecutor> executors = new HashMap<>();

    public CodeExecutor()
    {
        executors.put("java", new JavaExecutor());
    }

    public ApiResponse<ExecutionResult> execute(String code, String language)
    {
        LanguageExecutor executor = executors.get(language.toLowerCase());

        if (executor == null)
        {
            return ApiResponse.error("Unsupported language: " + language);
        }

        return executor.execute(code);
    }
}
