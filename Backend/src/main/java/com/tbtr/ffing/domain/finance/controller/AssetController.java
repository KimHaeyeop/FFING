package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.AssetDto;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/finance")
public class AssetController {
    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/asset")
    public ResponseEntity<Object> selectAsset(Long userId) {
        Asset asset = assetService.getCurrentAsset(userId);
//        List<Asset> assets = assetService.getAssetHistory(userId);
        return new ResponseEntity<>(asset, HttpStatus.OK);
    }

    @GetMapping("/asset/list")
    public ResponseEntity<Object> selectAssetList(long userId) {
//        List<Asset> assets = assetService.getAssetList(userId);
//        return new ResponseEntity<>(assets, HttpStatus.OK);
        return null;
    }
}
