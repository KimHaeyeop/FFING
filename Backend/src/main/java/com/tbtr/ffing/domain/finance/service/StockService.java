package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountSCInfoRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountInfosRes;
import com.tbtr.ffing.domain.finance.dto.response.stock.GetStockAccountSCInfosRes;
import org.springframework.transaction.annotation.Transactional;

public interface StockService {
    @Transactional(readOnly = true)
    GetStockAccountInfosRes getStockAccountInfoSummary(Long ssafyUserId);

    @Transactional(readOnly = true)
    GetStockAccountSCInfosRes getStockAccountSCInfos(Long ssafyUserId, Long stockAccountId);
}
