package com.tbtr.ffing.domain.finance.dto.response.stock;

import lombok.*;

import java.util.List;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GetStockAccountInfosRes {

    private List<GetStockAccountInfoRes> stockAccountInfos;

    public static GetStockAccountInfosRes of(List<GetStockAccountInfoRes> stockAccountInfos) {
        return new GetStockAccountInfosRes(stockAccountInfos);
    }
}
