package com.example.mini_bank_system.service.Auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mini_bank_system.dto.request.auth.LoginRequest;
import com.example.mini_bank_system.dto.request.auth.RegisterRequest;
import com.example.mini_bank_system.entity.User;
import com.example.mini_bank_system.mapper.UserMapper;
import com.example.mini_bank_system.repository.UserRepository;
import com.example.mini_bank_system.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("User already exists");
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
    }

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.emailOrAccountNumber())
                .or(() -> userRepository.findByAccountNumber(request.emailOrAccountNumber()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(user.getEmail(), user.getRole().name());
    }

    @Override
    public void logout() {
        // Stateless JWT logout is handled client-side by dropping token.
    }
}
