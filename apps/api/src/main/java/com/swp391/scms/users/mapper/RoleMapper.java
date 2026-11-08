package com.swp391.scms.users.mapper;

import com.swp391.scms.users.dto.PermissionDto;
import com.swp391.scms.users.dto.RoleDto;
import com.swp391.scms.users.entity.Permission;
import com.swp391.scms.users.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDto toDto(Role role);
    PermissionDto toDto(Permission permission);
}
