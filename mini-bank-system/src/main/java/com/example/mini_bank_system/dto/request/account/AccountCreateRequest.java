package com.example.mini_bank_system.dto.request.account;

import jakarta.validation.constraints.NotBlank;

public record AccountCreateRequest(@NotBlank String email) {

}
