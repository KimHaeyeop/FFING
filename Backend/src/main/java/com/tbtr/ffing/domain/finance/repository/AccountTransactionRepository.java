package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Long>, AccountTransactionRepositoryCustom {
}
