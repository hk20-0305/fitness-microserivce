package com.fitness.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS is handled by the API Gateway; disable CORS processing here to avoid double-handling
            .cors(AbstractHttpConfigurer::disable)
            // CSRF not needed for a stateless REST API
            .csrf(AbstractHttpConfigurer::disable)
            // Disable Spring Security's form-login (removes POST /login handler that caused 405)
            .formLogin(AbstractHttpConfigurer::disable)
            // Disable HTTP Basic authentication
            .httpBasic(AbstractHttpConfigurer::disable)
            // Never create or use an HttpSession — pure stateless REST
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // Public auth endpoints
                    .requestMatchers(HttpMethod.POST, "/api/users/register", "/api/users/login").permitAll()
                    // Preflight CORS requests must always be allowed
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // Phase 1: allow profile and validate endpoints without a JWT filter.
                    // Phase 2 will add a JWT filter and remove this broad permit.
                    .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                    // Everything else requires authentication (enforced in Phase 2 with JWT filter)
                    .anyRequest().authenticated()
            );
        return http.build();
    }
}

