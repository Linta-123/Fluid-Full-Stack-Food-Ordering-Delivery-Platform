package com.fluid.foodapp.food;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found"));
    }

    public Food addFood(Food food) {
        return foodRepository.save(food);
    }

    public List<Food> getFoodsByCategory(String category) {
        return foodRepository.findByCategory(category);
    }
    public List<Food> searchFoods(String keyword) {
        return foodRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(keyword, keyword);
    }
}