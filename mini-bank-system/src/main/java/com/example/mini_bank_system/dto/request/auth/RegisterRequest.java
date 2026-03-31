package com.example.mini_bank_system.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(@NotBlank String fullName, @NotBlank @Email String email, @NotBlank String password) {}
