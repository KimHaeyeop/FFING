package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.entity.Asset;
import org.springframework.stereotype.Service;

@Service
public interface AssetService {
    Asset getAsset(long userId);
}
