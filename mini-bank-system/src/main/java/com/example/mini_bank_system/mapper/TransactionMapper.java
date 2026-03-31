package com.example.mini_bank_system.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.mini_bank_system.dto.response.transaction.TransactionResponse;
import com.example.mini_bank_system.entity.Transaction;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(source = "type", target = "type")
    @Mapping(source = "fromAccount.accountNumber", target = "fromAccountNumber")
    @Mapping(source = "toAccount.accountNumber", target = "toAccountNumber")
    TransactionResponse toResponse(Transaction transaction);
}
