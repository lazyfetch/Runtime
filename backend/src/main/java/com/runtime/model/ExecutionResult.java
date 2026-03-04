package com.runtime.model;

public class ExecutionResult {
    private String stdout;
    private String stderr;
    private String errorType;
    private int exitCode;
    private long executionTime;

    public ExecutionResult(String stdout, String stderr, String errorType, int exitCode, long executionTime) {
        this.stdout = stdout;
        this.stderr = stderr;
        this.errorType = errorType;
        this.exitCode = exitCode;
        this.executionTime = executionTime;
    }

    public String getStdout() { return stdout; }
    public void setStdout(String stdout) { this.stdout = stdout; }

    public String getStderr() { return stderr; }
    public void setStderr(String stderr) { this.stderr = stderr; }

    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }

    public int getExitCode() { return exitCode; }
    public void setExitCode(int exitCode) { this.exitCode = exitCode; }

    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }



}
