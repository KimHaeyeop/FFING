package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.asset.AccountAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
import com.tbtr.ffing.domain.finance.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asset")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping("")
    public ResponseEntity<Object> selectTotalAsset(@RequestParam long userId) {
        Map<String, Object> resultMap = new HashMap<>();
        AssetRes currentAsset = assetService.getCurrentAsset(userId);
        resultMap.put("currentAsset", currentAsset);
        List<AssetRes> assets = assetService.getAssetHistory(userId);
        resultMap.put("assets", assets);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/deposit")
    public ResponseEntity<Object> selectDepositAsset(@RequestParam long userId) {
        List<Object> deposits = assetService.getDepositList(userId);
        return new ResponseEntity<>(deposits, HttpStatus.OK);
    }

    @GetMapping("/deposit/{type}/{accountId}")
    public ResponseEntity<Object> selectDepositTransactionList(@PathVariable String type, @PathVariable long accountId) {
        List<?> transactions = assetService.getDepositTransactionList(type, accountId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/account")
    public ResponseEntity<Object> selectAccountAsset(@RequestParam long userId) {
        List<AccountAssetRes> accounts = assetService.getAccountList(userId);
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<Object> selectAccountTransactionList(@PathVariable long accountId) {
        List<AccountTransactionAssetRes> transactions = assetService.getAccountTransactionList(accountId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }
}
