package com.runtime.model;

import java.time.LocalDateTime;

public class SubmissionResponse {

    private Long id;
    private Long projectId;
    private String language;
    private String code;
    private String stdout;
    private String stderr;
    private String status;
    private long executionTime;
    private LocalDateTime createdAt;

    public static SubmissionResponse from(Submission s) {
        SubmissionResponse r = new SubmissionResponse();
        r.id = s.getId();
        r.projectId = s.getSavedCode() != null ? s.getSavedCode().getId() : null;
        r.language = s.getLanguage();
        r.code = s.getCode();
        r.stdout = s.getStdout();
        r.stderr = s.getStderr();
        r.status = s.getStatus();
        r.executionTime = s.getExecutionTime();
        r.createdAt = s.getCreatedAt();
        return r;
    }

    // Getters
    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public String getLanguage() { return language; }
    public String getCode() { return code; }
    public String getStdout() { return stdout; }
    public String getStderr() { return stderr; }
    public String getStatus() { return status; }
    public long getExecutionTime() { return executionTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
