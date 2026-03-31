package com.example.mini_bank_system.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.mini_bank_system.dto.request.account.AccountCreateRequest;
import com.example.mini_bank_system.dto.request.auth.LoginRequest;
import com.example.mini_bank_system.dto.request.auth.RegisterRequest;
import com.example.mini_bank_system.dto.request.transaction.AmountRequest;
import com.example.mini_bank_system.dto.response.transaction.TransactionResponse;
import com.example.mini_bank_system.entity.Account;
import com.example.mini_bank_system.entity.User;
import com.example.mini_bank_system.enums.AccountStatus;
import com.example.mini_bank_system.security.CustomUserDetailsService;
import com.example.mini_bank_system.security.JwtAuthenticationFilter;
import com.example.mini_bank_system.service.Account.AccountService;
import com.example.mini_bank_system.service.Auth.AuthService;
import com.example.mini_bank_system.service.Transaction.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = { AuthController.class, AccountController.class, TransactionController.class })
@AutoConfigureMockMvc(addFilters = false)
class ApiControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private AccountService accountService;

    @MockBean
    private TransactionService transactionService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void shouldRegisterUser() throws Exception {
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password@123");
        doNothing().when(authService).register(any(RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Register successful"));
    }

    @Test
    void shouldLoginUser() throws Exception {
        LoginRequest request = new LoginRequest("test@example.com", "Password@123");
        when(authService.login(any(LoginRequest.class))).thenReturn("mock-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void shouldCreateAccount() throws Exception {
        AccountCreateRequest request = new AccountCreateRequest("test@example.com");
        Account account = mockAccount("100001", "test@example.com");
        when(accountService.createAccount(any(AccountCreateRequest.class))).thenReturn(account);

        mockMvc.perform(post("/api/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountNumber").value("100001"))
                .andExpect(jsonPath("$.ownerEmail").value("test@example.com"));
    }

    @Test
    void shouldGetAccountByNumber() throws Exception {
        when(accountService.getByAccountNumber("100001")).thenReturn(mockAccount("100001", "owner@example.com"));

        mockMvc.perform(get("/api/accounts/100001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber").value("100001"))
                .andExpect(jsonPath("$.ownerEmail").value("owner@example.com"));
    }

    @Test
    void shouldDepositAndReturnTransaction() throws Exception {
        AmountRequest request = new AmountRequest("100001", BigDecimal.valueOf(500000));
        TransactionResponse response = new TransactionResponse(
                1L,
                "DEPOSIT",
                BigDecimal.valueOf(500000),
                "Deposit to 100001",
                null,
                "100001",
                LocalDateTime.now());
        when(transactionService.deposit(any(AmountRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/transactions/deposit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("DEPOSIT"))
                .andExpect(jsonPath("$.amount").value(500000));
    }

    @Test
    void shouldGetTransactionHistory() throws Exception {
        Account account = mockAccount("100001", "owner@example.com");
        when(accountService.getByAccountNumber(eq("100001"))).thenReturn(account);
        when(transactionService.getHistory(any(Account.class), any(Account.class))).thenReturn(List.of(
                new TransactionResponse(1L, "DEPOSIT", BigDecimal.valueOf(100000), "Deposit", null, "100001",
                        LocalDateTime.now())));

        mockMvc.perform(get("/api/transactions/history").param("accountNumber", "100001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("DEPOSIT"));
    }

    private Account mockAccount(String accountNumber, String ownerEmail) {
        User user = new User();
        user.setEmail(ownerEmail);

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber(accountNumber);
        account.setBalance(BigDecimal.valueOf(1000000));
        account.setStatus(AccountStatus.ACTIVE);
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        account.setUser(user);
        return account;
    }
}
