package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.service.AssetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssetServiceImpl implements AssetService {
    private final AssetRepository assetRepository;

    public AssetServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    @Transactional
    public Asset getAsset(long userId) {
        return assetRepository.findCurrentAssetByUserId(userId);
    }
}
