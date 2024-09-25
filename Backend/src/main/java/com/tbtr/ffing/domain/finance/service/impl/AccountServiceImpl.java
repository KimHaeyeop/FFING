package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.request.account.SsafyTransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.account.TransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.account.tHeader;
import com.tbtr.ffing.domain.finance.dto.response.account.SsafyTransferDmdDepAccRes;
import com.tbtr.ffing.domain.finance.entity.Account;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.repository.AccountRepository;
import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.service.AccountService;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.openfeign.SsafyDeveloperClient;
import com.tbtr.ffing.global.util.InstitutionTransactionNoGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountTransactionRepository accountTransactionRepository;
    private final ExpenseRepository expenseRepository;
    private final SsafyDeveloperClient ssafyDeveloperClient;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final ExpenseService expenseService;

    @Value("${SSAFY_DEVELOPER_API_KEY}")
    private String apiKey;

    @Override
    @Transactional
    public void updateAccountTransfer(TransferDmdDepAccReq transferDmdDepAccReq) {

        String userKey = transferDmdDepAccReq.getUserKey();
        String random = InstitutionTransactionNoGenerator.generateInstitutionTransactionUniqueNo();

        tHeader header = tHeader.of(
                apiKey,
                userKey,
                random
        );

        User user = userRepository.findByUserId(transferDmdDepAccReq.getUserId());

        SsafyTransferDmdDepAccReq ssafyTransferDmdDepAccReq = SsafyTransferDmdDepAccReq.of(header, transferDmdDepAccReq.getDepositAccountNo(), transferDmdDepAccReq.getTransactionBalance(), transferDmdDepAccReq.getWithdrawalAccountNo(), transferDmdDepAccReq.getWithdrawalTransactionSummary());
        SsafyTransferDmdDepAccRes res = ssafyDeveloperClient.updateDemandDepositAccountTransfer(ssafyTransferDmdDepAccReq);

        Account account = accountRepository.findByAccountNo(transferDmdDepAccReq.getWithdrawalAccountNo());

        if(res.getHeader().getResponseCode().equals("H0000") && account!=null){

            // 현재 계좌 잔액 조회
            BigDecimal currentBalance = account.getAccountBalance();

            // 새로운 잔액 계산
            BigDecimal newBalance = currentBalance.subtract(transferDmdDepAccReq.getTransactionBalance());

            // accountTransaction 추가
            AccountTransaction newAccountTransaction = transferDmdDepAccReq.toEntity(
                    header.getTransmissionDate(),
                    header.getTransmissionTime(),
                    account,
                    newBalance
            );
            accountTransactionRepository.save(newAccountTransaction);

            // expense 추가
            expenseService.addAccountTransferToExpense(newAccountTransaction, user);

            // asset 업데이트 추가 필요

        }

    }


}
