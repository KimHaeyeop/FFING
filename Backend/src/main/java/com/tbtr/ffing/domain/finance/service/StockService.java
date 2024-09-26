package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfoRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfosRes;
import org.springframework.transaction.annotation.Transactional;

public interface StockService {
    @Transactional(readOnly = true)
    GetStockAccountInfosRes getStockAccountInfoSummary(Long ssafyUserId);
}
