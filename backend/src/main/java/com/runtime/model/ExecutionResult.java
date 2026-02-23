package com.runtime.model;

public class ExecutionResult {
    private String output;
    private int exitCode;
    private long executionTime;

    public ExecutionResult(String output, int exitCode, long executionTime) {
        this.output = output;
        this.exitCode = exitCode;
        this.executionTime = executionTime;
    }


    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public int getExitCode() {
        return exitCode;
    }

    public void setExitCode(int exitCode) {
        this.exitCode = exitCode;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }
}
