package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name:fitness.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing.key:activity.tracking}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity request cannot be null");
        }

        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID is required");
        }

        if (request.getType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity type is required");
        }

        if (request.getDuration() != null && request.getDuration() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration must be positive");
        }

        if (request.getCaloriesBurned() != null && request.getCaloriesBurned() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Calories burned must be positive");
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        // Publish to RabbitMQ for AI Processing
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } catch (Exception e) {
            log.error("Failed to publish activity to RabbitMQ: ", e);
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID is required");
        }
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteActivity(String activityId, String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID is required");
        }

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found with id: " + activityId));

        if (!activity.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: You can only delete your own activities");
        }

        activityRepository.deleteById(activityId);
    }

    public ActivityResponse getActivityById(String activityId, String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID is required");
        }

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found with id: " + activityId));

        if (!activity.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: You can only view your own activities");
        }

        return mapToResponse(activity);
    }

    public ActivityResponse updateActivity(String activityId, ActivityRequest request, String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID is required");
        }

        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity request cannot be null");
        }

        if (request.getDuration() != null && request.getDuration() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duration must be positive");
        }

        if (request.getCaloriesBurned() != null && request.getCaloriesBurned() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Calories burned must be positive");
        }

        Activity existingActivity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found with id: " + activityId));

        if (!existingActivity.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: You can only update your own activities");
        }

        if (request.getType() != null) {
            existingActivity.setType(request.getType());
        }
        if (request.getDuration() != null) {
            existingActivity.setDuration(request.getDuration());
        }
        if (request.getCaloriesBurned() != null) {
            existingActivity.setCaloriesBurned(request.getCaloriesBurned());
        }
        if (request.getStartTime() != null) {
            existingActivity.setStartTime(request.getStartTime());
        }
        if (request.getAdditionalMetrics() != null) {
            existingActivity.setAdditionalMetrics(request.getAdditionalMetrics());
        }

        Activity updatedActivity = activityRepository.save(existingActivity);
        log.info("Activity updated: id={}, userId={}", updatedActivity.getId(), userId);

        return mapToResponse(updatedActivity);
    }
}


