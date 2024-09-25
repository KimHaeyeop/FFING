package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.entity.Asset;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AssetService {
    Asset getCurrentAsset(long userId);

    List<Asset> getAssetHistory(long userId);

    List<Asset> getAssetList(long userId);
}
