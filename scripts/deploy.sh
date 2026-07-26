#!/usr/bin/env bash
set -euo pipefail

echo "=== VoxSpeak Deployment ==="

DEPLOY_ENV="${1:-production}"
COMPOSE_FILE="docker/docker-compose.yml"
ENV_FILE="docker/.env.${DEPLOY_ENV}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file $ENV_FILE not found"
  echo "Copy docker/.env.production to $ENV_FILE and fill in values"
  exit 1
fi

echo "Using environment: $DEPLOY_ENV"
echo "Compose file: $COMPOSE_FILE"
echo "Env file: $ENV_FILE"

if [ "$DEPLOY_ENV" = "production" ]; then
  echo "Pulling latest images..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull
fi

echo "Building services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --pull

echo "Stopping existing services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

echo "Starting services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

echo "Running database migrations..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T api npx prisma migrate deploy

echo "Cleaning up old images..."
docker image prune -f

echo "=== Deployment complete! ==="
echo "Run 'docker compose logs -f' to watch logs."
