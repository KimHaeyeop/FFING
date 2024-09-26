package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfoRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfosRes;
import com.tbtr.ffing.domain.finance.entity.StockAccount;
import com.tbtr.ffing.domain.finance.repository.StockInfoRepository;
import com.tbtr.ffing.domain.finance.repository.StockAccountRepository;
import com.tbtr.ffing.domain.finance.repository.StockTransactionRepository;
import com.tbtr.ffing.domain.finance.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
}
