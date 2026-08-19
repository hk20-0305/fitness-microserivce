# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/configserver-0.0.1-SNAPSHOT.jar /app/config-server.jar

USER appuser

EXPOSE 8888

ENTRYPOINT ["java", "-jar", "/app/config-server.jar"]