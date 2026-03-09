package com.runtime.model;

import java.io.OutputStream;
import java.util.concurrent.atomic.AtomicBoolean;

public class InteractiveSession {
    private final String containerId;
    private final OutputStream dockerInput;
    private final String tempDirPath;
    private AtomicBoolean killedFlag;

    public InteractiveSession(String containerId, OutputStream dockerInput, String tempDirPath) {
        this.containerId = containerId;
        this.dockerInput = dockerInput;
        this.tempDirPath = tempDirPath;
    }

    public String getContainerId() { return containerId; }
    public OutputStream getDockerInput() { return dockerInput; }
    public String getTempDirPath() { return tempDirPath; }

    public AtomicBoolean getKilledFlag() { return killedFlag; }
    public void setKilledFlag(AtomicBoolean killedFlag) { this.killedFlag = killedFlag; }
}
