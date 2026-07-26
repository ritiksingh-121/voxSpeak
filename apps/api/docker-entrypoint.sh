#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null && echo "Migrations applied successfully" || {
  echo "No existing migrations found - running db push instead..."
  npx prisma db push --accept-data-loss
}

echo "Starting VoxSpeak API..."
exec node dist/main
