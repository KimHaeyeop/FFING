package com.tbtr.ffing.domain.finance.dto.request.card;

import com.tbtr.ffing.domain.user.entity.User;
import lombok.*;

/**
 * ffing 카드결제
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CreateCardTransactionReq {

    private String userKey;
    private User user;
    private String category;
    private SsafyCreateCardTransactionReq ssafyCreateCardTransactionReq;

}
