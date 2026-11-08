package com.swp391.scms.finance.mapper;

import com.swp391.scms.finance.dto.InvoiceCreateDto;
import com.swp391.scms.finance.dto.InvoiceDto;
import com.swp391.scms.finance.dto.InvoiceItemCreateDto;
import com.swp391.scms.finance.dto.InvoiceItemDto;
import com.swp391.scms.finance.entity.Invoice;
import com.swp391.scms.finance.entity.InvoiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

/**
 * MapStruct mapper for Invoice and InvoiceItem entities and DTOs.
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InvoiceMapper {

    @Mapping(source = "payment.id", target = "paymentId")
    @Mapping(source = "items", target = "items")
    InvoiceDto toDto(Invoice entity);

    List<InvoiceDto> toDtoList(List<Invoice> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "items", ignore = true)
    Invoice toEntity(InvoiceCreateDto dto);

    @Mapping(source = "invoice.id", target = "invoiceId")
    InvoiceItemDto toItemDto(InvoiceItem entity);

    List<InvoiceItemDto> toItemDtoList(List<InvoiceItem> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "amount", ignore = true)
    InvoiceItem toItemEntity(InvoiceItemCreateDto dto);

    List<InvoiceItem> toItemEntityList(List<InvoiceItemCreateDto> dtos);
}
