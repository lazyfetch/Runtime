package com.runtime.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class CodeExecutionRequest
{
    private String code;
    private String language;
}

