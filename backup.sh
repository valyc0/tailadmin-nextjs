#!/bin/bash

# Get current timestamp for backup file name
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="tailadmin-nextjs_backup_${TIMESTAMP}.tar.gz"

# Move to parent directory
cd ..

# Create tar archive excluding unnecessary directories
tar --exclude='tailadmin-nextjs/backend/target' \
    --exclude='tailadmin-nextjs/client/node_modules' \
    --exclude='tailadmin-nextjs/client/.next' \
    --exclude='tailadmin-nextjs/client/.turbo' \
    --exclude='tailadmin-nextjs/client/dist' \
    --exclude='tailadmin-nextjs/client/build' \
    --exclude='tailadmin-nextjs/.git' \
    -czf "${BACKUP_NAME}" tailadmin-nextjs/

echo "Backup created: ${BACKUP_NAME}"