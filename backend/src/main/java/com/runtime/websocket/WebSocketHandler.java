package com.runtime.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.runtime.engine.DockerExecutorUtil;
import com.runtime.model.InteractiveSession;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.*;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final DockerExecutorUtil dockerExecutorUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, InteractiveSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> ttlFutures = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    private static final long MAX_OUTPUT_BYTES = 1_048_576L;
    private static final int TTL_SECONDS = 60;

    public WebSocketHandler(DockerExecutorUtil dockerExecutorUtil) {
        this.dockerExecutorUtil = dockerExecutorUtil;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println(">>> URI: " + session.getUri().getPath());
        System.out.println(">>> Auth header present: " +
                (session.getHandshakeHeaders().getFirst("Authorization") != null));
        System.out.println("Connected: " + session.getId());
        // wait for first message with code + language
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        String sessionId = session.getId();
        InteractiveSession interactiveSession = sessions.get(sessionId);

        //initialize container
        if (interactiveSession == null)
        {
            try {
                Map<?, ?> payload = objectMapper.readValue(message.getPayload(), Map.class);
                String code = (String) payload.get("code");
                String language = (String) payload.get("language");

                if (code == null || language == null) {
                    session.sendMessage(new TextMessage("Error: 'code' and 'language' are required.\r\n"));
                    session.close(CloseStatus.BAD_DATA);
                    return;
                }

                // bytesReceived tracker per session
                long[] bytesReceived = {0};

                InteractiveSession newSession = dockerExecutorUtil.executeInteractive(
                        code, language,
                        outputBytes -> {
                            bytesReceived[0] += outputBytes.length;
                            if (bytesReceived[0] > MAX_OUTPUT_BYTES) {
                                try {
                                    session.sendMessage(new TextMessage("\r\nError: Maximum output limit exceeded.\r\n"));
                                    cleanupSession(session);
                                    session.close(CloseStatus.POLICY_VIOLATION);
                                } catch (Exception e) {
                                    System.err.println("Output limit kill error: " + e.getMessage());
                                }
                                return;
                            }
                            try {
                                if (session.isOpen()) {
                                    session.sendMessage(new TextMessage(outputBytes));
                                }
                            } catch (IOException e) {
                                System.err.println("Send failed: " + e.getMessage());
                                cleanupSession(session);
                            }
                        }
                );

                sessions.put(sessionId, newSession);


                ScheduledFuture<?> ttl = scheduler.schedule(() -> {
                    try {
                        session.sendMessage(new TextMessage("\r\nError: Session timed out after " + TTL_SECONDS + " seconds.\r\n"));
                        cleanupSession(session);
                        session.close(CloseStatus.POLICY_VIOLATION);
                    } catch (Exception e) {
                        System.err.println("TTL error: " + e.getMessage());
                    }
                }, TTL_SECONDS, TimeUnit.SECONDS);

                ttlFutures.put(sessionId, ttl);

            }
            catch (Exception e)
            {
                try
                {
                    session.sendMessage(new TextMessage("Error: Failed to start session: " + e.getMessage() + "\r\n"));
                    session.close(CloseStatus.SERVER_ERROR);
                }
                catch (IOException ex)
                {
                    System.err.println("Failed to send error message: " + ex.getMessage());
                }
            }
            return;
        }

        //subsequent messages: forward to container stdin
        try {
            String input = message.getPayload();
            byte[] rawBytes = (input + "\n").getBytes();
            interactiveSession.getDockerInput().write(rawBytes);
            interactiveSession.getDockerInput().flush();
        } catch (IOException e) {
            System.err.println("Write to stdin failed: " + e.getMessage());
            cleanupSession(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("Disconnected: " + session.getId() + " | Status: " + status);
        cleanupSession(session);
    }

    private void cleanupSession(WebSocketSession session) {
        String sessionId = session.getId();

        ScheduledFuture<?> ttl = ttlFutures.remove(sessionId);
        if (ttl != null) ttl.cancel(false);

        InteractiveSession s = sessions.remove(sessionId);
        if (s == null) return;

        try { s.getDockerInput().close(); } catch (IOException ignored) {}

        try {
            dockerExecutorUtil.getDockerClient()
                    .killContainerCmd(s.getContainerId()).exec();
        } catch (Exception ignored) {}

        try {
            dockerExecutorUtil.getDockerClient()
                    .removeContainerCmd(s.getContainerId()).withForce(true).exec();
            System.out.println("Removed container: " + s.getContainerId());
        } catch (Exception ignored) {}

        // delete temp dir
        java.io.File tempDir = new java.io.File(s.getTempDirPath());
        deleteDirectory(tempDir);
    }

    private void deleteDirectory(java.io.File dir) {
        java.io.File[] files = dir.listFiles();
        if (files != null) for (java.io.File f : files) f.delete();
        dir.delete();
    }
}
