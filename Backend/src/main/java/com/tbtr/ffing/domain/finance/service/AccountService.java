package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.request.account.TransferDmdDepAccReq;

public interface AccountService {

    void updateAccountTransfer(TransferDmdDepAccReq transferDmdDepAccReq);
}
