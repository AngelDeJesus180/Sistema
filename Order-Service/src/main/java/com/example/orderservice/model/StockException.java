package com.example.orderservice.model;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class StockException extends RuntimeException {
    public StockException(String message) {
        super(message);
    }
}