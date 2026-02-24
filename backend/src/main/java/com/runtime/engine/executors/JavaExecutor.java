package com.runtime.engine.executors;

import com.runtime.engine.LanguageExecutor;
import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JavaExecutor implements LanguageExecutor {
    @Override
    public ApiResponse<ExecutionResult> execute(String code)
    {
        long startTime = System.currentTimeMillis();
        Path tempDir = null;

        try {
            String className = extractClassName(code);

            if (className == null)
            {
                return ApiResponse.error("Could not extract class name. Make sure your class is public.");
            }

            tempDir = Files.createTempDirectory("TempDirectory");
            System.out.println("Temporary Directory created at:\n" + tempDir);

            Path sourceFile = tempDir.resolve(className + ".java");
            Files.writeString(sourceFile, code);

            // Compile
            ProcessBuilder pb = new ProcessBuilder("javac", sourceFile.toString());
            pb.directory(tempDir.toFile());
            Process process = pb.start();

            boolean finished = process.waitFor(10, TimeUnit.SECONDS);
            if (!finished)
            {
                process.destroyForcibly();
                return ApiResponse.error("Compilation timed out");
            }

            String compileErrors = readStream(process.getErrorStream());
            int compileExit = process.exitValue();

            if (compileExit != 0)
            {
                return ApiResponse.error("Compilation failed:\n" + compileErrors);
            }

            // Run
            ProcessBuilder runner = new ProcessBuilder("java", "-cp", tempDir.toString(), className);
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
            if (tempDir != null)
            {
                try
                {
                    Files.walk(tempDir).sorted(Comparator.reverseOrder())
                            .forEach(path -> {
                                try {
                                    Files.delete(path);
                                }
                                catch (IOException ignored) {}
                            });
                } catch (IOException ignored) {}
            }
        }
    }

    private String extractClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(code);
        return matcher.find() ? matcher.group(1) : null;
    }

    private String readStream(java.io.InputStream inputStream) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString().trim();
    }
}