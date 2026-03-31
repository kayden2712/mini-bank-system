package com.example.mini_bank_system.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mini_bank_system.dto.request.transaction.AmountRequest;
import com.example.mini_bank_system.dto.request.transaction.TransferRequest;
import com.example.mini_bank_system.dto.response.transaction.TransactionResponse;
import com.example.mini_bank_system.entity.Account;
import com.example.mini_bank_system.service.Account.AccountService;
import com.example.mini_bank_system.service.Transaction.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountService accountService;

    @PostMapping("/deposit")
    public TransactionResponse deposit(@Valid @RequestBody AmountRequest request) {
        return transactionService.deposit(request);
    }

    @PostMapping("/withdraw")
    public TransactionResponse withdraw(@Valid @RequestBody AmountRequest request) {
        return transactionService.withdraw(request);
    }

    @PostMapping("/transfer")
    public TransactionResponse transfer(@Valid @RequestBody TransferRequest request) {
        return transactionService.transfer(request);
    }

    @GetMapping("/history")
    public List<TransactionResponse> history(@RequestParam String accountNumber) {
        Account account = accountService.getByAccountNumber(accountNumber);
        return transactionService.getHistory(account, account);
    }
}
