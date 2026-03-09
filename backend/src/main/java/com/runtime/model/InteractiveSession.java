package com.runtime.model;

import java.io.OutputStream;

public class InteractiveSession {

    private final String containerId;
    private final OutputStream stdinStream;
    private final String tempDirPath;

    public InteractiveSession(String containerId, OutputStream stdinStream, String tempDirPath) {
        this.containerId = containerId;
        this.stdinStream = stdinStream;
        this.tempDirPath = tempDirPath;
    }

    public String getContainerId() { return containerId; }
    public OutputStream getStdinStream() { return stdinStream; }
    public String getTempDirPath() { return tempDirPath; }
}
