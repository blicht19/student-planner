# Start app for development
start-dev:
    docker compose -f dev.yml up --build --no-deps --force-recreate -d

# Stop development containers
stop-dev:
    docker stop student_planner_backend
    docker stop student_planner_db
    docker stop student_planner_pgadmin