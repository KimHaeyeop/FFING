package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/user")
@RestController
public class UserController {

    @GetMapping("/test")
    public ResponseEntity<?> test(@AuthenticationPrincipal CustomUserDetails userDetails) {
        System.out.println("test controller 진입");
        System.out.println("username: " + userDetails.getUsername());
        return ResponseEntity.ok("test ok");
    }
}