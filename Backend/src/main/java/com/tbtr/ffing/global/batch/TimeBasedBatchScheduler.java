package com.tbtr.ffing.global.batch;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 시간 기반 배치 작업을 주기적으로 실행하는 스케줄러
 */
@Component
@EnableScheduling
public class TimeBasedBatchScheduler {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job timeBasedExpenseJob;

    /**
     * 매일 오후 7시 43분에 timeBasedExpenseJob을 실행합니다.
     * 각 실행마다 고유한 JobParameters를 생성하여 사용합니다.
     *
     * Cron 표현식 설명:
     * - 초(0-59) 분(0-59) 시간(0-23) 일(1-31) 월(1-12) 요일(0-7)
     * "0 43 19 * * ?" 의미:
     * - 0: 매 시간의 0초
     * - 43: 43분
     * - 19: 19시 (오후 7시)
     * - * : 매일
     * - * : 매월
     * - ? : 요일 상관없음
     */
//    @Scheduled(cron = "0 56 10 * * ?")
    @Scheduled(fixedRate = 60000)
    public void runTimeBasedExpenseJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();

            jobLauncher.run(timeBasedExpenseJob, jobParameters);
        } catch (Exception e) {
            // 로그 출력 또는 예외 처리 로직
            e.printStackTrace();
        }
    }
}