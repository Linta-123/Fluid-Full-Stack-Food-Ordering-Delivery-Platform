package com.fluid.foodapp.dto;

public class CreateOrderResponse {

    private String orderId;
    private int amount;
    private String currency;
    private String key;

    public CreateOrderResponse() {
    }

    public CreateOrderResponse(String orderId, int amount, String currency, String key) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.key = key;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}