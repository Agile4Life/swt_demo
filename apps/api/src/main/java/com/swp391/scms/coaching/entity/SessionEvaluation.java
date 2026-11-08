package com.swp391.scms.coaching.entity;

import com.swp391.scms.scheduling.entity.ClassSession;
import com.swp391.scms.users.entity.Coach;
import com.swp391.scms.users.entity.Member;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.Length;

/** Entity mapping table session_evaluations (schema is generated code-first by Hibernate). */
@Entity
@Table(name = "session_evaluations")
public class SessionEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private ClassSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @Column(name = "performance_notes", length = Length.LONG32)
    private String performanceNotes;

    @Column(name = "progress_score", precision = 4, scale = 1)
    private BigDecimal progressScore;

    @Column(name = "feedback", length = Length.LONG32)
    private String feedback;

    @Column(name = "evaluated_at", nullable = false)
    private LocalDateTime evaluatedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public ClassSession getSession() { return session; }
    public void setSession(ClassSession session) { this.session = session; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public Coach getCoach() { return coach; }
    public void setCoach(Coach coach) { this.coach = coach; }
    public String getPerformanceNotes() { return performanceNotes; }
    public void setPerformanceNotes(String performanceNotes) { this.performanceNotes = performanceNotes; }
    public BigDecimal getProgressScore() { return progressScore; }
    public void setProgressScore(BigDecimal progressScore) { this.progressScore = progressScore; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
