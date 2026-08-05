# Stage 1: Build with Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy source code
COPY . .

# Build the project (skip tests for faster build)
RUN mvn clean package -DskipTests

# Stage 2: Runtime using full Ubuntu image with JDK
FROM ubuntu:22.04
WORKDIR /app

# Install JDK 21
RUN apt-get update && \
    apt-get install -y openjdk-21-jdk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the built jar from build stage
COPY --from=build /app/target/medicineRemainder-0.0.1-SNAPSHOT.jar app.jar

# Expose application port
EXPOSE 8080

# Run the application directly
CMD ["java", "-jar", "app.jar"]