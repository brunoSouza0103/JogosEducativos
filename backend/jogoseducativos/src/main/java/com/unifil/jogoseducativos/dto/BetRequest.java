package com.unifil.jogoseducativos.dto;

import java.math.BigDecimal;

public class BetRequest {
    private Long userId;
    private BigDecimal amount;
    

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
