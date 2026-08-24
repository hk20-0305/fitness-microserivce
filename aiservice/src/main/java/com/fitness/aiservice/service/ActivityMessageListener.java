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
        if (activity == null) {
            log.warn("Received null activity message — discarding");
            return;
        }

        if (activity.getUserId() == null || activity.getUserId().isBlank()) {
            log.warn("Received activity with missing userId (activityId={}) — discarding", activity.getId());
            return;
        }

        log.info("[AI-PIPELINE] Step 1 — Activity received from RabbitMQ: activityId={}, userId={}, type={}",
                activity.getId(), activity.getUserId(), activity.getType());

        try {
            log.info("[AI-PIPELINE] Step 2 — Starting recommendation generation for activityId={}", activity.getId());
            Recommendation recommendation = aiService.generateRecommendation(activity);

            if (recommendation == null) {
                log.error("[AI-PIPELINE] generateRecommendation returned null for activityId={} — skipping save", activity.getId());
                return;
            }

            // Ensure the activityId and userId are correctly set
            if (recommendation.getActivityId() == null || recommendation.getActivityId().isBlank()) {
                log.error("[AI-PIPELINE] Recommendation has missing activityId for activity={} — skipping save", activity.getId());
                return;
            }

            log.info("[AI-PIPELINE] Step 3 — Recommendation created: activityId={}, userId={}, isFallback={}",
                    recommendation.getActivityId(),
                    recommendation.getUserId(),
                    recommendation.getRecommendation().contains("temporarily unavailable"));

            Recommendation saved = recommendationRepository.save(recommendation);

            log.info("[AI-PIPELINE] Step 4 — Recommendation saved successfully: savedId={}, activityId={}, userId={}",
                    saved.getId(), saved.getActivityId(), saved.getUserId());

        } catch (Exception e) {
            log.error("[AI-PIPELINE] FAILED to process activityId={}: {}", activity.getId(), e.getMessage(), e);
        }
    }
}
