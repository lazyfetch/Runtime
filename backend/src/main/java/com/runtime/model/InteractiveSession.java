package com.runtime.model;

import java.io.PipedOutputStream;

public class InteractiveSession {
    private final String containerId;
    private final PipedOutputStream dockerInput;
    private final String tempDirPath;

    public InteractiveSession(String containerId, PipedOutputStream dockerInput, String tempDirPath) {
        this.containerId = containerId;
        this.dockerInput = dockerInput;
        this.tempDirPath = tempDirPath;
    }

    public String getContainerId() { return containerId; }
    public PipedOutputStream getDockerInput() { return dockerInput; }
    public String getTempDirPath() { return tempDirPath; }
}
