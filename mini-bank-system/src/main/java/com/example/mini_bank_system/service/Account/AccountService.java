package com.example.mini_bank_system.service.Account;

import com.example.mini_bank_system.dto.request.account.AccountCreateRequest;
import com.example.mini_bank_system.entity.Account;

public interface AccountService {
    Account createAccount(AccountCreateRequest request);

    void closeAccount(Long userId);

    Account getByAccountNumber(String accountNumber);
}
