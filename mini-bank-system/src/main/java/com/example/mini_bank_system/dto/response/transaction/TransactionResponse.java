package com.example.mini_bank_system.dto.response.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.mini_bank_system.enums.TransactionType;

public record TransactionResponse(Long id,
        String type,
        BigDecimal amount,
        String description,
        String fromAccountNumber,
        String toAccountNumber,
        LocalDateTime createdAt) {

}
