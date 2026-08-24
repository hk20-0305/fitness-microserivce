package com.fitness.userservice.util;

import com.fitness.userservice.config.JwtProperties;
import com.fitness.userservice.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Utility class for creating JWT tokens.
 *
 * The secret key must be at least 32 bytes for HS256 security.
 */
@Component
public class JwtUtil {

    private final JwtProperties jwtProperties;
    private final Key signingKey;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    /**
     * Generate a signed JWT for the given user.
     *
     * @param user authenticated user
     * @return JWT token string
     */
    public String generateToken(User user) {
        long now = System.currentTimeMillis();
        Date issuedAt = new Date(now);
        Date expiration = new Date(now + jwtProperties.getExpirationSeconds() * 1000L);
        return Jwts.builder()
                .setSubject(user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
