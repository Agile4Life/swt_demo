package com.swp391.scms.ai.repository;

import com.swp391.scms.ai.entity.AiRecommendationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiRecommendationLogRepository extends JpaRepository<AiRecommendationLog, Long> {

    List<AiRecommendationLog> findByMemberUserId(Long memberId);

    List<AiRecommendationLog> findByCoachUserId(Long coachId);
}
