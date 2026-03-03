package com.runtime.engine;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.runtime.model.ExecutionResult;
import com.runtime.model.ApiResponse;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DockerExecutorUtil {

    private final DockerClient dockerClient;

    public DockerExecutorUtil() {
        DefaultDockerClientConfig config = DefaultDockerClientConfig
                .createDefaultConfigBuilder()
                .withDockerHost("tcp://localhost:2375")
                .build();

        ApacheDockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .build();

        this.dockerClient = DockerClientImpl.getInstance(config, httpClient);
    }

    public ApiResponse<ExecutionResult> execute(String code, String language,String stdin) {
        try {
            long startTime = System.currentTimeMillis();

            String tempDirPath = System.getProperty("java.io.tmpdir") + "/code_" + UUID.randomUUID();
            Path tempDir = Paths.get(tempDirPath);
            Files.createDirectories(tempDir);

            String fileName = getFileName(language, code);
            Files.writeString(tempDir.resolve(fileName), code);

            if(stdin !=null && !stdin.isEmpty())
            {
                Files.writeString(tempDir.resolve("input.txt"),stdin);
            }
            String dockerImage = getDockerImage(language);
            String[] command = getRunCommand(language, code,stdin);

            CreateContainerResponse container = dockerClient.createContainerCmd(dockerImage)
                    .withCmd(command)
                    .withHostConfig(HostConfig.newHostConfig()
                            .withBinds(new Bind(tempDirPath, new Volume("/code")))
                            .withMemory(128 * 1024 * 1024L)
                            .withNanoCPUs(500_000_000L))
                    .withWorkingDir("/code")
                    .exec();

            String containerId = container.getId();

            dockerClient.startContainerCmd(containerId).exec();
            System.out.println("Docker container started!!!");
            dockerClient.waitContainerCmd(containerId).start().awaitStatusCode();

            long executionTime = System.currentTimeMillis() - startTime;

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

            dockerClient.removeContainerCmd(containerId).exec();
            System.out.println("Docker container removed!!!");
            deleteDirectory(tempDir.toFile());


            String finalOutput = !output.isEmpty() ? output.toString() : error.toString();
            ExecutionResult result = new ExecutionResult(finalOutput, 0, executionTime);
            return ApiResponse.success("Code Executed successfully", result);

        } catch (Exception e) {
            return ApiResponse.error("Execution failed: " + e.getMessage());
        }
    }
    private String extractJavaClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Main"; // fallback
    }

    private String getFileName(String language, String code) {
        return switch (language.toLowerCase()) {
            case "java"   -> extractJavaClassName(code) + ".java";
            case "python" -> "main.py";
            case "c"      -> "main.c";
            case "cpp"    -> "main.cpp";
            case "javascript"     -> "main.js";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private String getDockerImage(String language) {
        return switch (language.toLowerCase()) {
            case "java"   -> "eclipse-temurin:17";
            case "python" -> "python:3.11";
            case "c", "cpp" -> "gcc:latest";
            case "javascript"     -> "node:18";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }

    private String[] getRunCommand(String language, String code, String stdin) {

        boolean hasInput = stdin !=null && !stdin.isEmpty();
        String inputRedirect="";

        if(hasInput)
        {
            inputRedirect=" < input.txt";
        }

        return switch (language.toLowerCase()) {
            case "java" -> {
                String className = extractJavaClassName(code);
                yield new String[]{"sh", "-c", "javac " + className + ".java && java " + className + inputRedirect};
            }
            case "python" -> new String[]{"sh", "-c", "python main.py" + inputRedirect};
            case "c"      -> new String[]{"sh", "-c", "gcc main.c -o main && ./main" + inputRedirect};
            case "cpp"    -> new String[]{"sh", "-c", "g++ main.cpp -o main && ./main" + inputRedirect};
            case "javascript"     -> new String[]{"sh", "-c", "node main.js" + inputRedirect};
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
}
