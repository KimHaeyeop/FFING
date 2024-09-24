package com.tbtr.ffing.domain.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;

/**
 * tb_user 테이블과 매핑 객체
 *
 * @author : jonghoon
 * @fileName : UserEntity
 * @since : 2/8/24
 */
@ToString
@Entity
@Getter
@Table(name = "tb_user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_sq", unique = true)
    private long userSq;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    // 사용자 패스워드
    @LastModifiedDate
    @Column(name = "user_pw", length = 100)
    private String userPw;

    // 사용자 이름
    @Column(name = "user_nm", length = 255)
    private String userNm;

    // 사용자 상태
    @Column(name = "user_st", nullable = false, length = 10)
    private String userSt;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Builder(toBuilder = true)
    public UserEntity(long userSq, String userId, String userPw, String userNm, String userSt, String userEmail) {
        this.userSq = userSq;
        this.userId = userId;
        this.userPw = userPw;
        this.userNm = userNm;
        this.userSt = userSt;
        this.userEmail = userEmail;
    }
}