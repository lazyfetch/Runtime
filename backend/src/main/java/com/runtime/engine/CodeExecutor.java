package com.runtime.engine;

import com.runtime.model.ApiResponse;
import com.runtime.model.ExecutionResult;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

public class CodeExecutor {

    public ApiResponse<ExecutionResult> execute(String code, String language) {
        long startTime = System.currentTimeMillis();

        try {
            String[] commandParts = buildCommand(code, language);
            ProcessBuilder pb = new ProcessBuilder(commandParts);

            Process process = pb.start();

            // Read standard output
            String output = readStream(process.getInputStream());

            // Read error output
            String errorOutput = readStream(process.getErrorStream());

            // Wait with timeout (5 seconds)
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return ApiResponse.error("Execution timeout (5 seconds exceeded)");
            }

            int exitCode = process.exitValue();
            long executionTime = System.currentTimeMillis() - startTime;

            // Combine output and errors
            String finalOutput = output + (errorOutput.isEmpty() ? "" : "\nErrors:\n" + errorOutput);

            ExecutionResult result = new ExecutionResult(finalOutput, exitCode, executionTime);

            if (exitCode == 0) {
                return ApiResponse.success("Execution completed", result);
            } else {
                return ApiResponse.error("Execution failed with exit code " + exitCode);
            }

        } catch (IOException | InterruptedException e) {
            return ApiResponse.error("Execution error: " + e.getMessage());
        }
    }

    // Helper method to read from input/error streams
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

    // Helper method to build command based on language
    private String[] buildCommand(String code, String language) {
        // Placeholder - implement proper command building later
        return new String[]{"java", "-version"};
    }
}
