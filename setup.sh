#!/bin/bash

echo "Setting up Electronic Store Inventory Database..."

# Stop on error
set -e

# Create database if it doesn't exist
sudo -u postgres psql -c "DROP DATABASE IF EXISTS electronic_store_inventory;"
sudo -u postgres psql -c "CREATE DATABASE electronic_store_inventory;"

# Create user if it doesn't exist
sudo -u postgres psql -c "CREATE USER inventory_admin WITH PASSWORD 'inventory_password_123';" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER inventory_admin CREATEDB;"

# Apply schema
echo "Creating tables..."
sudo -u postgres psql -d electronic_store_inventory -f config/database.sql

echo "Seeding data..."
sudo -u postgres psql -d electronic_store_inventory -f config/seed_data.sql

echo "Database setup complete!"
echo "Tables created:"
sudo -u postgres psql -d electronic_store_inventory -c "\dt"

echo "Sample data:"
sudo -u postgres psql -d electronic_store_inventory -c "SELECT c.name as category, COUNT(i.id) as item_count FROM categories c LEFT JOIN items i ON c.id = i.category_id GROUP BY c.name;"
