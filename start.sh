#!/bin/bash

# Stop and remove existing container if exists
docker stop nginx-proxy 2>/dev/null
docker rm nginx-proxy 2>/dev/null

# Start nginx container
docker run -d \
  --name nginx-proxy \
  -p 8065:8065 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  --add-host=host.docker.internal:host-gateway \
  nginx:latest

echo "Nginx reverse proxy started on port 8065"
echo "Frontend accessible at http://localhost:8065"
echo "Backend accessible at http://localhost:8065/api"