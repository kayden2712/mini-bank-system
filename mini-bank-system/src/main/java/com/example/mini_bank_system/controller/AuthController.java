package com.example.mini_bank_system.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.mini_bank_system.dto.request.auth.LoginRequest;
import com.example.mini_bank_system.dto.request.auth.RegisterRequest;
import com.example.mini_bank_system.dto.response.auth.AuthMessageResponse;
import com.example.mini_bank_system.dto.response.auth.LoginResponse;
import com.example.mini_bank_system.service.Auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthMessageResponse register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return new AuthMessageResponse("Register successful");
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return new LoginResponse(token, "Bearer");
    }

    @PostMapping("/logout")
    public AuthMessageResponse logout() {
        authService.logout();
        return new AuthMessageResponse("Logout successful");
    }
}
