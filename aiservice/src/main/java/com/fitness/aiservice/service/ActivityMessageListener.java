package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "${rabbitmq.queue.name:activity.queue}")
    public void processActivity(Activity activity) {
        if (activity == null || activity.getUserId() == null || activity.getUserId().isBlank()) {
            log.warn("Discarding invalid activity message: {}", activity);
            return;
        }

        log.info("Received activity for processing: id={}, userId={}", activity.getId(), activity.getUserId());
        try {
            Recommendation recommendation = aiService.generateRecommendation(activity);
            log.info("Generated Recommendation: id={}, activityId={}, userId={}", 
                    recommendation.getId(), recommendation.getActivityId(), recommendation.getUserId());
            recommendationRepository.save(recommendation);
        } catch (Exception e) {
            log.error("Failed to process activity and generate recommendation for activityId: {}", activity.getId(), e);
        }
    }
}

