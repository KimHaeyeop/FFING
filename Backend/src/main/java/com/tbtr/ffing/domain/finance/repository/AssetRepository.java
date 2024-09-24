package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Asset findOneByUserId(long userId);
}
