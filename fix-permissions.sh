#!/bin/bash

echo "🔧 Fixing database permissions..."

# Change database owner to inventory_admin
sudo -u postgres psql -c "ALTER DATABASE electronic_store_inventory OWNER TO inventory_admin;"

# Grant all privileges to inventory_admin
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE electronic_store_inventory TO inventory_admin;"

# Connect to database and grant permissions on tables
sudo -u postgres psql -d electronic_store_inventory -c "
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO inventory_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO inventory_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO inventory_admin;
"

echo "✅ Permissions fixed!"
