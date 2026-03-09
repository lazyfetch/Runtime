package com.runtime.controller;

import com.runtime.config.JwtUtil;
import com.runtime.model.ApiResponse;
import com.runtime.model.SubmissionResponse;
import com.runtime.service.SubmissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final JwtUtil jwtUtil;

    public SubmissionController(SubmissionService submissionService, JwtUtil jwtUtil) {
        this.submissionService = submissionService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
    }

    @GetMapping
    public ApiResponse<List<SubmissionResponse>> getAll(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Long projectId) {
        Long userId = extractUserId(authHeader);
        if (projectId != null) {
            return ApiResponse.success("OK", submissionService.getByUserAndProject(userId, projectId));
        }
        return ApiResponse.success("OK", submissionService.getByUser(userId));
    }
}
