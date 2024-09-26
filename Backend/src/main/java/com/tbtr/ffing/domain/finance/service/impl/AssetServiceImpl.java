package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.AssetDto;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.service.AssetService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Asset getCurrentAsset(long userId) {
        AssetDto assetDto = req.toEntity(user);
        return assetRepository.findCurrentAssetByUserId(userId);
    }

    @Override
    @Transactional
    public List<Asset> getAssetHistory(long userId) {
        return assetRepository.findAssetHistoryByUserId(userId);
    }
}
