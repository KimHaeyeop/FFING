package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountSCInfoRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfosRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountSCInfosRes;
import com.tbtr.ffing.domain.finance.service.StockService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/stock")
@RestController
@RequiredArgsConstructor
@Slf4j
public class StockController {
    private final StockService stockService;

    @GetMapping("/test")
    public void test() {
        System.out.println("stock test");
    }

    @GetMapping("/{ssafyUserId}")
    public ResponseEntity<?> getStockAccountsInfo(@PathVariable("ssafyUserId") Long ssafyUserId) {
        GetStockAccountInfosRes getStockAccountInfosResult = stockService.getStockAccountInfoSummary(ssafyUserId);

        Response<Object> response = Response.builder()
                    .code(200L)
                    .message("성공")
                    .result(getStockAccountInfosResult)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{ssafyUserId}/{stockAccountId}")
    public ResponseEntity<?> getStockAccountSCInfos(@PathVariable("ssafyUserId") Long ssafyUserId, @PathVariable("stockAccountId") Long stockAccountId) {
        GetStockAccountSCInfosRes getStockAccountSCInfoResult = stockService.getStockAccountSCInfos(ssafyUserId, stockAccountId);

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(getStockAccountSCInfoResult)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
