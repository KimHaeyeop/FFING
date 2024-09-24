package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AssetController {
    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/asset")
    public ResponseEntity<Object> selectAsset(long userId) {
        Asset asset = assetService.getAsset(userId);
        return new ResponseEntity<>(asset, HttpStatus.OK);
    }
}
