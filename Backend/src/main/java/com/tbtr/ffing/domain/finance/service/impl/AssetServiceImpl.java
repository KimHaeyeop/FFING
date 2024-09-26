package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.service.AssetService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public AssetRes getCurrentAsset(long userId) {
        return assetRepository.findCurrentAssetByUserId(userId);
    }

    @Override
    @Transactional
    public List<AssetRes> getAssetHistory(long userId) {
        return assetRepository.findAssetHistoryByUserId(userId);
    }

    @Override
    public List<DepositAssetRes> getDepositList(long userId) {
        User user = userRepository.findByUserId(userId);
        long ssafyUserId = user.getSsafyUserId();
        Map<String, List<DepositAssetRes>> resultMap = new HashMap<>();
        resultMap.put("deposit", assetRepository.findDepositAssetListByUserId(ssafyUserId));
        resultMap.put("savings", assetRepository.findSavingsAssetListByUserId(ssafyUserId));
        List<DepositAssetRes> resultList = new ArrayList<>();
        resultMap.forEach((key, depositList) -> {
            for (int i = 0; i < depositList.size(); i++) {
                resultList.add(depositList.get(i));
            }
        });
        return resultList;
    }
}
