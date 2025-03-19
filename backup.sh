#!/bin/bash

# Get current timestamp for backup file name
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="myapp_backup_${TIMESTAMP}.tar.gz"

# Move to parent directory
cd ..

# Create tar archive excluding unnecessary directories
tar --exclude='myapp/backend/target' \
    --exclude='myapp/client/node_modules' \
    --exclude='myapp/client/.next' \
    --exclude='myapp/client/.turbo' \
    --exclude='myapp/client/dist' \
    --exclude='myapp/client/build' \
    --exclude='myapp/.git' \
    -czf "${BACKUP_NAME}" myapp/

echo "Backup created: ${BACKUP_NAME}"