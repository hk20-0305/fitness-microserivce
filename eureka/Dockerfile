# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built jar
COPY --from=build /app/target/eureka-0.0.1-SNAPSHOT.jar /app/eureka-server.jar

# Switch to non-root user
USER appuser

# Expose Eureka server port
EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "/app/eureka-server.jar"]