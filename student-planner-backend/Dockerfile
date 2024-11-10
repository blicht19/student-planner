FROM gradle:8.10.2-jdk21 AS cache
RUN mkdir -- /home/gradle/cache_home
ENV GRADLE_USER_HOME /home/gradle/cache_home
COPY build.gradle.kts /home/gradle/src/
WORKDIR /home/gradle/src
RUN gradle dependencies

FROM gradle:8.10.2-jdk21 AS build
COPY --from=cache /home/gradle/cache_home /home/gradle/.gradle
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle assemble

FROM amazoncorretto:21.0.5-al2023
EXPOSE 8080
COPY --from=build /home/gradle/src/build/libs/backend.jar /app/
ENTRYPOINT ["java", "-jar", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "/app/backend.jar"]