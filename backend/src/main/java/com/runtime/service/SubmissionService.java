package com.runtime.service;

import com.runtime.model.*;
import com.runtime.repository.SavedCodeRepository;
import com.runtime.repository.SubmissionRepository;
import com.runtime.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final SavedCodeRepository savedCodeRepository;

    public SubmissionService(SubmissionRepository submissionRepository,
                             UserRepository userRepository,
                             SavedCodeRepository savedCodeRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.savedCodeRepository = savedCodeRepository;
    }

    public SubmissionResponse record(Long userId, String language, String code,
                                     ExecutionResult result, Long savedCodeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String status = deriveStatus(result);

        Submission s = new Submission();
        s.setUser(user);
        s.setLanguage(language);
        s.setCode(code);
        s.setStdout(result.getStdout());
        s.setStderr(result.getStderr());
        s.setStatus(status);
        s.setExecutionTime(result.getExecutionTime());

        if (savedCodeId != null) {
            savedCodeRepository.findById(savedCodeId).ifPresent(s::setSavedCode);
        }

        return SubmissionResponse.from(submissionRepository.save(s));
    }

    public List<SubmissionResponse> getByUser(Long userId) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(SubmissionResponse::from).toList();
    }

    public List<SubmissionResponse> getByUserAndProject(Long userId, Long projectId) {
        return submissionRepository.findByUserIdAndSavedCodeIdOrderByCreatedAtDesc(userId, projectId)
                .stream().map(SubmissionResponse::from).toList();
    }

    private String deriveStatus(ExecutionResult result) {
        if ("TIMEOUT".equals(result.getErrorType())) return "TIMEOUT";
        if (result.getExitCode() == 0) return "SUCCESS";
        return "ERROR";
    }
}
