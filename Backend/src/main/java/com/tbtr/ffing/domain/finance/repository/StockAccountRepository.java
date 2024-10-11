package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.StockAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockAccountRepository extends JpaRepository<StockAccount, Long> {
    List<StockAccount> findAllBySsafyUserId(Long ssafyUserId);
}
