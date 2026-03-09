package com.runtime.model;

import lombok.Data;

@Data
public class SavedCodeRequest {
    private String title;
    private String language;
    private String code;
}
