package com.runtime.service;

import com.runtime.model.*;
import com.runtime.repository.SavedCodeRepository;
import com.runtime.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedCodeService {

    private final SavedCodeRepository savedCodeRepository;
    private final UserRepository userRepository;

    public SavedCodeService(SavedCodeRepository savedCodeRepository, UserRepository userRepository) {
        this.savedCodeRepository = savedCodeRepository;
        this.userRepository = userRepository;
    }

    public List<SavedCodeResponse> getAllByUser(Long userId) {
        return savedCodeRepository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream().map(SavedCodeResponse::from).toList();
    }

    public SavedCodeResponse getOne(Long id, Long userId) {
        return savedCodeRepository.findByIdAndUserId(id, userId)
                .map(SavedCodeResponse::from)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public SavedCodeResponse create(Long userId, SavedCodeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SavedCode s = new SavedCode();
        s.setUser(user);
        s.setTitle(request.getTitle());
        s.setLanguage(request.getLanguage());
        s.setCode(request.getCode());

        return SavedCodeResponse.from(savedCodeRepository.save(s));
    }

    public SavedCodeResponse update(Long id, Long userId, SavedCodeRequest request) {
        SavedCode s = savedCodeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (request.getTitle() != null) s.setTitle(request.getTitle());
        if (request.getLanguage() != null) s.setLanguage(request.getLanguage());
        if (request.getCode() != null) s.setCode(request.getCode());

        return SavedCodeResponse.from(savedCodeRepository.save(s));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        savedCodeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        savedCodeRepository.deleteByIdAndUserId(id, userId);
    }
}
