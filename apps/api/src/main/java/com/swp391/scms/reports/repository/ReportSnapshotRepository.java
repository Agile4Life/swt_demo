package com.swp391.scms.reports.repository;

import com.swp391.scms.reports.entity.ReportSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportSnapshotRepository extends JpaRepository<ReportSnapshot, Long> {

    List<ReportSnapshot> findByReportType(String reportType);

    List<ReportSnapshot> findByPeriodStartBetween(LocalDate start, LocalDate end);

    List<ReportSnapshot> findAllByOrderByGeneratedAtDesc();
}
