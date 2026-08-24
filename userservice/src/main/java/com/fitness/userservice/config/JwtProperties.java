package com.fitness.userservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for JWT handling.
 *
 * <p>Values are read from environment variables or Config Server. The environment variables
 * {@code JWT_SECRET} and {@code JWT_EXPIRATION_SECONDS} map to {@code jwt.secret} and
 * {@code jwt.expirationSeconds} respectively (Spring's relaxed binding).</p>
 *
 * <p>For local development a dev‑only secret is provided in {@code application.yml}. It must be
 * at least 32 bytes (256 bits) for HS256. Do not use this secret in production.</p>
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * HMAC secret key for signing JWTs. Must be at least 32 bytes for HS256.
     */
    private String secret;

    /**
     * Token expiration in seconds. Default 1 hour.
     */
    private long expirationSeconds = 3600L;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }

    public void setExpirationSeconds(long expirationSeconds) {
        this.expirationSeconds = expirationSeconds;
    }
}
