package com.fitness.userservice.service;

import com.fitness.userservice.dto.LoginRequest;
import com.fitness.userservice.dto.LoginResponse;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import com.fitness.userservice.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Register a new user and return a JWT token.
     * Returns 409 CONFLICT if the email is already registered.
     */
    public LoginResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email is already registered. Please sign in instead."
            );
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        User savedUser = repository.save(user);
        String token = jwtUtil.generateToken(savedUser);
        log.info("New user registered: {}", savedUser.getEmail());
        return new LoginResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFirstName(), savedUser.getLastName());
    }

    /**
     * Get user profile by ID. Returns 404 if not found.
     * Password hash is intentionally NOT included in the response.
     */
    public UserResponse getUserProfile(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return repository.existsById(userId);
    }

    /**
     * Authenticate user with email + password.
     * Returns 401 UNAUTHORIZED on bad credentials — never 500.
     */
    public LoginResponse login(LoginRequest request) {
        Optional<User> optionalUser = repository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty() ||
                !passwordEncoder.matches(request.getPassword(), optionalUser.get().getPassword())) {
            // Use the same message for both cases to prevent email enumeration
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user);
        log.info("User authenticated: {}", user.getEmail());
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());
    }
}
