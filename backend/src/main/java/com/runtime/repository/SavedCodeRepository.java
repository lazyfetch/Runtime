package com.runtime.repository;

import com.runtime.model.SavedCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedCodeRepository extends JpaRepository<SavedCode, Long> {
    List<SavedCode> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<SavedCode> findByIdAndUserId(Long id, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
}
