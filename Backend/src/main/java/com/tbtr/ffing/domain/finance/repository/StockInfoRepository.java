package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.StockInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockInfoRepository extends JpaRepository<StockInfo, Long> {
}
