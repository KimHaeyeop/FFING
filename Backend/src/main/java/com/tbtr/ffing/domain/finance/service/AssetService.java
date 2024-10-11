package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.asset.AccountAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AccountTransactionAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.user.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface AssetService {
    Map<String, Object> getAssetHomeInfo(long userId);

    List<Object> getDepositList(long userId);

    List<AccountAssetRes> getAccountList(long userId);

    List<?> getDepositTransactionList(String type, long accountId);

    List<AccountTransactionAssetRes> getAccountTransactionList(long accountId);

    void addAccountTransferToAsset(AccountTransaction newAccountTransaction, User user);
}
