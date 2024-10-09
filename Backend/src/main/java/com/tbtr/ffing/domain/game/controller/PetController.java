package com.tbtr.ffing.domain.game.controller;

import com.tbtr.ffing.domain.finance.dto.response.expense.WeeklyCategoryExpenseRes;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.finance.service.GoalService;
import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping("")
    public ResponseEntity<Object> selectHomePetInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Map<String, PetInfoRes> homePetInfo = petService.getHomePetInfo(userDetails.getUserId());

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(homePetInfo)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/history/{yearMonth}")
    public ResponseEntity<Object> selectPetHistory(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String yearMonth) {
        List<PetHistoryRes> petHistory = petService.getPetHistory(userDetails.getUserId(), yearMonth);

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(petHistory)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/collection")
    public ResponseEntity<Object> selectPetCollection(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<PetCollectionRes> petCollection = petService.getPetCollection(userDetails.getUserId());

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(petCollection)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("")
    public ResponseEntity<Object> insertPetInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        petService.createPetInfo(userDetails.getUserId());

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
