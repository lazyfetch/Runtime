package com.runtime.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SavedCodeResponse {
    private Long id;
    private String title;
    private String language;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SavedCodeResponse from(SavedCode s) {
        SavedCodeResponse r = new SavedCodeResponse();
        r.setId(s.getId());
        r.setTitle(s.getTitle());
        r.setLanguage(s.getLanguage());
        r.setCode(s.getCode());
        r.setCreatedAt(s.getCreatedAt());
        r.setUpdatedAt(s.getUpdatedAt());
        return r;
    }
}
