package com.runtime.repository;

import com.runtime.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Submission> findByUserIdAndSavedCodeIdOrderByCreatedAtDesc(Long userId, Long savedCodeId);
}
