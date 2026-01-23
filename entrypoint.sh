#!/bin/sh
set -e

DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres123}
DB_NAME=${DB_NAME:-learning_platform_db}
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
fi

echo "DATABASE_URL is set: $DATABASE_URL"
echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h $DB_HOST -U $DB_USER -d $DB_NAME; do
  echo "PostgreSQL is unavailable - sleeping 2s"
  sleep 2
done

echo "PostgreSQL is up - executing migrations"
pnpm prisma migrate deploy

echo "Starting application..."
exec "$@"
