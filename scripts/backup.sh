#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="${DB_NAME:-voxspeak}"
DB_USER="${DB_USER:-voxspeak}"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Backing up PostgreSQL database: $DB_NAME"
pg_dump -U "$DB_USER" -d "$DB_NAME" --no-owner | gzip > "$BACKUP_FILE"

echo "Backup saved: $BACKUP_FILE"
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup size: $BACKUP_SIZE"

if [ -n "${S3_ENDPOINT:-}" ] && [ -n "${S3_BUCKET:-}" ]; then
  echo "Uploading to S3-compatible storage..."
  if command -v aws &> /dev/null; then
    aws s3 cp "$BACKUP_FILE" "${S3_BUCKET}/database/" \
      --endpoint-url "$S3_ENDPOINT"
    echo "Upload complete"
  elif command -v mc &> /dev/null; then
    mc cp "$BACKUP_FILE" "s3/${S3_BUCKET}/database/"
    echo "Upload complete"
  else
    echo "WARNING: Neither 'aws' nor 'mc' CLI found. Skipping upload."
  fi
fi

echo "Backup process completed successfully."
