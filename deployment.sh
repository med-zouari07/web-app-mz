#!/bin/bash

set -e

IMAGE_NAME="bonvoisinage"
DOCKERHUB_USER="zouarimed07"
VERSION="1.0"

echo "Building image..."
docker build -t ${IMAGE_NAME}:latest .

echo "Tagging image..."
docker tag ${IMAGE_NAME}:latest ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}

echo "Pushing image..."
docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}

echo "Done!"
echo "Image pushed: ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}"