package com.runtime.security;

import com.runtime.config.JwtUtil;
import com.runtime.model.AuthProvider;
import com.runtime.model.User;
import com.runtime.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GuestTokenService
{
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public GuestTokenService(JwtUtil jwtUtil, UserRepository userRepository)
    {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    public String generateGuestToken()
    {
        String guestEmail = "guest_" + UUID.randomUUID();

        User guest = new User();
        guest.setEmail(guestEmail);
        guest.setName("Guest");
        guest.setPassword(null);
        guest.setProvider(AuthProvider.LOCAL);
        userRepository.save(guest);

        return jwtUtil.generateToken(guestEmail);
    }
}
