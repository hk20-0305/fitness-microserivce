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

    private static final int MAX_ATTEMPTS = 5;
    private static final long[] BACKOFF_DELAYS_MS = {2000L, 5000L, 10000L, 20000L};

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
                log.info("Calling Gemini API (attempt {}/{})...", attempt, MAX_ATTEMPTS);

                String response = webClient.post()
                        .uri(geminiApiUrl + "?key=" + geminiApiKey)
                        .header("Content-Type", "application/json")
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                log.info("Gemini API call succeeded on attempt {}/{}", attempt, MAX_ATTEMPTS);
                return response;

            } catch (WebClientResponseException ex) {
                int status = ex.getStatusCode().value();

                // Do not retry permanent client errors (400, 401, 403, etc.)
                if (status == 400 || status == 401 || status == 403) {
                    log.error("Gemini API client error: HTTP {}. Non-retryable (attempt {}/{}). Aborting retries.",
                            status, attempt, MAX_ATTEMPTS);
                    return null;
                }

                // Retry only temporary/transient server & rate-limit errors (429, 500, 502, 503, 504)
                if (isTransientStatus(status) && attempt < MAX_ATTEMPTS) {
                    long delay = BACKOFF_DELAYS_MS[attempt - 1];
                    log.warn("Gemini API returned HTTP {} (transient/high demand) on attempt {}/{}. Retrying in {} ms ({} seconds)...",
                            status, attempt, MAX_ATTEMPTS, delay, delay / 1000);
                    sleep(delay);
                } else if (isTransientStatus(status)) {
                    log.error("Gemini API call failed permanently after all {} attempts with HTTP {}", MAX_ATTEMPTS, status);
                    return null;
                } else {
                    log.error("Gemini API returned unexpected HTTP {} (attempt {}/{}). Aborting retries.",
                            status, attempt, MAX_ATTEMPTS);
                    return null;
                }

            } catch (Exception ex) {
                if (attempt < MAX_ATTEMPTS) {
                    long delay = BACKOFF_DELAYS_MS[attempt - 1];
                    log.warn("Gemini API call encountered error ({}: {}) on attempt {}/{}. Retrying in {} ms ({} seconds)...",
                            ex.getClass().getSimpleName(), ex.getMessage(), attempt, MAX_ATTEMPTS, delay, delay / 1000);
                    sleep(delay);
                } else {
                    log.error("Gemini API call failed permanently after all {} attempts due to: {}",
                            MAX_ATTEMPTS, ex.getMessage());
                    return null;
                }
            }
        }

        return null;
    }

    private boolean isTransientStatus(int status) {
        return status == 429 || status == 500 || status == 502 || status == 503 || status == 504;
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

