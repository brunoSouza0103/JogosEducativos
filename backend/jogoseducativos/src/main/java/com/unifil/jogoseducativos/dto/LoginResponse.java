package com.unifil.jogoseducativos.dto;

import java.math.BigDecimal;

public class LoginResponse {
    private Long userId;
    private String username;
    private String message;
    private BigDecimal balance;

    public LoginResponse(Long userId, String username, String message, BigDecimal balance) {
        this.userId = userId;
        this.username = username;
        this.message = message;
        this.balance = balance;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
