FROM ubuntu:24.04
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV ADMIN_USERNAME=$ADMIN_USERNAME
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD

RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

RUN mkdir "/root/student-planner"
COPY prod.yml /root/student-planner
COPY entrypoint.sh /root/student-planner
ADD student-planner-backend /root/student-planner/student-planner-backend
ADD student-planner-frontend /root/student-planner/student-planner-frontend
WORKDIR /root/student-planner
EXPOSE 8080
RUN chmod +x ./entrypoint.sh
CMD ["./entrypoint.sh"]