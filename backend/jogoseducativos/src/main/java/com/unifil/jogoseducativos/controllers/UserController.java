package com.unifil.jogoseducativos.controllers;

import com.unifil.jogoseducativos.dto.LoginRequest;
import com.unifil.jogoseducativos.dto.LoginResponse;
import com.unifil.jogoseducativos.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return userService.findByUsername(request.getUsername())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .map(user -> ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername(), "Login successful", user.getBalance())))
                .orElse(ResponseEntity.badRequest().body(new LoginResponse(null, null, "Invalid credentials", null)));
    }
}
