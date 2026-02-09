
# Database setup script for Electronic Store Inventory
echo "Setting up Electronic Store Inventory database..."

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
DB_NAME=${DB_NAME:-"electronic_store_inventory"}
DB_USER=${DB_USER:-"inventory_admin"}
DB_PASSWORD=${DB_PASSWORD:-"inventory_password"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432mkdir -p scripts"}

echo "Creating database structure..."
# Run the schema SQL
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f config/database.sql

echo "Inserting seed data..."
# Run the seed data SQL
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f config/seed_data.sql

echo "Database setup completed!"
