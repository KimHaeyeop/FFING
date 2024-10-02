# Use official OpenJDK runtime as Parent Image
FROM openjdk:17-jdk-slim

# Update ubuntu Packages
RUN apt-get -y update

# Set the working directory inside the container
WORKDIR /home/ubuntu

# Set Timezone
ENV TZ=Asia/Seoul

# Copy the Gradle wrapper and project files into the container
COPY /build/libs/ffing-0.0.1-SNAPSHOT.jar app.jar
COPY /env-develop.env env-develop.env

# Expose port 8900
EXPOSE 8900

# Set the entry point to run the application
ENTRYPOINT ["java", "-Dspring.profiles.active=develop", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]

