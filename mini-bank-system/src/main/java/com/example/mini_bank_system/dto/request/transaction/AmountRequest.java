package com.example.mini_bank_system.dto.request.transaction;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AmountRequest(@NotBlank String accountNumber, @NotNull BigDecimal amount) {

}
