#!/bin/sh
set -e

echo "=========================================="
echo "WBRE PRODUCTION DATABASE MIGRATION"
echo "=========================================="

if [ -z "$DATABASE_URL" ]; then
  echo "[Warning] DATABASE_URL is not set. Skipping migrations."
  exit 0
fi

echo "[Prisma] Deploying pending migrations to PostgreSQL..."
npx prisma migrate deploy

echo "[Prisma] Migrations completed successfully."
