# Production Dockerfile for Spring Boot server
FROM eclipse-temurin:17-jdk AS base

# Build stage
FROM base AS builder
WORKDIR /app

# Copy Maven files
COPY pom.xml ./
COPY src ./src

# Build the application
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre AS runner
WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
