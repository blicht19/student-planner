#!/bin/bash

dockerd &
while ! docker info; do sleep 1; done
docker compose -f prod.yml up --build