package com.booksen.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Response<T> {
    private int status;
    private T data;
    private String message;

    public static <T> Response<T> ok(T data, String message) {
        return new Response<>(HttpStatus.OK.value(), data, message);
    }

    public static <T> Response<T> notFound(String message) {
        return new Response<>(HttpStatus.NOT_FOUND.value(), null, message);
    }

    public static <T> Response<T> badRequest(String message) {
        return new Response<>(HttpStatus.BAD_REQUEST.value(), null, message);
    }
}
