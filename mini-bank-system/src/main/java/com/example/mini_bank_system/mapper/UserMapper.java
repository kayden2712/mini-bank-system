package com.example.mini_bank_system.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.mini_bank_system.dto.request.auth.RegisterRequest;
import com.example.mini_bank_system.entity.User;
import com.example.mini_bank_system.enums.Role;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "role", expression = "java(Role.USER)")
    User toUser(RegisterRequest request);

}
