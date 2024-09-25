package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}
