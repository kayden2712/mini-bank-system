package com.example.mini_bank_system.dto.request.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String emailOrAccountNumber, @NotBlank String password) {

}
