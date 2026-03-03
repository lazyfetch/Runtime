package com.runtime.engine.executors;

import com.runtime.engine.DockerExecutorUtil;
import com.runtime.engine.LanguageExecutor;
import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

public class GeneralDockerExecutor implements LanguageExecutor {
    private final DockerExecutorUtil dockerUtil = new DockerExecutorUtil();
    private final String language;

    public GeneralDockerExecutor(String language) {
        this.language = language;
    }

    @Override
    public ApiResponse<ExecutionResult> execute(String code) {
        return dockerUtil.execute(code, language);
    }
}
