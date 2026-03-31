package com.example.mini_bank_system.service.Auth;

import com.example.mini_bank_system.dto.request.auth.LoginRequest;
import com.example.mini_bank_system.dto.request.auth.RegisterRequest;

public interface AuthService {

    void register(RegisterRequest request);

    String login(LoginRequest request);

    void logout();
}
