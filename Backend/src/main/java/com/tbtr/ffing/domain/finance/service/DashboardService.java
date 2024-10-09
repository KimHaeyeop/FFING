package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.dashboard.MainDashboardRes;

public interface DashboardService {

    MainDashboardRes mainPage(Long userId);
}
