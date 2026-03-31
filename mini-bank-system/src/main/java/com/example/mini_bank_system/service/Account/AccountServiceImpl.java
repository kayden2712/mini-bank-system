package com.example.mini_bank_system.service.Account;

import java.math.BigDecimal;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.example.mini_bank_system.dto.request.account.AccountCreateRequest;
import com.example.mini_bank_system.entity.Account;
import com.example.mini_bank_system.entity.User;
import com.example.mini_bank_system.enums.AccountStatus;
import com.example.mini_bank_system.repository.AccountRepository;
import com.example.mini_bank_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public Account createAccount(AccountCreateRequest request) {
        // User user = getUserByEmail(request.email());
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("user not found"));

        Account account = new Account();
        account.setUser(user);
        account.setBalance(BigDecimal.ZERO);
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setStatus(AccountStatus.ACTIVE);

        return accountRepository.save(account);

    }

    @Override
    public void closeAccount(Long userId) {

    }

    @Override
    public Account getByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber).orElseThrow(()-> new RuntimeException("Account not found"));
    }

    private String generateUniqueAccountNumber(){
        String accountNumber;
        do{
            int number = (100000 + new Random().nextInt(900000));
            accountNumber = String.valueOf(number);
        }
        while(accountRepository.findByAccountNumber(accountNumber).isPresent());
            return accountNumber;
    }

    // private User getUserByEmail(String email){
    // return userRepository.findByEmail(email)
    // .orElseThrow(() -> new RuntimeException("User not found"));
    // }
}
