#!/bin/bash
CIRCLE_TAG="$(git tag -l --points-at HEAD)"
VERSION="${CIRCLE_TAG:1}"

echo "========="
echo "RELEASE ${VERSION}"

# Login to dockerhub
docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD

# Build docker
docker build -t $DOCKER_HUB_REPOSITORY-web:latest .
docker tag $DOCKER_HUB_REPOSITORY-web:latest $DOCKER_HUB_REPOSITORY-web:$CI_COMMIT_TAG

# Deploy to dockerhub
docker push $DOCKER_HUB_REPOSITORY-web:latest
docker push $DOCKER_HUB_REPOSITORY-web:$CI_COMMIT_TAG
