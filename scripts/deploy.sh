#!/bin/bash

# Script to deploy the Todo application to Kubernetes

echo "Deploying application to Kubernetes..."

# Build Docker images
docker build -t todo-backend -f docker/backend.Dockerfile .
docker build -t todo-frontend -f docker/frontend.Dockerfile .

# Push to registry (if needed)
# docker push todo-backend
# docker push todo-frontend

# Apply Kubernetes manifests
kubectl apply -f docker/k8s/

echo "Deployment complete!"