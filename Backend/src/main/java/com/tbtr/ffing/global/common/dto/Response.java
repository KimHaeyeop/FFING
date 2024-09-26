package com.tbtr.ffing.global.common.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class Response<E> {
    Long code;
    String message;
    E result;
}
