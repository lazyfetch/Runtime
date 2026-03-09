package com.runtime.engine;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.runtime.model.ExecutionResult;
import com.runtime.model.ApiResponse;
import com.runtime.model.InteractiveSession;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DockerExecutorUtil {

    private final DockerClient dockerClient;

    public DockerClient getDockerClient()
    {
        return dockerClient;
    }
    private static final int EXECUTION_TIMEOUT_SECONDS = 10;

    private static final List<Pattern> BLOCKED_PATTERNS = List.of(
            Pattern.compile("rm\\s+-rf", Pattern.CASE_INSENSITIVE),
            Pattern.compile(":\\(\\)\\{.*\\}", Pattern.CASE_INSENSITIVE),
            Pattern.compile("mkfs", Pattern.CASE_INSENSITIVE),
            Pattern.compile("dd\\s+if=", Pattern.CASE_INSENSITIVE),
            Pattern.compile("curl\\s+", Pattern.CASE_INSENSITIVE),
            Pattern.compile("wget\\s+", Pattern.CASE_INSENSITIVE),
            Pattern.compile("/etc/passwd", Pattern.CASE_INSENSITIVE),
            Pattern.compile("chmod\\s+777", Pattern.CASE_INSENSITIVE),
            Pattern.compile("sudo", Pattern.CASE_INSENSITIVE)
    );


    public DockerExecutorUtil(DockerClient dockerClient) {
        this.dockerClient = dockerClient;
    }


    public ApiResponse<ExecutionResult> execute(String code, String language, String stdin) {

        ApiResponse<ExecutionResult> securityError = checkSecurity(code);
        if (securityError != null) return securityError;

        String containerId = null;
        Path tempDir = null;

        try {
            long startTime = System.currentTimeMillis();

            String tempDirPath = System.getProperty("java.io.tmpdir") + "/code_" + UUID.randomUUID();
            tempDir = Paths.get(tempDirPath);
            Files.createDirectories(tempDir);

            String fileName = getFileName(language, code);
            Files.writeString(tempDir.resolve(fileName), code);

            if (stdin != null && !stdin.isEmpty()) {
                Files.writeString(tempDir.resolve("input.txt"), stdin);
            }

            String dockerImage = getDockerImage(language);
            String[] command = getRunCommand(language, code, stdin);

            CreateContainerResponse container = dockerClient.createContainerCmd(dockerImage)
                    .withCmd(command)
                    .withHostConfig(HostConfig.newHostConfig()
                            .withBinds(new Bind(tempDirPath, new Volume("/code")))
                            .withMemory(128 * 1024 * 1024L)
                            .withNanoCPUs(500_000_000L)
                            .withNetworkMode("none")
                            .withReadonlyRootfs(false)
                            .withPidsLimit(50L))
                    .withWorkingDir("/code")
                    .exec();

            containerId = container.getId();
            dockerClient.startContainerCmd(containerId).exec();
            System.out.println("Docker container started: " + containerId);

            final String finalContainerId = containerId;
            ExecutorService executor = Executors.newSingleThreadExecutor();
            Future<Integer> future = executor.submit(() ->
                    dockerClient.waitContainerCmd(finalContainerId).start().awaitStatusCode()
            );

            int exitCode;
            boolean timedOut = false;
            try {
                exitCode = future.get(EXECUTION_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            } catch (TimeoutException e) {
                timedOut = true;
                exitCode = -1;
                future.cancel(true);
                dockerClient.killContainerCmd(finalContainerId).exec();
                System.out.println("Container killed due to timeout: " + finalContainerId);
            } finally {
                executor.shutdownNow();
            }

            long executionTime = System.currentTimeMillis() - startTime;

            if (timedOut)
            {
                ExecutionResult result = new ExecutionResult(
                        "",
                        "Execution timed out after " + EXECUTION_TIMEOUT_SECONDS + " seconds",
                        "TIMEOUT",
                        exitCode,
                        executionTime
                );
                return ApiResponse.success("Execution timed out", result);
            }

            StringBuilder output = new StringBuilder();
            StringBuilder error = new StringBuilder();

            dockerClient.logContainerCmd(containerId)
                    .withStdOut(true)
                    .withStdErr(true)
                    .exec(new com.github.dockerjava.api.async.ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame frame) {
                            String log = new String(frame.getPayload());
                            if (frame.getStreamType().name().equals("STDOUT")) {
                                output.append(log);
                            } else {
                                error.append(log);
                            }
                        }
                    }).awaitCompletion();

            String stdoutStr = output.toString();
            String stderrStr = error.toString();

            String errorType = "NONE";
            if (exitCode != 0)
            {
                if (stderrStr.contains("error:") || stderrStr.contains("SyntaxError") || stderrStr.contains("cannot find symbol") || stderrStr.contains("reached end of file"))
                {
                    errorType = "COMPILE_ERROR";
                }
                else if (stderrStr.contains("EOFError") || stderrStr.contains("NoSuchElementException") || stderrStr.contains("end of file") || (stderrStr.isEmpty() && stdoutStr.isEmpty() && exitCode != 0))
                {
                    errorType = "STDIN_REQUIRED";
                }
                else if (stderrStr.contains("Exception") || stderrStr.contains("Traceback") || stderrStr.contains("Error:"))
                {
                    errorType = "RUNTIME_ERROR";
                }
                else
                {
                    errorType = "UNKNOWN_ERROR";
                }
            }

            ExecutionResult result = new ExecutionResult(stdoutStr, stderrStr, errorType, exitCode, executionTime);
            return ApiResponse.success("Code executed successfully", result);

        }
        catch (Exception e)
        {
            return ApiResponse.error("Execution failed: " + e.getMessage());
        }
        finally
        {

            if (containerId != null) {
                try {
                    dockerClient.removeContainerCmd(containerId).withForce(true).exec();
                    System.out.println("Docker container removed: " + containerId);
                } catch (Exception ignored) {}
            }
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    private ApiResponse<ExecutionResult> checkSecurity(String code) {
        for (Pattern pattern : BLOCKED_PATTERNS) {
            if (pattern.matcher(code).find()) {
                return ApiResponse.error("Code contains blocked content: potentially dangerous operation detected");
            }
        }
        return null;
    }

    private String extractJavaClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Main";
    }

    private String getFileName(String language, String code) {
        return switch (language.toLowerCase()) {
            case "java"       -> extractJavaClassName(code) + ".java";
            case "python"     -> "main.py";
            case "c"          -> "main.c";
            case "cpp"        -> "main.cpp";
            case "js", "javascript" -> "main.js";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private String getDockerImage(String language) {
        return switch (language.toLowerCase()) {
            case "java"             -> "eclipse-temurin:17";
            case "python"           -> "python:3.11";
            case "c", "cpp"         -> "gcc:latest";
            case "js", "javascript" -> "node:18";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private String[] getRunCommand(String language, String code, String stdin) {
        boolean hasInput = stdin != null && !stdin.isEmpty();
        String inputRedirect = hasInput ? " < input.txt" : "";

        return switch (language.toLowerCase()) {
            case "java" -> {
                String className = extractJavaClassName(code);
                yield new String[]{"sh", "-c", "javac " + className + ".java && java " + className + inputRedirect};
            }
            case "python"           -> new String[]{"sh", "-c", "python main.py" + inputRedirect};
            case "c"                -> new String[]{"sh", "-c", "gcc main.c -o main && ./main" + inputRedirect};
            case "cpp"              -> new String[]{"sh", "-c", "g++ main.cpp -o main && ./main" + inputRedirect};
            case "js", "javascript" -> new String[]{"sh", "-c", "node main.js" + inputRedirect};
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) f.delete();
        }
        dir.delete();
    }

    private String[] getRunCommandInteractive(String language, String code) {
        return switch (language.toLowerCase()) {
            case "java" -> {
                String className = extractJavaClassName(code);
                yield new String[]{"sh", "-c", "javac " + className + ".java && java " + className};
            }
            case "python" -> new String[]{"sh", "-c", "python -u main.py"};
            case "c"      -> new String[]{"sh", "-c", "gcc main.c -o main && stdbuf -o0 -e0 ./main"};
            case "cpp"    -> new String[]{"sh", "-c", "g++ main.cpp -o main && stdbuf -o0 -e0 ./main"};
            case "js", "javascript" -> new String[]{"sh", "-c", "node main.js"};
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }



    public InteractiveSession executeInteractive(String code, String language, java.util.function.Consumer<byte[]> onOutput) throws IOException
    {
        ApiResponse<ExecutionResult> securityError = checkSecurity(code);
        if (securityError != null)
        {
            throw new SecurityException("Blocked: " + securityError.getMessage());
        }

        String tempDirPath = System.getProperty("java.io.tmpdir") + "/interactive_" + UUID.randomUUID();
        Path tempDir = Paths.get(tempDirPath);
        Files.createDirectories(tempDir);

        String fileName = getFileName(language, code);
        Files.writeString(tempDir.resolve(fileName), code);

        String[] command = getRunCommandInteractive(language, code);
        String dockerImage = getDockerImage(language);

        CreateContainerResponse container = dockerClient.createContainerCmd(dockerImage)
                .withCmd(command)
                .withTty(false)
                .withStdinOpen(true)
                .withAttachStdin(true)
                .withAttachStdout(true)
                .withAttachStderr(true)
                .withHostConfig(HostConfig.newHostConfig()
                        .withBinds(new Bind(tempDirPath, new Volume("/code")))
                        .withMemory(128 * 1024 * 1024L)
                        .withNanoCPUs(500_000_000L)
                        .withNetworkMode("none")
                        .withReadonlyRootfs(false)
                        .withPidsLimit(50L))
                .withWorkingDir("/code")
                .exec();

        String containerId = container.getId();

        dockerClient.startContainerCmd(containerId).exec();

        PipedOutputStream pipedOut = new PipedOutputStream();
        PipedInputStream pipedIn = new PipedInputStream(pipedOut);

        dockerClient.attachContainerCmd(containerId)
                .withStdIn(pipedIn)
                .withStdOut(true)
                .withStdErr(true)
                .withFollowStream(true)
                .exec(new com.github.dockerjava.api.async.ResultCallback.Adapter<Frame>()
                {
                    @Override
                    public void onNext(Frame frame) {
                        if (frame != null && frame.getPayload() != null) {
                            onOutput.accept(frame.getPayload());
                        }
                    }
                });
        return new InteractiveSession(containerId, pipedOut, tempDirPath);
    }


}
