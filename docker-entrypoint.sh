set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -U ${DB_USER:-postgres} -d ${DB_NAME:-learning_platform_db}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - executing migrations"
pnpm prisma migrate deploy

echo "Starting application..."
exec "$@"
