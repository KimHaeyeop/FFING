package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
import com.tbtr.ffing.domain.finance.entity.Asset;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AssetService {
    AssetRes getCurrentAsset(long userId);

    List<AssetRes> getAssetHistory(long userId);

    List<Object> getDepositList(long userId);
}
