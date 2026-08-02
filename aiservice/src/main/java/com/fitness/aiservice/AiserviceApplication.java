package com.fitness.aiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiserviceApplication {

    public static void main(String[] args) {

        System.out.println("URL = " + System.getenv("GEMINI_API_URL"));
        System.out.println("KEY = " + System.getenv("GEMINI_API_KEY"));

        SpringApplication.run(AiserviceApplication.class, args);
    }
}
