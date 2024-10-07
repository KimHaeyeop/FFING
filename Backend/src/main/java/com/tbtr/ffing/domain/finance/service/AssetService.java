package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.asset.AccountAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AccountTransactionAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import org.springframework.stereotype.Service;

import java.util.List;

public interface AssetService {
    AssetRes getCurrentAsset(long userId);

    List<AssetRes> getAssetHistory(long userId);

    List<Object> getDepositList(long userId);

    List<AccountAssetRes> getAccountList(long userId);

    List<?> getDepositTransactionList(String type, long accountId);

    List<AccountTransactionAssetRes> getAccountTransactionList(long accountId);
}
