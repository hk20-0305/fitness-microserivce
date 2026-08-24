package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendation(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-ID", required = false) String authenticatedUserId) {
        if (authenticatedUserId == null || authenticatedUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid user identity");
        }
        if (userId != null && !userId.isBlank() && !userId.equals(authenticatedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: You cannot access recommendations of another user");
        }
        return ResponseEntity.ok(recommendationService.getUserRecommendation(authenticatedUserId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Recommendation>> getCurrentUserRecommendation(
            @RequestHeader(value = "X-User-ID", required = false) String authenticatedUserId) {
        if (authenticatedUserId == null || authenticatedUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid user identity");
        }
        return ResponseEntity.ok(recommendationService.getUserRecommendation(authenticatedUserId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendation(
            @PathVariable String activityId,
            @RequestHeader(value = "X-User-ID", required = false) String authenticatedUserId) {
        if (authenticatedUserId == null || authenticatedUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid user identity");
        }
        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId, authenticatedUserId));
    }
}

