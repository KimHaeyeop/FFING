package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
import com.tbtr.ffing.domain.finance.entity.Asset;

import java.util.List;

public interface AssetRepositoryCustom {
    AssetRes findCurrentAssetByUserId(long userId);

    List<AssetRes> findAssetHistoryByUserId(long userId);

    List<DepositAssetRes> findDepositAssetListByUserId(long ssafyUserId);

    List<DepositAssetRes> findSavingsAssetListByUserId(long ssafyUserId);
}
