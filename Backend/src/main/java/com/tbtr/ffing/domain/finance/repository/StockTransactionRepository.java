package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    @Query("SELECT st FROM StockTransaction st " +
            "JOIN FETCH st.stockAccount sa " +
            "JOIN FETCH st.stockInfo si " +
            "WHERE sa.stockAccountId = :stockAccountId")
    List<StockTransaction> findByStockAccountIdWithFetchJoin(Long stockAccountId);
}
