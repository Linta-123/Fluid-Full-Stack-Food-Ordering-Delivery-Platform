package com.fluid.foodapp.food;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByCategory(String category);



    List<Food> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
}


