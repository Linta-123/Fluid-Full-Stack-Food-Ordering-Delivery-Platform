package com.fluid.foodapp.service;

import com.fluid.foodapp.dto.CreateOrderResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public CreateOrderResponse createOrder(int amount) throws Exception {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = client.orders.create(options);

        return new CreateOrderResponse(
                order.get("id"),
                order.get("amount"),
                order.get("currency"),
                keyId
        );
    }
}