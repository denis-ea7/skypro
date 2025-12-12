#!/bin/bash

set -e

SERVER="109.61.108.37"
USER="denis"
PASSWORD="wss34343v9"
PORT="3009"
REMOTE_DIR="/home/denis/skypro"

echo "Building Docker image..."
docker build -t skypro-expenses .

echo "Saving Docker image..."
docker save skypro-expenses | gzip > skypro-expenses.tar.gz

echo "Copying files to server..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no skypro-expenses.tar.gz docker-compose.yml "$USER@$SERVER:$REMOTE_DIR/"

echo "Deploying on server..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USER@$SERVER" << EOF
mkdir -p $REMOTE_DIR
cd $REMOTE_DIR
docker load < skypro-expenses.tar.gz 2>/dev/null || docker load < skypro-expenses.tar.gz
docker-compose down || true
docker-compose up -d
docker ps | grep skypro-expenses || echo "Container started"
EOF

echo "Cleaning up..."
rm -f skypro-expenses.tar.gz

echo "Deployment complete! App should be available at http://$SERVER:$PORT"
