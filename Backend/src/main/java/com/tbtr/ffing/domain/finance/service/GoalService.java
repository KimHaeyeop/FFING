package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;

public interface GoalService {

    GoalRes setGoal(GoalReq goalReq);

    SpendingRes setSpending(GoalReq goalReq);

    GoalDetailRes getGoal(Long userId);
}
