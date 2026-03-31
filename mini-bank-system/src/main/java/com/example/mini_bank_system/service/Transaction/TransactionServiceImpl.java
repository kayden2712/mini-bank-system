package com.example.mini_bank_system.service.Transaction;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.example.mini_bank_system.dto.request.transaction.AmountRequest;
import com.example.mini_bank_system.dto.request.transaction.TransferRequest;
import com.example.mini_bank_system.dto.response.transaction.TransactionResponse;
import com.example.mini_bank_system.entity.Account;
import com.example.mini_bank_system.entity.Transaction;
import com.example.mini_bank_system.enums.AccountStatus;
import com.example.mini_bank_system.enums.TransactionType;
import com.example.mini_bank_system.mapper.TransactionMapper;
import com.example.mini_bank_system.repository.AccountRepository;
import com.example.mini_bank_system.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TransactionMapper mapper;

    @Override
    public TransactionResponse deposit(AmountRequest request) {
        validateAmount(request.amount());
        Account account = getAccountByAccountNumber(request.accountNumber());
        validateAccountActive(account);

        account.setBalance(account.getBalance().add(request.amount()));

        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setAmount(request.amount());
        transaction.setToAccount(account);
        transaction.setDescription("Deposit to " + account.getAccountNumber());

        return mapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    public TransactionResponse withdraw(AmountRequest request) {
        Account account = getAccountByAccountNumber(request.accountNumber());
        validateAmount(request.amount());
        validateAccountActive(account);
        validateAmountOut(account.getBalance(), request.amount());

        account.setBalance(account.getBalance().subtract(request.amount()));

        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setType(TransactionType.WITHDRAWAL);
        transaction.setAmount(request.amount());
        transaction.setFromAccount(account);
        transaction.setDescription("Withdraw from " + account.getAccountNumber());

        return mapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    public TransactionResponse transfer(TransferRequest request) {
        Account from = getAccountByAccountNumber(request.fromAccountNumber());
        Account to = getAccountByAccountNumber(request.toAccountNumber());

        validateAccountActive(to);
        validateAccountActive(from);
        validateAmount(request.amount());
        validateAmountOut(from.getBalance(), request.amount());
        validateAccountTransfer(from.getAccountNumber(), to.getAccountNumber());

        from.setBalance(from.getBalance().subtract(request.amount()));
        to.setBalance(to.getBalance().add(request.amount()));

        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setType(TransactionType.TRANSFER);
        transaction.setAmount(request.amount());
        transaction.setFromAccount(from);
        transaction.setToAccount(to);
        transaction.setDescription("Transfer from " + from.getAccountNumber() + " to " + to.getAccountNumber());
        return mapper.toResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getHistory(Account from, Account to) {
        return transactionRepository.findByFromAccountOrToAccountOrderByCreatedAtDesc(from, to).stream()
                .map(mapper::toResponse).toList();
    }

    private Account getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }
    }

    private void validateAccountActive(Account account) {
        if (account.getStatus() == null || account.getStatus() == AccountStatus.BLOCKED) {
            throw new RuntimeException("Account is not active");
        }
    }

    private void validateAmountOut(BigDecimal balance, BigDecimal amount) {
        if (balance.compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
    }

    private void validateAccountTransfer(String from, String to) {
        if (from.equals(to)) {
            throw new RuntimeException("Cannot transfer to the same account");
        }
    }

}
