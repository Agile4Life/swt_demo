package com.swp391.scms.auth.repository;

import com.swp391.scms.auth.entity.OtpChallenge;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select challenge from OtpChallenge challenge where lower(challenge.target) = lower(:target)")
    Optional<OtpChallenge> findByTargetForUpdate(@Param("target") String target);

    // Bulk deletes run immediately so a following insert of the same unique target cannot collide
    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from OtpChallenge challenge where lower(challenge.target) = lower(:target)")
    void deleteByTargetIgnoreCase(@Param("target") String target);

    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from OtpChallenge challenge where challenge.expiresAt < :cutoff")
    void deleteByExpiresAtBefore(@Param("cutoff") java.time.LocalDateTime cutoff);
}
