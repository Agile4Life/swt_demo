package com.swp391.scms.users.mapper;

import com.swp391.scms.users.dto.UserDto;
import com.swp391.scms.users.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roleCode", source = "role.code")
    UserDto toDto(User user);
}
