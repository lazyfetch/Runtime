package com.runtime.engine.executors;

import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;

public abstract class BaseExecutor {

    protected String readStream(InputStream inputStream) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString().trim();
    }

    protected void cleanup(Path tempDir) {
        if (tempDir != null) {
            try {
                Files.walk(tempDir).sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try { Files.delete(path); }
                            catch (IOException ignored) {}
                        });
            } catch (IOException ignored) {}
        }
    }

    // In BaseExecutor.java - add this shared method
    protected ApiResponse<ExecutionResult> executeCompiled(
            String code, String fileName, String compileCmd, String compilerFlag) {
        long startTime = System.currentTimeMillis();
        Path tempDir = null;

        try {
            tempDir = Files.createTempDirectory("TempDirectory");
            Path sourceFile = tempDir.resolve(fileName);
            Files.writeString(sourceFile, code);

            ProcessBuilder pb = new ProcessBuilder(compileCmd, sourceFile.toString(), "-o", "Main");
            pb.directory(tempDir.toFile());
            Process compileProcess = pb.start();

            boolean finished = compileProcess.waitFor(10, TimeUnit.SECONDS);
            if (!finished) { compileProcess.destroyForcibly(); return ApiResponse.error("Compilation timed out"); }

            String compileErrors = readStream(compileProcess.getErrorStream());
            if (compileProcess.exitValue() != 0) return ApiResponse.error("Compilation failed:\n" + compileErrors);

            ProcessBuilder runner = new ProcessBuilder(tempDir.resolve("Main").toString());
            runner.directory(tempDir.toFile());
            Process runProcess = runner.start();

            String runOutput = readStream(runProcess.getInputStream());
            String runErrors = readStream(runProcess.getErrorStream());

            boolean runFinished = runProcess.waitFor(5, TimeUnit.SECONDS);
            if (!runFinished) { runProcess.destroyForcibly(); return ApiResponse.error("Execution timed out (5 seconds exceeded)."); }

            int exitCode = runProcess.exitValue();
            long executionTime = System.currentTimeMillis() - startTime;
            String finalOutput = runOutput + (runErrors.isEmpty() ? "" : "\nErrors:\n" + runErrors);
            ExecutionResult result = new ExecutionResult(finalOutput, exitCode, executionTime);

            return exitCode == 0 ? ApiResponse.success("Execution completed", result)
                    : ApiResponse.error("Execution failed with exit code " + exitCode);

        } catch (IOException | InterruptedException e) {
            return ApiResponse.error("Execution error: " + e.getMessage());
        } finally {
            cleanup(tempDir);
        }
    }

}
