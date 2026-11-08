package com.swp391.scms.ai.entity;

import com.swp391.scms.users.entity.Coach;
import com.swp391.scms.users.entity.Member;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Entity mapping table ai_recommendation_logs (schema is generated code-first by Hibernate). */
@Entity
@Table(name = "ai_recommendation_logs")
public class AiRecommendationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "input_context", nullable = false)
    private String inputContext;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "recommended_content", nullable = false)
    private String recommendedContent;

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "is_applied", nullable = false)
    private boolean applied;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Coach getCoach() { return coach; }
    public void setCoach(Coach coach) { this.coach = coach; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public String getInputContext() { return inputContext; }
    public void setInputContext(String inputContext) { this.inputContext = inputContext; }
    public String getRecommendedContent() { return recommendedContent; }
    public void setRecommendedContent(String recommendedContent) { this.recommendedContent = recommendedContent; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public boolean isApplied() { return applied; }
    public void setApplied(boolean applied) { this.applied = applied; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
