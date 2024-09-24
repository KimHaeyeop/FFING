package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.request.card.CreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.dto.request.card.SsafyCreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.user.entity.SsafyUser;
import com.tbtr.ffing.domain.user.entity.User;
import org.springframework.transaction.annotation.Transactional;

public interface CardService {

    @Transactional
    void addCardTransaction(CreateCardTransactionReq createCardTransactionReq);
}
