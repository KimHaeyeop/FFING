package com.tbtr.ffing.domain.game.service.impl;

import com.google.type.DateTime;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.entity.PetCollection;
import com.tbtr.ffing.domain.game.entity.PetInfo;
import com.tbtr.ffing.domain.game.entity.PetList;
import com.tbtr.ffing.domain.game.entity.PetType;
import com.tbtr.ffing.domain.game.repository.PetCollectionRepository;
import com.tbtr.ffing.domain.game.repository.PetRepository;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.MonthDay;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final ExpenseRepository expenseRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final PetCollectionRepository petCollectionRepository;

    @Override
    @Transactional
    public Map<String, PetInfoRes> getHomePetInfo(long userId) {
        Map<String, PetInfoRes> resultMap = new HashMap<String, PetInfoRes>();
        List<PetInfoRes> homePetInfo = petRepository.findHomePetInfoByUserId(userId);
        resultMap.put("currentPetInfo", homePetInfo.get(0));
        resultMap.put("beforePetInfo", homePetInfo.get(1));
//        currentPPetInfoList.get(0).setVarTotalStat(currentPPetInfoList.get(0).getTotalStat() - currentPPetInfoList.get(1).getTotalStat());
//        currentPPetInfoList.get(0).setVarFinanceStat(currentPPetInfoList.get(0).getFinanceStat() - currentPPetInfoList.get(1).getFinanceStat());
//        currentPPetInfoList.get(0).setVarFoodBakeryStat(currentPPetInfoList.get(0).getFoodBakeryStat() - currentPPetInfoList.get(1).getFoodBakeryStat());
//        currentPPetInfoList.get(0).setVarLifeCultureStat(currentPPetInfoList.get(0).getLifeCultureStat() - currentPPetInfoList.get(1).getLifeCultureStat());
//        currentPPetInfoList.get(0).setVarShoppingStat(currentPPetInfoList.get(0).getShoppingStat() - currentPPetInfoList.get(1).getShoppingStat());
//        currentPPetInfoList.get(0).setVarTransportationStat(currentPPetInfoList.get(0).getTransportationStat() - currentPPetInfoList.get(1).getTransportationStat());
        return resultMap;
    }

    @Override
    @Transactional
    public List<PetHistoryRes> getPetHistory(long userId, String yearMonth) {
        return petRepository.findPetHistoryByUserIdAndYearMonth(userId, yearMonth);
    }

    @Override
    @Transactional
    public List<PetCollectionRes> getPetCollection(long userId) {
        return petRepository.findPetCollectionByUserId(userId);
    }

    @Override
    @Transactional
    public boolean createPetInfo(long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        startDate = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        endDate = startDate.plusDays(6); // Saturday

        List<CategoryExpenseRes> categoryExpenses = expenseRepository.findCategoryExpenses(startDate, endDate);
        long typeId = 1;
        BigDecimal min = categoryExpenses.get(0).getTotalAmount();
        for (int i = 1; i < 5; i++) {
            if (categoryExpenses.get(i).getTotalAmount().compareTo(min) < 0) {
                min = categoryExpenses.get(i).getTotalAmount();
                typeId = i + 1;
            }
        }

        BigDecimal weeklyTotalAmount = categoryExpenses.stream()
                .map(CategoryExpenseRes::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 1. 현재 달 마지막일 구하기
        int year = startDate.getYear();
        int month = startDate.getMonthValue();
        Calendar cal = Calendar.getInstance();
        cal.set(year, month-1, 1); //1월 = 0
        int dayLast = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        // 2. 현재 달 마지막일의 요일인덱스 구하기
        cal.set(Calendar.DAY_OF_MONTH, dayLast); //DAY_OF_MONTH를 마지막일로 설정 (월의 첫날)
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK); //그 주의 요일 반환 (일:1 ~ 토:7)

        // 3. 현재 달이 총 몇주차인지 구하기
        int weeks = (dayLast - dayOfWeek + 13)/7;

        String yearMonth = String.valueOf(startDate.getYear()) + String.format("%02d", startDate.getMonthValue());
        Goal spending = goalRepository.findByUserIdAndGoalTypeAndYearMonth(userId, "2", yearMonth);
        BigDecimal weekBD = new BigDecimal(weeks);
        BigDecimal weekSpending = spending.getBalance().divide(weekBD, 2, RoundingMode.HALF_UP);
        BigDecimal weekCategorySpending = weekSpending.divide(new BigDecimal(5), 2, RoundingMode.HALF_UP);

        int totalStat = 50 + (weekSpending.subtract(weeklyTotalAmount).divide(weekSpending, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(50)).intValue());
        double totalStatDiv = totalStat / 5;
        int financeStat = (int) (totalStatDiv + (totalStat + weekCategorySpending.subtract(categoryExpenses.get(0).getTotalAmount()).divide(weeklyTotalAmount, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue()) / 5);
        int foodBakeryStat = (int) (totalStatDiv + (totalStat + weekCategorySpending.subtract(categoryExpenses.get(1).getTotalAmount()).divide(weeklyTotalAmount, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue()) / 5);
        int lifeCultureStat = (int) (totalStatDiv + (totalStat + weekCategorySpending.subtract(categoryExpenses.get(2).getTotalAmount()).divide(weeklyTotalAmount, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue()) / 5);
        int shoppingStat = (int) (totalStatDiv + (totalStat + weekCategorySpending.subtract(categoryExpenses.get(3).getTotalAmount()).divide(weeklyTotalAmount, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue()) / 5);
        int transportationStat = (int) (totalStatDiv + (totalStat + weekCategorySpending.subtract(categoryExpenses.get(4).getTotalAmount()).divide(weeklyTotalAmount, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue()) / 5);
        totalStat = financeStat + foodBakeryStat + lifeCultureStat + shoppingStat + transportationStat;

        long petId = (long) (Math.random() * 35) + 1;
        PetList pet = petRepository.findPetByPetId(petId);

        PetType petType = petRepository.findPetTypeByTypeId(typeId);

        User user = userRepository.findByUserId(userId);

        PetInfo petInfo = PetInfo.builder()
                .totalStat(totalStat)
                .financeStat(financeStat)
                .foodBakeryStat(foodBakeryStat)
                .lifeCultureStat(lifeCultureStat)
                .shoppingStat(shoppingStat)
                .transportationStat(transportationStat)
                .winCount(0)
                .loseCount(0)
                .createdDate(today.format(DateTimeFormatter.BASIC_ISO_DATE))
                .petList(pet)
                .petType(petType)
                .user(user)
                .build();

        petRepository.save(petInfo);

        List<PetCollectionRes> petCollection = petRepository.findPetCollectionByUserId(userId);
        boolean found = false;
        for (int i = 0; i < petCollection.size(); i++) {
            if (petCollection.get(i).getPetCode().equals(pet.getPetCode())) {
                found = true;
                break;
            }
        }

        if (!found) {
            PetCollection newPetCollection = PetCollection.builder()
                   .createdDate(today.format(DateTimeFormatter.BASIC_ISO_DATE))
                   .petList(pet)
                   .user(user)
                   .build();

            petCollectionRepository.save(newPetCollection);
        }

        return true;
    }
}
