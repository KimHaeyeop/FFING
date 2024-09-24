//package com.tbtr.ffing.domain.user.service.impl;
//
//
//import com.tbtr.ffing.domain.user.repository.UserJpaRepository;
//import com.tbtr.ffing.domain.user.service.UserService;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Objects;
//
///**
// * 사용자 인터페이스의 구현체입니다.
// *
// * @author : jonghoon
// * @fileName : UserServiceImpl
// * @since : 2/8/24
// */
//@Service
//public class UserServiceImpl implements UserService {
//
//    private final UserJpaRepository userJpaRepository;
//
//    public UserServiceImpl(UserJpaRepository userJpaRepository) {
//        this.userJpaRepository = userJpaRepository;
//    }
//
//    /**
//     * 사용자 리스트 조회
//     *
//     * @return
//     */
//    @Override
//    @Transactional(readOnly = true)
//    public List<UserEntity> userList() {
//        return (List<UserEntity>) userJpaRepository.findAll();
//    }
//
//    /**
//     * 사용자 등록
//     *
//     * @param userEntity
//     * @return
//     */
//    @Override
//    @Transactional
//    public UserEntity saveUser(UserEntity userEntity) {
//        return userJpaRepository.save(userEntity);
//    }
//
//    /**
//     * 사용자 수정
//     *
//     * @param userEntity
//     * @return
//     */
//    @Override
//    @Transactional
//    public UserEntity updateUser(UserEntity userEntity) {
//        UserEntity user = userJpaRepository.findById(userEntity.getUserSq()).get();
//
//        UserEntity resultEntity = UserEntity.builder().build();
//
//        if (Objects.nonNull(user.getUserNm()) && !"".equalsIgnoreCase(user.getUserNm())) {
//            resultEntity = userEntity.toBuilder().userNm(user.getUserNm()).build();
//        }
//
//        if (Objects.nonNull(user.getUserEmail()) && !"".equalsIgnoreCase(user.getUserEmail())) {
//            resultEntity = userEntity.toBuilder().userEmail(user.getUserEmail()).build();
//        }
//
//        if (Objects.nonNull(user.getUserSt()) && !"".equalsIgnoreCase(user.getUserSt())) {
//            resultEntity = userEntity.toBuilder().userEmail(user.getUserSt()).build();
//        }
//        return userJpaRepository.save(resultEntity);
//    }
//
//    /**
//     * 사용자 삭제
//     *
//     * @param userSq
//     */
//    @Override
//    @Transactional
//    public void deleteUserByUserSq(long userSq) {
//        userJpaRepository.deleteById(userSq);
//    }
//
//}