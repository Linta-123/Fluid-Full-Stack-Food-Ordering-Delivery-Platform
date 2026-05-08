package com.fluid.foodapp.order;

import com.fluid.foodapp.cart.Cart;
import com.fluid.foodapp.cart.CartRepository;
import com.fluid.foodapp.model.User;
import com.fluid.foodapp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order placeOrder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = 0;
        for (Cart cart : cartItems) {
            if (cart.getFood() == null) {
                throw new RuntimeException("Food missing in cart item id: " + cart.getId());
            }
            total += cart.getFood().getPrice() * cart.getQuantity();
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setStatus("PLACED");

        Order savedOrder = orderRepository.save(order);

        // safer than custom deleteByUserId while you're learning
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}