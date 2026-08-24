package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private static final int MAX_ATTEMPTS = 4;
    private static final long[] BACKOFF_DELAYS_MS = {1000L, 2000L, 4000L};

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", question)
                        })
                }
        );

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                return webClient.post()
                        .uri(geminiApiUrl + "?key=" + geminiApiKey)
                        .header("Content-Type", "application/json")
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException ex) {
                int status = ex.getStatusCode().value();
                // Do not retry client auth/validation errors (401, 403, 400)
                if (status == 401 || status == 403 || status == 400) {
                    log.error("Gemini API client error: HTTP {}. Non-retryable.", status);
                    return null;
                }

                // Retry temporary failures such as 503 UNAVAILABLE (high demand), 429, 502, 504
                if (isTransientStatus(status) && attempt < MAX_ATTEMPTS) {
                    long delay = BACKOFF_DELAYS_MS[attempt - 1];
                    log.warn("Gemini API returned HTTP {} (temporary / high demand) on attempt {}/{}. Retrying in {} ms...",
                            status, attempt, MAX_ATTEMPTS, delay);
                    sleep(delay);
                } else {
                    log.error("Gemini API call failed after {} attempts with HTTP {}", attempt, status);
                    return null;
                }
            } catch (Exception ex) {
                if (attempt < MAX_ATTEMPTS) {
                    long delay = BACKOFF_DELAYS_MS[attempt - 1];
                    log.warn("Gemini API call encountered error ({}) on attempt {}/{}. Retrying in {} ms...",
                            ex.getClass().getSimpleName(), attempt, MAX_ATTEMPTS, delay);
                    sleep(delay);
                } else {
                    log.error("Gemini API call failed after {} attempts: {}", attempt, ex.getMessage());
                    return null;
                }
            }
        }

        return null;
    }

    private boolean isTransientStatus(int status) {
        return status == 503 || status == 502 || status == 504 || status == 429;
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Retry sleep interrupted");
        }
    }
}
