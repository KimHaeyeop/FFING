package com.tbtr.ffing.domain.finance.dto;

import lombok.Data;

@Data
public class UserDto {
    public final long userSq;
    public final String userId;
    public final String userNm;

    //생성자 생략

    public static UserDto from(UserEntity user) {
        return new UserDto(user.getUserSq(), user.getUserId(), user.getUserNm());
    }
}