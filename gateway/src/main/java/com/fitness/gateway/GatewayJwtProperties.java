package com.fitness.gateway;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds the jwt.secret property for use by the Gateway JWT filter.
 *
 * <p>The same JWT_SECRET environment variable must be set on both the User Service
 * and the API Gateway so that tokens signed by User Service can be validated here.</p>
 *
 * <p>Local dev fallback: "0123456789abcdef0123456789abcdef" (set in application.yml).
 * Do NOT use this fallback in production — set JWT_SECRET env var instead.</p>
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class GatewayJwtProperties {

    /** HMAC-SHA256 secret — must be at least 32 bytes (256 bits). */
    private String secret;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }
}
