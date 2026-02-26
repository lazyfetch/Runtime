package com.runtime.engine.executors;

import com.runtime.engine.LanguageExecutor;
import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;


public class PythonExecutor extends BaseExecutor implements LanguageExecutor {
    @Override
    public ApiResponse<ExecutionResult> execute(String code)
    {
        long startTime = System.currentTimeMillis();
        Path tempDir = null;

        try {

            tempDir = Files.createTempDirectory("TempDirectory");
            System.out.println("Temporary Directory created at:\n" + tempDir);

            Path sourceFile = tempDir.resolve("main.py");
            Files.writeString(sourceFile, code);

            // Run
            ProcessBuilder runner = new ProcessBuilder("python3", sourceFile.toString());

            runner.directory(tempDir.toFile());
            Process runProcess = runner.start();

            String runOutput = readStream(runProcess.getInputStream());
            String runErrors = readStream(runProcess.getErrorStream());

            boolean runFinished = runProcess.waitFor(5, TimeUnit.SECONDS);

            if (!runFinished)
            {
                runProcess.destroyForcibly();
                return ApiResponse.error("Execution timed out (5 seconds exceeded).");
            }

            int exitCode = runProcess.exitValue();
            long executionTime = System.currentTimeMillis() - startTime;

            String finalOutput = runOutput + (runErrors.isEmpty() ? "" : "\nErrors:\n" + runErrors);
            ExecutionResult result = new ExecutionResult(finalOutput, exitCode, executionTime);

            if (exitCode == 0)
            {
                return ApiResponse.success("Execution completed", result);
            }
            else
            {
                return ApiResponse.error("Execution failed with exit code " + exitCode);
            }

        }
        catch (IOException | InterruptedException e)
        {
            return ApiResponse.error("Execution error: " + e.getMessage());
        }
        finally
        {
            cleanup(tempDir);
        }
    }
}