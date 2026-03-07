package com.runtime.security;

import com.runtime.config.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GuestTokenService
{
    private final JwtUtil jwtUtil;

    public GuestTokenService(JwtUtil jwtUtil)
    {
        this.jwtUtil = jwtUtil;
    }

    public String generateGuestToken()
    {
        String guestId = "guest_" + UUID.randomUUID();
        return jwtUtil.generateToken(guestId);
    }
}
