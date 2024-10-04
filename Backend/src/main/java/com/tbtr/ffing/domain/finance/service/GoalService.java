package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.request.goal.SpendingReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.CheckRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;

public interface GoalService {

    GoalDetailRes getGoal(Long userId, Long ssafyUserId);

    GoalRes setGoal(GoalReq goalReq);

    SpendingRes setSpending(SpendingReq spendingReq);

    CheckRes checkGoal(Long userId);
}
