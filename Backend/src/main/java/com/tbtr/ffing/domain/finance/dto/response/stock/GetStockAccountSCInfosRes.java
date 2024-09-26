package com.tbtr.ffing.domain.finance.dto.response.stock;

import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GetStockAccountSCInfosRes {

    private List<GetStockAccountSCInfoRes> stockAccountSCInfos;

    public static GetStockAccountSCInfosRes of(Map<Long, GetStockAccountSCInfoRes> stockAccountMap) {
        List<GetStockAccountSCInfoRes> toStockAccountInfoList = new ArrayList<>(stockAccountMap.values());
        return new GetStockAccountSCInfosRes(toStockAccountInfoList);
    }
}
