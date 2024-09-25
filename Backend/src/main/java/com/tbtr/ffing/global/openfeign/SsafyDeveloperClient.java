package com.tbtr.ffing.global.openfeign;

import com.tbtr.ffing.domain.finance.dto.request.card.SsafyCreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.dto.request.account.SsafyTransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.response.card.SsafyCreateCardTransactionRes;
import com.tbtr.ffing.domain.finance.dto.response.account.SsafyTransferDmdDepAccRes;
import com.tbtr.ffing.global.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "ssafy-developer-client",
	url = "https://finopenapi.ssafy.io/ssafy/api/v1",
	configuration = FeignClientConfig.class)
public interface SsafyDeveloperClient {

//	// 사용자 등록
//	@PostMapping("/member/")
//	SsafyJoinRes getUserKey(@RequestBody SsafyJoinReq ssafyJoinReq);
//
//	// 수시입출금 계좌생성
//	@PostMapping(path = "/edu/demandDeposit/createDemandDepositAccount")
//	SsafyCreateDmdDepAccRes createDemandDepositAccount(@RequestBody SsafyCreateDmdDepAccReq ssafyCreateDmdDepAccReq);
//
//	// 수시입출금 계좌입금
//	@PostMapping(path = "/edu/demandDeposit/updateDemandDepositAccountDeposit")
//	SsafyCreateDmdDepAccRes updateDemandDepositAccountDeposit(@RequestBody SsafyUpdateDmdDepAccReq ssafyUpdateDmdDepAccReq);
//
//	// 적금 계좌생성
//	@PostMapping(path = "/edu/savings/createAccount")
//	SsafyCreateMemSavingsAccRes createAccount(@RequestBody SsafyCreateMemSavingsAccReq ssafyCreateMemSavingsAccReq);
//
	// 수시입출금 계좌이체
	@PostMapping(path = "/edu/demandDeposit/updateDemandDepositAccountTransfer")
	SsafyTransferDmdDepAccRes updateDemandDepositAccountTransfer(SsafyTransferDmdDepAccReq ssafyTransferDmdDepAccReq);
//
//	// 수시입출금 계좌목록조회
//	@PostMapping(path = "/edu/demandDeposit/inquireDemandDepositAccountList")
//	SsafyInquireDmdDepAccListRes inquireDemandDepositAccountList(SsafyInquireDmdDepAccListReq ssafyInquireDmdDepAccListReq);
//
//	// 수시입출금 계좌단건조회
//	@PostMapping(path = "/edu/demandDeposit/inquireDemandDepositAccount")
//	SsafyInquireDmdDepAccRes inquireDemandDepositAccount(SsafyInquireDmdDepAccReq ssafyInquireDmdDepAccListReq);
//
//	// 적금 계좌목록조회
//	@PostMapping(path = "/edu/savings/inquireAccountList")
//	SsafyInquireMemSavingsAccListRes inquireAccountList(SsafyInquireMemSavingsAccListReq ssafyInquireMemSavingsAccListReq);
//
//	// 적금 납입내역 조회
//	@PostMapping(path = "/edu/savings/inquirePayment")
//	SsafyInquireMemSavingsPaymentRes inquirePayment(SsafyInquireMemSavingsPaymentReq ssafyInquireMemSavingsPaymentReq);
//
//	// 수시입출금 잔액조회
//	@PostMapping(path = "/edu/demandDeposit/inquireDemandDepositAccountBalance")
//	SsafyInquireDmdDepAccBalanceRes inquireDemandDepositAccountBalance(
//		SsafyInquireDmdDepAccBalanceReq ssafyInquireDmdDepAccBalanceReq);
//
//	// 적금 계좌단건조회
//	@PostMapping(path = "/edu/savings/inquireAccount")
//	SsafyInquireMemSavingsAccRes inquireAccount(SsafyInquireMemSavingsAccReq ssafyInquireMemSavingsAccReq);
//
//	// 수시입출금 거래내역조회
//	@PostMapping(path = "/edu/demandDeposit/inquireTransactionHistoryList")
//	SsafyInquireHistoryRes inquireDmdDepTransactionHistory(SsafyInquireHistoryReq ssafyInquireHistoryReq);

	// 카드 결제
	@PostMapping(path = "/edu/creditCard/createCreditCardTransaction")
	SsafyCreateCardTransactionRes createCreditCardTransaction(SsafyCreateCardTransactionReq ssafyCreateCardTransactionReq);
}
