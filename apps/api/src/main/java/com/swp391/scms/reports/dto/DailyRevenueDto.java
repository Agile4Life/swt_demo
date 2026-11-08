package com.swp391.scms.reports.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Báo cáo doanh thu tài chính theo từng ngày")
public class DailyRevenueDto {

    @Schema(description = "Ngày ghi nhận doanh thu", example = "2026-10-05")
    private LocalDate date;

    @Schema(description = "Tổng doanh thu trong ngày (VNĐ)", example = "15000000.00")
    private BigDecimal revenue;

    @Schema(description = "Số lượng giao dịch thành công trong ngày", example = "12")
    private int transactionCount;

    public DailyRevenueDto() {}

    public DailyRevenueDto(LocalDate date, BigDecimal revenue, int transactionCount) {
        this.date = date;
        this.revenue = revenue;
        this.transactionCount = transactionCount;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public int getTransactionCount() { return transactionCount; }
    public void setTransactionCount(int transactionCount) { this.transactionCount = transactionCount; }
}
