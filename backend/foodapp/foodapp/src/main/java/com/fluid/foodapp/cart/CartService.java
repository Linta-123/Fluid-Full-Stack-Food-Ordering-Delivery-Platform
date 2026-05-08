package com.fluid.foodapp.cart;

import com.fluid.foodapp.food.Food;
import com.fluid.foodapp.food.FoodRepository;
import com.fluid.foodapp.model.User;
import com.fluid.foodapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    public Cart addToCart(Long userId, Long foodId, int quantity) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        // 🔥 Check if item already exists in cart
        List<Cart> existingItems = cartRepository.findByUserId(userId);

        for (Cart item : existingItems) {
            if (item.getFood().getId().equals(foodId)) {
                item.setQuantity(item.getQuantity() + quantity);
                return cartRepository.save(item);
            }
        }

        // 🆕 Create new cart item
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setFood(food);
        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    // ✅ Get all cart items
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    // ✅ Get cart by user
    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // ✅ Delete cart item
    public void deleteCartItem(Long id) {
        cartRepository.deleteById(id);
    }

    // ✅ Update quantity
    public Cart updateCart(Long id, int quantity) {

        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }
    public double getTotalPrice(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        double total = 0;

        for (Cart cart : cartItems) {
            total += cart.getFood().getPrice() * cart.getQuantity();
        }

        return total;
    }
}