package com.example.mini_bank_system.service.Transaction;

import java.util.List;

import com.example.mini_bank_system.dto.request.transaction.AmountRequest;
import com.example.mini_bank_system.dto.request.transaction.TransferRequest;
import com.example.mini_bank_system.dto.response.transaction.TransactionResponse;
import com.example.mini_bank_system.entity.Account;

public interface TransactionService {
    TransactionResponse deposit(AmountRequest request);

    TransactionResponse withdraw(AmountRequest request);

    TransactionResponse transfer( TransferRequest request);

    List<TransactionResponse> getHistory(Account from, Account to);
}
