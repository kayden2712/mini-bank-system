package com.example.mini_bank_system.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.mini_bank_system.entity.Account;
import com.example.mini_bank_system.entity.User;
import com.example.mini_bank_system.enums.AccountStatus;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    @Mapping(target = "balance", expression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "status", expression = "java(AccountStatus.ACTIVE)")
    Account toAccount(User user);

}
