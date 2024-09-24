package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.request.card.CreateCardTransactionReq;
import com.tbtr.ffing.domain.finance.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin")
@RestController
@RequiredArgsConstructor
public class AdminController {

    private final CardService cardService;

    // 카드 결제
    @PostMapping("/cardTransaction")
    public ResponseEntity<?> createCardTransaction(@RequestBody CreateCardTransactionReq createCardTransactionReq) {
        cardService.addCardTransaction(createCardTransactionReq);

        return ResponseEntity.status(HttpStatus.OK).body("카드 결제가 정상 처리되었습니다.");
    }


}
