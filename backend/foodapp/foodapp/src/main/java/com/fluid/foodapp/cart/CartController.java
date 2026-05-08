package com.fluid.foodapp.cart;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public Cart addToCart(@RequestBody CartRequest request) {
        return cartService.addToCart(
                request.getUserId(),
                request.getFoodId(),
                request.getQuantity()
        );
    }

    @GetMapping
    public List<Cart> getCartItems() {
        return cartService.getAllCartItems();
    }

    @GetMapping("/user/{userId}")
    public List<Cart> getCartByUser(@PathVariable Long userId) {
        return cartService.getCartByUser(userId);
    }

    @PutMapping("/{id}")
    public Cart updateCart(@PathVariable Long id,
                           @RequestParam int quantity) {
        return cartService.updateCart(id, quantity);
    }

    @DeleteMapping("/{id}")
    public void deleteCartItem(@PathVariable Long id) {
        cartService.deleteCartItem(id);
    }

    @GetMapping("/total/{userId}")
    public double getTotalPrice(@PathVariable Long userId) {
        return cartService.getTotalPrice(userId);
    }
}