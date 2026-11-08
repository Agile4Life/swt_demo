package com.swp391.scms.finance.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object for creating an Invoice.
 */
@Schema(description = "Yêu cầu phát hành hóa đơn mới")
public class InvoiceCreateDto {

    @NotNull(message = "{validation.invoice.payment_id.not_null}")
    @Schema(description = "ID giao dịch thanh toán gắn với hóa đơn này", example = "10")
    private Long paymentId;

    @Schema(description = "Mã số hóa đơn (nếu để trống hệ thống sẽ tự sinh theo format INV-YYYYMMDD-XXXX)", example = "INV-20260924-0001")
    private String invoiceNumber;

    @Schema(description = "Thời gian phát hành hóa đơn (mặc định hiện tại nếu null)")
    private LocalDateTime issuedAt;

    @NotNull(message = "{validation.invoice.subtotal.not_null}")
    @DecimalMin(value = "0.0", message = "{validation.invoice.subtotal.min}")
    @Schema(description = "Tổng tiền trước thuế (VNĐ)", example = "1000000.00")
    private BigDecimal subtotalAmount;

    @DecimalMin(value = "0.0", message = "{validation.invoice.tax.min}")
    @Schema(description = "Tiền thuế VAT (VNĐ, mặc định 0 nếu không có)", example = "100000.00")
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Schema(description = "Đường dẫn file PDF hóa đơn điện tử nếu có")
    private String pdfUrl;

    @Valid
    @Schema(description = "Danh sách chi tiết dòng sản phẩm/dịch vụ trên hóa đơn")
    private List<InvoiceItemCreateDto> items = new ArrayList<>();

    public InvoiceCreateDto() {}

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public BigDecimal getSubtotalAmount() {
        return subtotalAmount;
    }

    public void setSubtotalAmount(BigDecimal subtotalAmount) {
        this.subtotalAmount = subtotalAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public List<InvoiceItemCreateDto> getItems() {
        return items;
    }

    public void setItems(List<InvoiceItemCreateDto> items) {
        this.items = items;
    }
}
