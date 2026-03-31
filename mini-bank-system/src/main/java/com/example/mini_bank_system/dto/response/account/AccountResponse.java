package com.example.mini_bank_system.dto.response.account;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.mini_bank_system.enums.AccountStatus;

public record AccountResponse(
        Long id,
        String accountNumber,
        BigDecimal balance,
        AccountStatus status,
        String ownerEmail,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
