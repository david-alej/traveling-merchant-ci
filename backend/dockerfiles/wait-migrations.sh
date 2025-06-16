#!/bin/sh
set -e

# Choose the correct DB URL based on NODE_ENV
case "$NODE_ENV" in
  "production")
    DB_URL="${DATABASE_URL}"
    ;;
  "development")
    DB_URL="${DEV_DATABASE_URL:-$DATABASE_URL}"
    ;;
  "test")
    DB_URL="${TEST_DATABASE_URL:-$DATABASE_URL}"
    ;;
  *)
    echo "Unknown NODE_ENV: $NODE_ENV"
    exit 1
    ;;
esac

# Validate it's set
: "${DB_URL:?No valid database URL set for NODE_ENV=$NODE_ENV}"

until psql "$DATABASE_URL" -c "SELECT 1 FROM \"SeedMeta\" LIMIT 1;" > /dev/null 2>&1; do
  echo "SeedMeta table not found, waiting..."
  sleep 2
done

echo "SeedMeta table found — migrations complete. Starting app..."
exec "$@"