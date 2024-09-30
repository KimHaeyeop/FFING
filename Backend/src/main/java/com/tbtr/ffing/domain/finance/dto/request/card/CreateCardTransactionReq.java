package com.tbtr.ffing.domain.finance.dto.request.card;

import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.user.entity.User;
import lombok.*;

/**
 * ffing 카드결제 요청에 사용되는 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CreateCardTransactionReq {

    private String userKey;
    private Long userId;
    private ExpenseCategory category;
    private String cardNo; // 카드번호
    private String cvc; // 카드보안번호
    private Long merchantId; // 가맹점ID
    private Long paymentBalance; // 거래금액


}
