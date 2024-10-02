package com.tbtr.ffing.global.batch.expense;

import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 생성된 Expense 객체를 데이터베이스에 저장하는 ItemWriter
 */
@Component
public class ExpenseItemWriter implements ItemWriter<Expense> {

    @Autowired
    private ExpenseRepository expenseRepository;
    /**
     * Expense 객체 리스트를 데이터베이스에 저장합니다.
     *
     * @param expenses 저장할 Expense 객체 리스트
     * @throws Exception 저장 과정에서 발생할 수 있는 예외
     */
    @Override
    @Transactional
    public void write(Chunk<? extends Expense> expenses) throws Exception {

        expenseRepository.saveAll(expenses.getItems());

    }
}