package com.fluid.foodapp.controller;

import com.fluid.foodapp.dto.CreateOrderRequest;
import com.fluid.foodapp.dto.CreateOrderResponse;
import com.fluid.foodapp.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public CreateOrderResponse createOrder(@RequestBody CreateOrderRequest request) throws Exception {
        return paymentService.createOrder(request.getAmount());
    }
}