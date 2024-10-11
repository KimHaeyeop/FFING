package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardTransactionRepository extends JpaRepository<CardTransaction, Long> {
}
