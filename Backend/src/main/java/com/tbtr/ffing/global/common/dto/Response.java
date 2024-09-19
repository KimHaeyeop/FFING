package com.tbtr.ffing.global.common.dto;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Response<E> {
    Boolean isSuccess;
    Long code;
    String message;
    E result;
}
