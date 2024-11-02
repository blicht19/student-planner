# Start app for development
start-dev:
    docker compose -f dev.yml up --build --no-deps --force-recreate -d

stop-all-containers:
    docker stop `docker ps -qa`

remove-all-containers:
    docker rm `docker ps -qa`

remove-all-images:
    docker rmi -f `docker images -qa`

remove-all-volumes:
    docker volume rm `docker volume ls -q`

docker-clean:
    just stop-all-containers
    just remove-all-containers
    just remove-all-images
    just remove-all-volumes