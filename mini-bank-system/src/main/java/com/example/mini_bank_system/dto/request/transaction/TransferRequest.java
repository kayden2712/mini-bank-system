package com.example.mini_bank_system.dto.request.transaction;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TransferRequest(@NotBlank String fromAccountNumber, @NotBlank String toAccountNumber, @NotNull BigDecimal amount) {

}
