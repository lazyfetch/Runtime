package com.runtime.controller;

import com.runtime.model.AuthRequest;
import com.runtime.model.AuthResponse;
import com.runtime.service.AuthService;
import com.runtime.security.GuestTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController
{
    private final AuthService authService;
    private final GuestTokenService guestTokenService;

    public AuthController(AuthService authService, GuestTokenService guestTokenService)
    {
        this.authService = authService;
        this.guestTokenService = guestTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request)
    {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request)
    {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/guest")
    public ResponseEntity<AuthResponse> guest()
    {
        String token = guestTokenService.generateGuestToken();
        return ResponseEntity.ok(new AuthResponse(token, "guest", "GUEST"));
    }

}
