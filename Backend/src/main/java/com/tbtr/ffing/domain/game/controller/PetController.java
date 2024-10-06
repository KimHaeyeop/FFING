package com.tbtr.ffing.domain.game.controller;

import com.tbtr.ffing.domain.game.dto.response.CurrentPetInfoRes;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pet")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping("")
    public ResponseEntity<Object> selectCurrentPetInfo(@RequestParam long userId) {

        CurrentPetInfoRes currentPetInfo = petService.getCurrentPetInfo(userId);

        Response<Object> response = Response.builder()
                .code(200L)
                .message("성공")
                .result(currentPetInfo)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

}
