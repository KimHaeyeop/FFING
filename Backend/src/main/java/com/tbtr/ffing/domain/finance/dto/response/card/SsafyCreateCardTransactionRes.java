package com.tbtr.ffing.domain.finance.dto.response.card;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.tbtr.ffing.domain.finance.entity.Card;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@JsonPropertyOrder({
	"header",
	"rec"
})
public class SsafyCreateCardTransactionRes {
	@JsonProperty("Header")
	private cHeader header;
	@JsonProperty("REC")
	private cREC rec;

	public CardTransaction toEntity(Card card, String categoryName) {
		cREC rec = this.rec;

		// 카테고리 로직 추가 확인 필요

		return CardTransaction.builder()
				.category(categoryName)
				.merchant(rec.getMerchantName())
				.transactionDate(rec.getTransactionDate())
				.transactionTime(rec.getTransactionTime())
				.paymentBalance(BigDecimal.valueOf(rec.getPaymentBalance()))
				.card(card)
				.build();
	}

}
