package com.booksen.api.model;

import org.springframework.http.HttpStatus;

import java.util.regex.Pattern;

public record ExceptionPattern(Pattern pattern, HttpStatus status) {}
