package com.tbtr.ffing.global.batch;

import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.global.batch.expense.ExpenseItemReader;
import com.tbtr.ffing.global.batch.expense.ExpenseItemProcessor;
import com.tbtr.ffing.global.batch.expense.ExpenseItemWriter;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * 시간 기반 배치 작업을 위한 Spring Batch 설정 클래스
 */
@Configuration
public class TimeBasedBatchConfig {

    @Autowired
    private ExpenseItemReader expenseItemReader;

    @Autowired
    private ExpenseItemProcessor expenseItemProcessor;

    @Autowired
    private ExpenseItemWriter expenseItemWriter;

    /**
     * 시간 기반 Expense 생성 Job을 정의합니다.
     *
     * @param jobRepository Job 실행 정보를 저장하는 저장소
     * @param addExpenseStep Job에서 실행할 Step
     * @return 구성된 Job
     */
    @Bean
    public Job timeBasedExpenseJob(JobRepository jobRepository, Step addExpenseStep) {
        return new JobBuilder("timeBasedExpenseJob", jobRepository)
                .start(addExpenseStep)
                .build();
    }

    /**
     * Expense 생성 Step을 정의합니다.
     *
     * @param jobRepository Job 실행 정보를 저장하는 저장소
     * @param transactionManager 트랜잭션 관리자
     * @return 구성된 Step
     */
    @Bean
    public Step addExpenseStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("addExpenseStep", jobRepository)
                .<User, Expense>chunk(10, transactionManager)
                .reader(expenseItemReader)
                .processor(expenseItemProcessor)
                .writer(expenseItemWriter)
                .build();
    }
}