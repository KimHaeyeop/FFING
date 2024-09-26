package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountSCInfoRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfoRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfosRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountSCInfosRes;
import com.tbtr.ffing.domain.finance.entity.StockAccount;
import com.tbtr.ffing.domain.finance.entity.StockTransaction;
import com.tbtr.ffing.domain.finance.repository.StockInfoRepository;
import com.tbtr.ffing.domain.finance.repository.StockAccountRepository;
import com.tbtr.ffing.domain.finance.repository.StockTransactionRepository;
import com.tbtr.ffing.domain.finance.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockServiceImpl implements StockService {
    private final StockAccountRepository stockAccountRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final StockInfoRepository stockInfoRepository;

    @Override
    @Transactional(readOnly = true)
    public GetStockAccountInfosRes getStockAccountInfoSummary(Long ssafyUserId) {
        List<StockAccount> stockAccountList = stockAccountRepository.findAllBySsafyUserId(ssafyUserId);

        List<GetStockAccountInfoRes> stockAccountInfoResList = stockAccountList.stream()
                .map(GetStockAccountInfoRes::from)
                .toList();

        return GetStockAccountInfosRes.of(stockAccountInfoResList);
    }

    @Override
    @Transactional(readOnly = true)
    public GetStockAccountSCInfosRes getStockAccountSCInfos(Long ssafyUserId, Long stockAccountId) {
        List<StockTransaction> transactions = stockTransactionRepository.findByStockAccountIdWithFetchJoin(stockAccountId);
//        System.out.println(transactions);

        Map<Long, GetStockAccountSCInfoRes> stockAccountMap = new HashMap<>();
        for (StockTransaction transaction : transactions) {
//            String key = transaction.getStockInfo().getStockCode() + "|" + transaction.getStockInfo().getStockName();
            Long key = transaction.getStockInfo().getStockInfoId();

            BigDecimal purchasePrice = transaction.getTransactionBalance();
            BigDecimal sumPurchasePrice;
            Long purchaseQuantity = transaction.getTransactionQuantity();

            BigDecimal curEvaluationAmount = transaction.getStockInfo().getCurrentEvaluationPrice().multiply(BigDecimal.valueOf(purchaseQuantity));
            BigDecimal purchaseAmount = purchasePrice.multiply(BigDecimal.valueOf(purchaseQuantity));
            if ("2".equals(transaction.getTransactionType())) {
                curEvaluationAmount = curEvaluationAmount.negate();
                purchaseAmount = purchaseAmount.negate();
                purchaseQuantity = purchaseQuantity * -1;
                purchasePrice = BigDecimal.valueOf(0);
            }
            BigDecimal plBalance = purchaseAmount.subtract(curEvaluationAmount);
            sumPurchasePrice = purchasePrice.multiply(BigDecimal.valueOf(purchaseQuantity));
//            System.out.println(key + ": " + purchaseQuantity + ", " + purchaseAmount + ", " + curEvaluationAmount + ", " + plBalance);

            GetStockAccountSCInfoRes scInfo = stockAccountMap.get(key);
            // 종목 정보가 최초라면, map에 추가
            if (scInfo == null) {
                scInfo = GetStockAccountSCInfoRes.builder()
                        .stockAccountId(transaction.getStockAccount().getStockAccountId())
                        .securitiesCompanyCode(transaction.getStockInfo().getStockCode())
                        .securitiesCompanyName(transaction.getStockInfo().getStockName())
                        .totalSumEvaluationAmount(curEvaluationAmount)
                        .totalStockQuantity(purchaseQuantity)
                        .totalSumPurchaseAmount(sumPurchasePrice)
                        .totalPLBalance(plBalance)
                        .totalPLRate(getPLRate(plBalance, sumPurchasePrice))
                        .build();
            }
            // 종목 정보가 최초가 아니라면, map에서 갱신
            else {
                curEvaluationAmount = scInfo.getTotalSumEvaluationAmount().add(curEvaluationAmount);
                sumPurchasePrice = scInfo.getTotalSumPurchaseAmount().add(sumPurchasePrice);
                plBalance = purchaseAmount.add(plBalance);
                purchaseQuantity = scInfo.getTotalStockQuantity() + purchaseQuantity;
                scInfo.setTotalSumEvaluationAmount(curEvaluationAmount);
                scInfo.setTotalStockQuantity(purchaseQuantity);
                scInfo.setTotalSumPurchaseAmount(sumPurchasePrice);
                scInfo.setTotalPLBalance(plBalance);
                scInfo.setTotalPLRate(getPLRate(plBalance, sumPurchasePrice));
//                System.out.println(key + ": " + purchaseQuantity + ", " + purchaseAmount + ", " + curEvaluationAmount + ", " + plBalance);
            }

            stockAccountMap.put(key, scInfo);
        }
//        System.out.println(stockAccountMap);
        return GetStockAccountSCInfosRes.of(stockAccountMap);
    }

    // 수익률 = (수익금 / 평가금) * 100
    private BigDecimal getPLRate(BigDecimal totalPLBalance, BigDecimal totalPurchaseAmount) {

        return totalPLBalance.multiply(BigDecimal.valueOf(100)).divide(totalPurchaseAmount, 2, RoundingMode.HALF_EVEN);
    }
}
