package com.swp391.scms.reports.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Báo cáo doanh thu và tỷ trọng theo từng gói tập")
public class PackageRevenueDto {

    @Schema(description = "ID gói tập", example = "1")
    private Long packageId;

    @Schema(description = "Tên gói tập", example = "Gói Gold 6 Tháng")
    private String packageName;

    @Schema(description = "Tổng doanh thu từ gói này (VNĐ)", example = "45000000.00")
    private BigDecimal revenue;

    @Schema(description = "Số lượng đăng ký gói", example = "15")
    private int subscriptionCount;

    @Schema(description = "Tỷ trọng doanh thu (%) so với tổng", example = "35.5")
    private Double percentage;

    public PackageRevenueDto() {}

    public PackageRevenueDto(Long packageId, String packageName, BigDecimal revenue, int subscriptionCount, Double percentage) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.revenue = revenue;
        this.subscriptionCount = subscriptionCount;
        this.percentage = percentage;
    }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public int getSubscriptionCount() { return subscriptionCount; }
    public void setSubscriptionCount(int subscriptionCount) { this.subscriptionCount = subscriptionCount; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}
