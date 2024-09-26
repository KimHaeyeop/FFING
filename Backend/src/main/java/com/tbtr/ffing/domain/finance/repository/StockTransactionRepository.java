package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
}
