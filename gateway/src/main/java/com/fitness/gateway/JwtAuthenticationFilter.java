package com.fitness.gateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Reactive GlobalFilter that validates JWTs for all protected routes.
 *
 * <p>Public routes (register, login, OPTIONS preflight) are skipped entirely.
 * For all other routes, the filter:
 * <ol>
 *   <li>Requires an {@code Authorization: Bearer <token>} header.</li>
 *   <li>Validates the JWT signature (HS256) and expiration.</li>
 *   <li>Extracts {@code sub} (userId), {@code email}, and {@code role} claims.</li>
 *   <li>Forwards trusted headers {@code X-User-ID}, {@code X-User-Email},
 *       {@code X-User-Role} to the downstream service.</li>
 *   <li>Removes any client-supplied {@code X-User-*} headers to prevent spoofing.</li>
 * </ol>
 * </p>
 *
 * <p><strong>IMPORTANT</strong>: JWT tokens and passwords are never logged.</p>
 */
@Component
@Slf4j
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    /** Routes that must be accessible without a JWT. */
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/users/login",
            "/api/users/register"
    );

    private final GatewayJwtProperties jwtProperties;

    public JwtAuthenticationFilter(GatewayJwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    @Override
    public int getOrder() {
        // Run before routing filters but after CORS filter
        return Ordered.LOWEST_PRECEDENCE - 100;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // ── 1. Always allow OPTIONS preflight (handled by CorsWebFilter) ──────────
        if (HttpMethod.OPTIONS.equals(request.getMethod())) {
            return chain.filter(exchange);
        }

        // ── 2. Allow public endpoints without any token ───────────────────────────
        String path = request.getURI().getPath();
        if (isPublicPath(path)) {
            // Strip any X-User-* headers that a malicious caller might inject
            return chain.filter(exchange.mutate()
                    .request(stripUserHeaders(request))
                    .build());
        }

        // ── 3. Extract Authorization header ──────────────────────────────────────
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or malformed Authorization header for path: {}", path);
            return unauthorized(exchange, "Missing or malformed Authorization header");
        }

        String token = authHeader.substring(7);

        // ── 4. Validate JWT ───────────────────────────────────────────────────────
        Claims claims;
        try {
            SecretKey key = Keys.hmacShaKeyFor(
                    jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
            claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException ex) {
            log.warn("Expired JWT received for path: {}", path);
            return unauthorized(exchange, "Token has expired");
        } catch (MalformedJwtException | UnsupportedJwtException ex) {
            log.warn("Malformed JWT received for path: {}", path);
            return unauthorized(exchange, "Invalid token format");
        } catch (SignatureException ex) {
            log.warn("JWT signature validation failed for path: {}", path);
            return unauthorized(exchange, "Invalid token signature");
        } catch (Exception ex) {
            log.warn("JWT validation error for path {}: {}", path, ex.getMessage());
            return unauthorized(exchange, "Token validation failed");
        }

        // ── 5. Extract claims ─────────────────────────────────────────────────────
        String userId = claims.getSubject();       // 'sub' = user UUID
        String email  = claims.get("email",  String.class);
        String role   = claims.get("role",   String.class);

        if (userId == null || userId.isBlank()) {
            log.warn("JWT missing subject claim for path: {}", path);
            return unauthorized(exchange, "Token missing subject claim");
        }

        // ── 6. Mutate request: remove client headers, inject trusted headers ──────
        ServerHttpRequest mutatedRequest = stripUserHeaders(request)
                .mutate()
                .header("X-User-ID",    userId)
                .header("X-User-Email", email  != null ? email : "")
                .header("X-User-Role",  role   != null ? role  : "USER")
                .build();

        log.debug("JWT validated for userId={}, path={}", userId, path);
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────────

    /**
     * Returns true if the path is a public (no-auth) endpoint.
     */
    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::equals);
    }

    /**
     * Strips any incoming X-User-* headers from the client request.
     * This prevents a malicious caller from spoofing identity headers.
     */
    private ServerHttpRequest stripUserHeaders(ServerHttpRequest request) {
        return request.mutate()
                .headers(headers -> {
                    headers.remove("X-User-ID");
                    headers.remove("X-User-Email");
                    headers.remove("X-User-Role");
                })
                .build();
    }

    /**
     * Returns a reactive 401 Unauthorized response with a plain-text reason.
     * Does NOT include stack traces or internal details.
     */
    private Mono<Void> unauthorized(ServerWebExchange exchange, String reason) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json");
        byte[] body = ("{\"error\":\"Unauthorized\",\"message\":\"" + reason + "\"}")
                .getBytes(StandardCharsets.UTF_8);
        var buffer = response.bufferFactory().wrap(body);
        return response.writeWith(Mono.just(buffer));
    }
}
