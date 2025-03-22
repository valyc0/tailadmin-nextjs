#!/bin/bash

# Stop any existing containers
docker-compose down

# Build and start the services in detached mode
docker-compose up --build -d

# Show logs
docker-compose logs -f