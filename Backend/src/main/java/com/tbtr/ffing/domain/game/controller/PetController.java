package com.tbtr.ffing.domain.game.controller;

import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Object> selectHomePetInfo(@RequestParam long userId) {
        Map<String, PetInfoRes> homePetInfo = petService.getHomePetInfo(userId);

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(homePetInfo)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/history/{yearMonth}")
    public ResponseEntity<Object> selectPetHistory(@RequestParam long userId, @PathVariable String yearMonth) {
        List<PetHistoryRes> petHistory = petService.getPetHistory(userId, yearMonth);

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(petHistory)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/collection")
    public ResponseEntity<Object> selectPetCollection(@RequestParam long userId) {
        List<PetCollectionRes> petCollection = petService.getPetCollection(userId);

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(petCollection)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
