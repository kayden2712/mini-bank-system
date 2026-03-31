package com.example.mini_bank_system.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        String message,
        int status,
        LocalDateTime timestamp,
        Map<String, String> fieldErrors) {
}
