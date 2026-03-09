package com.runtime.controller;

import com.runtime.config.JwtUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.SavedCodeRequest;
import com.runtime.model.SavedCodeResponse;
import com.runtime.service.SavedCodeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codes")
public class SavedCodeController {

    private final SavedCodeService savedCodeService;
    private final JwtUtil jwtUtil;

    public SavedCodeController(SavedCodeService savedCodeService, JwtUtil jwtUtil) {
        this.savedCodeService = savedCodeService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    @GetMapping
    public ApiResponse<List<SavedCodeResponse>> getAll(
            @RequestHeader("Authorization") String authHeader) {
        return ApiResponse.success("OK", savedCodeService.getAllByUser(extractUserId(authHeader)));
    }

    @GetMapping("/{id}")
    public ApiResponse<SavedCodeResponse> getOne(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        return ApiResponse.success("OK", savedCodeService.getOne(id, extractUserId(authHeader)));
    }

    @PostMapping
    public ApiResponse<SavedCodeResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SavedCodeRequest request) {
        return ApiResponse.success("Created", savedCodeService.create(extractUserId(authHeader), request));
    }

    @PatchMapping("/{id}")
    public ApiResponse<SavedCodeResponse> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody SavedCodeRequest request) {
        return ApiResponse.success("Updated", savedCodeService.update(id, extractUserId(authHeader), request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        savedCodeService.delete(id, extractUserId(authHeader));
        return ApiResponse.success("Deleted", null);
    }
}
