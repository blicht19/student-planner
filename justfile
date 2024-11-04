# Starts the database, backend, and pgadmin containers for development.
start-dev-containers:
    docker compose -f dev.yml up --build --no-deps --force-recreate -d

# Installs the npm dependencies and starts the frontend development server
start-frontend-dev:
    cd student-planner-frontend && npm i
    npm run --prefix ./student-planner-frontend dev

# Starts all development containers and the frontend development server
start-dev:
    just start-dev-containers
    just start-frontend-dev

# Starts the app in "production" mode
start-prod:
    docker compose -f prod.yml up --build -d

# Stop all currently running containers
[group('Container utilities. Warning - may affect other unrelated containers')]
stop-all-containers:
    docker stop `docker ps -qa`

# Remove all stopped containers
[group('Container utilities. Warning - may affect other unrelated containers')]
remove-all-containers:
    docker rm `docker ps -qa`

# Remove all images not currently being used
[group('Container utilities. Warning - may affect other unrelated containers')]
remove-all-images:
    docker rmi -f `docker images -qa`

# Remove all unused volumes
[group('Container utilities. Warning - may affect other unrelated containers')]
remove-all-volumes:
    docker volume rm `docker volume ls -q`

# Wipe out all containers, images, and volumes
[group('Container utilities. Warning - may affect other unrelated containers')]
docker-clean:
    just stop-all-containers
    just remove-all-containers
    just remove-all-images
    just remove-all-volumes