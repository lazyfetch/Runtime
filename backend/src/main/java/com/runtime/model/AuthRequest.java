package com.runtime.model;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String name;
    private String password;
}
