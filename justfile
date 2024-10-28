set shell := ["C:\\Program Files\\Git\\bin\\bash.exe", "-c"]

start-dev:
    docker compose -f dev.yml up --build --no-deps --force-recreate -d