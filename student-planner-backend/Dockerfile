FROM gradle:8.10.2-jdk21 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle assemble

FROM amazoncorretto:21.0.5-al2023
EXPOSE 8080
COPY --from=build /home/gradle/src/build/libs/backend.jar /app/
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]