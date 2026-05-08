package com.fluid.foodapp.controller;

import com.fluid.foodapp.model.User;
import java.util.Map;
import com.fluid.foodapp.repository.UserRepository;
import com.fluid.foodapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.124:3000"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;



    @PostMapping("/login")
    public User login(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (!existingUser.getPassword().equals(user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
        }

        existingUser.setPassword(null);
        return existingUser;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        return savedUser;
    }

    @PutMapping("/{id}/address")
    public User updateAddress(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String address = request.get("address");

        User updatedUser = userService.updateAddress(id, address);
        updatedUser.setPassword(null);

        return updatedUser;
    }
}