package com.swp391.scms.reports.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Thông tin chi tiết ảnh chụp báo cáo")
public class ReportSnapshotDto {

    @Schema(description = "ID ảnh chụp báo cáo", example = "1")
    private Long id;

    @Schema(description = "Loại báo cáo", example = "REVENUE_DAILY")
    private String reportType;

    @Schema(description = "Ngày bắt đầu kỳ", example = "2026-10-01")
    private LocalDate periodStart;

    @Schema(description = "Ngày kết thúc kỳ", example = "2026-10-31")
    private LocalDate periodEnd;

    @Schema(description = "Dữ liệu báo cáo dạng JSON")
    private String data;

    @Schema(description = "ID người khởi tạo", example = "1")
    private Long generatedById;

    @Schema(description = "Họ tên người khởi tạo", example = "Quản lý Nguyễn Văn A")
    private String generatedByName;

    @Schema(description = "Thời điểm lưu ảnh chụp báo cáo")
    private LocalDateTime generatedAt;

    public ReportSnapshotDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public Long getGeneratedById() { return generatedById; }
    public void setGeneratedById(Long generatedById) { this.generatedById = generatedById; }

    public String getGeneratedByName() { return generatedByName; }
    public void setGeneratedByName(String generatedByName) { this.generatedByName = generatedByName; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
