package com.tbtr.ffing.domain.finance.dto.response.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.util.List;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@JsonPropertyOrder({
	"header",
	"rec"
})
public class SsafyTransferDmdDepAccRes {
	@JsonProperty("Header")
	private tHeader header;
	@JsonProperty("REC")
	private List<tREC> rec;

}
