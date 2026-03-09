package com.runtime.websocket;

import java.io.OutputStream;
import java.util.concurrent.ScheduledFuture;

public class SessionState {
    public final String containerId;
    public final OutputStream dockerInput;
    public final ScheduledFuture<?> ttlFuture;
    public volatile long bytesReceived = 0;

    public SessionState(String containerId, OutputStream dockerInput, ScheduledFuture<?> ttlFuture) {
        this.containerId = containerId;
        this.dockerInput = dockerInput;
        this.ttlFuture = ttlFuture;
    }
}
