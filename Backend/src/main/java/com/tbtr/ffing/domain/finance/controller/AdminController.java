package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.request.account.TransferDmdDepAccReq;
import com.tbtr.ffing.domain.finance.dto.request.card.CreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.service.AccountService;
import com.tbtr.ffing.domain.finance.service.CardService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin")
@RestController
@RequiredArgsConstructor
public class AdminController {

    private final CardService cardService;
    private final AccountService accountService;

    // 카드 결제
    @PostMapping("/cardTransaction")
    public ResponseEntity<Response<Void>> createCardTransaction(@RequestBody CreateCardTransactionReq createCardTransactionReq) {
        cardService.addCardTransaction(createCardTransactionReq);

        return ResponseEntity.ok(Response.<Void>builder()
                .code(200L)
                .message("카드결제가 정상 처리되었습니다.")
                .build());
    }

    // 계좌이체
    @PostMapping("/accountTransfer")
    public ResponseEntity<Response<Void>> updateAccountTransfer(@RequestBody TransferDmdDepAccReq transferDmdDepAccReq) {
        accountService.updateAccountTransfer(transferDmdDepAccReq);

        return ResponseEntity.ok(Response.<Void>builder()
                .code(200L)
                .message("계좌이체가 정상 처리되었습니다.")
                .build());
    }
}