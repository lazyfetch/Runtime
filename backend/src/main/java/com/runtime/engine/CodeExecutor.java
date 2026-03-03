package com.runtime.engine;

import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;
import com.runtime.engine.executors.*;
import com.runtime.engine.executors.GeneralDockerExecutor;

import java.util.HashMap;
import java.util.Map;

public class CodeExecutor {

    private final Map<String, LanguageExecutor> executors = new HashMap<>();

    public CodeExecutor()
    {
        executors.put("java", new GeneralDockerExecutor("java"));
        executors.put("python", new GeneralDockerExecutor("python"));
        executors.put("c", new GeneralDockerExecutor("c"));
        executors.put("cpp",new GeneralDockerExecutor("cpp"));
        executors.put("js",new GeneralDockerExecutor("javascript"));
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
