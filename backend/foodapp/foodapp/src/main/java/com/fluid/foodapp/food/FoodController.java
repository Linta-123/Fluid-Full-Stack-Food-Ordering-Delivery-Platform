package com.fluid.foodapp.food;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/foods")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.124:3000"})
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    @GetMapping("/{id}")
    public Food getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }

    @PostMapping
    public Food addFood(@RequestBody Food food) {
        return foodService.addFood(food);
    }

    @GetMapping("/category/{category}")
    public List<Food> getFoodsByCategory(@PathVariable String category) {
        return foodService.getFoodsByCategory(category);
    }
    @GetMapping("/search")
    public List<Food> searchFoods(@RequestParam String keyword) {
        return foodService.searchFoods(keyword);
    }
}