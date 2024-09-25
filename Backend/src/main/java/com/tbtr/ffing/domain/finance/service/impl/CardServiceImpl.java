package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.request.card.CreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.dto.request.card.SsafyCreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.dto.request.card.cHeader;
import com.tbtr.ffing.domain.finance.dto.response.card.SsafyCreateCardTransactionRes;
import com.tbtr.ffing.domain.finance.entity.Card;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.repository.CardRepository;
import com.tbtr.ffing.domain.finance.repository.CardTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.service.CardService;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.openfeign.SsafyDeveloperClient;
import com.tbtr.ffing.global.util.InstitutionTransactionNoGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final SsafyDeveloperClient ssafyDeveloperClient;
    private final CardTransactionRepository cardTransactionRepository;
    private final UserRepository userRepository;
    private final ExpenseService expenseService;

    @Value("${SSAFY_DEVELOPER_API_KEY}")
    private String apiKey;

    /**
     * 카드 지출 발생
     */
    @Override
    @Transactional
    public void addCardTransaction(CreateCardTransactionReq createCardTransactionReq) {

        String userKey = createCardTransactionReq.getUserKey();
        String category = createCardTransactionReq.getCategory();

        String random = InstitutionTransactionNoGenerator.generateInstitutionTransactionUniqueNo();

        cHeader header = cHeader.of(
                apiKey,
                userKey,
                random
        );

        User user = userRepository.findByUserId(createCardTransactionReq.getUserId());

        SsafyCreateCardTransactionReq ssafyCreateCardTransactionReq = SsafyCreateCardTransactionReq.of(header, createCardTransactionReq.getCardNo(), createCardTransactionReq.getCvc(), createCardTransactionReq.getMerchantId(), createCardTransactionReq.getPaymentBalance());
        SsafyCreateCardTransactionRes res = ssafyDeveloperClient.createCreditCardTransaction(ssafyCreateCardTransactionReq);

        // cardNo로 card찾기
        Card card = cardRepository.findByCardNo(ssafyCreateCardTransactionReq.getCardNo());

        if(card != null) {
            // cardTransaction 추가
            CardTransaction newCardTransaction = res.toEntity(card);
            cardTransactionRepository.save(newCardTransaction);

            // expense 추가
            expenseService.addCardTransactionToExpense(newCardTransaction, user);
        }
    }

}