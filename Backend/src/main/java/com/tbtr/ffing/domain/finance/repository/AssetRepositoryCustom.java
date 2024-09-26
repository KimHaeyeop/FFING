package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Asset;

import java.util.List;

public interface AssetRepositoryCustom {
    Asset findCurrentAssetByUserId(long userId);

    List<Asset> findAssetHistoryByUserId(long userId);
}
