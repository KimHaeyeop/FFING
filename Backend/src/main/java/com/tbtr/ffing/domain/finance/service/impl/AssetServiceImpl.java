package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.asset.AccountAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AccountTransactionAssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.AssetService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;

    @Override
    @Transactional
    public Map<String, Object> getAssetHomeInfo(long userId) {
        Map<String, Object> assetHomeInfoMap = new HashMap<>();

        String year = String.valueOf(LocalDate.now().getYear());
        Goal assetGoal = goalRepository.findGoalByUserIdAndYear(userId, year);
        assetHomeInfoMap.put("assetGoal", assetGoal);
        AssetRes currentAsset = assetRepository.findCurrentAssetByUserId(userId);
        assetHomeInfoMap.put("currentAsset", currentAsset);
        List<AssetRes> assetHistory = assetRepository.findAssetHistoryByUserId(userId);
        assetHomeInfoMap.put("assetHistory", assetHistory);

        return assetHomeInfoMap;
    }

    @Override
    @Transactional
    public List<Object> getDepositList(long userId) {
        User user = userRepository.findByUserId(userId);
        long ssafyUserId = user.getSsafyUserId();
        Map<String, List<?>> resultMap = new HashMap<>();
        resultMap.put("deposit", assetRepository.findDepositAssetListByUserId(ssafyUserId));
        resultMap.put("savings", assetRepository.findSavingsAssetListByUserId(ssafyUserId));
        List<Object> resultList = new ArrayList<>();
        resultMap.forEach((key, depositList) -> {
            for (int i = 0; i < depositList.size(); i++) {
                resultList.add(depositList.get(i));
            }
        });
        return resultList;
    }

    @Override
    @Transactional
    public List<AccountAssetRes> getAccountList(long userId) {
        User user = userRepository.findByUserId(userId);
        long ssafyUserId = user.getSsafyUserId();
        return assetRepository.findAccountAssetListByUserId(ssafyUserId);
    }

    @Override
    @Transactional
    public List<?> getDepositTransactionList(String type, long accountId) {
        List<?> resultList = new ArrayList<>();
        if (type.equals("deposit")) {
            resultList = assetRepository.findDepositTransactionByDepositAccountId(accountId);
        } else if (type.equals("savings")) {
            resultList = assetRepository.findSavingsTransactionBySavingsAccountId(accountId);
        }
        return resultList;
    }

    @Override
    @Transactional
    public List<AccountTransactionAssetRes> getAccountTransactionList(long accountId) {
        return assetRepository.findAccountTransactionByAccountId(accountId);
    }

    @Override
    public Asset addAccountTransferToAsset(AccountTransaction newAccountTransaction, User user) {
        AssetRes nowAssetRes = assetRepository.findCurrentAssetByUserId(user.getUserId());
        LocalDate now = LocalDate.now();
        String nowStr = now.format(DateTimeFormatter.BASIC_ISO_DATE);

        Asset newAsset = null;

        if (nowAssetRes.getUpdatedDate().substring(0, 6).equals(nowStr.substring(0, 6))) {
            newAsset = nowAssetRes.toOldEntity(user);
        } else {
            newAsset = nowAssetRes.toNewEntity(user);
        }

        BigDecimal totalAsset = nowAssetRes.getTotalAsset();
        BigDecimal accountBallance = nowAssetRes.getAccountBalance();
        BigDecimal transactionBalance = newAccountTransaction.getTransactionBalance();

        if (newAccountTransaction.getTransactionType().equals("1")) {
            newAsset.setTotalAsset(totalAsset.add(transactionBalance));
            newAsset.setAccountBalance(accountBallance.add(transactionBalance));
        } else {
            newAsset.setTotalAsset(totalAsset.subtract(transactionBalance));
            newAsset.setAccountBalance(accountBallance.subtract(transactionBalance));
        }

        return newAsset;
    }
}
