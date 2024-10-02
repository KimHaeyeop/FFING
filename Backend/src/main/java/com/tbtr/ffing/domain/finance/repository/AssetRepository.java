package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long>, AssetRepositoryCustom {
//    @Query("SELECT a FROM Asset a WHERE a.userId = ?1 ORDER BY a.updatedAt DESC LIMIT 1")
//    Asset findCurrentAssetByUserId(long userId);
//
//    @Query("SELECT a FROM Asset a WHERE a.userId = ?1 ORDER BY a.updatedAt DESC LIMIT 6")
//    List<Asset> findAssetHistoryByUserId(long userId);
}
