//package com.tbtr.ffing.domain.user.controller;
//
//import com.tbtr.ffing.domain.user.service.UserService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
///**
// * Please explain the class!!
// *
// * @author : jonghoon
// * @fileName : UserController
// * @since : 2/8/24
// */
//@RequestMapping("/api/v1/user")
//@RestController
//public class UserController {
//
//    private final UserService userService;
//
//    public UserController(UserService userService) {
//        this.userService = userService;
//    }
//
//    /**
//     * @return
//     */
//    @PostMapping("/users")
//    public ResponseEntity<Object> selectUserList() {
//        List<UserEntity> userEntityList = userService.userList();
//        return new ResponseEntity<>(userEntityList, HttpStatus.OK);
//    }
//
//    /**
//     * 사용자 등록
//     *
//     * @param userEntity
//     * @return
//     */
//    @PostMapping("/user")
//    public ResponseEntity<Object> userSave(@RequestBody UserEntity userEntity) {
//        UserEntity result = userService.saveUser(userEntity);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
//
//    /**
//     * 사용자 수정
//     *
//     * @param userEntity
//     * @return
//     */
//    @PutMapping("/user")
//    public ResponseEntity<Object> updateUser(@RequestBody UserEntity userEntity) {
//        UserEntity result = userService.updateUser(userEntity);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
//
//    /**
//     * 사용자 삭제
//     *
//     * @param userSq
//     * @return
//     */
//    @DeleteMapping("/user")
//    public ResponseEntity<Object> deleteUser(@RequestParam long userSq) {
//        userService.deleteUserByUserSq(userSq);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//}