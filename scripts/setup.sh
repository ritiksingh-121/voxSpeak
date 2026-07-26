#!/usr/bin/env bash
set -euo pipefail

echo "=== VoxSpeak Setup ==="
echo ""

if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm@9
else
  echo "pnpm already installed: $(pnpm --version)"
fi

echo ""
echo "Installing dependencies..."
pnpm install

echo ""
echo "Generating Prisma client..."
pnpm db:generate

echo ""
echo "Running database migrations..."
pnpm db:migrate

echo ""
echo "Seeding database..."
pnpm db:seed

echo ""
echo "=== Setup complete! ==="
echo "Run 'pnpm dev' to start the development server."
