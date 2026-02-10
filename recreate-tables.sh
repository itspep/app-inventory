#!/bin/bash

echo "🔄 Recreating tables with correct permissions..."

# Connect as inventory_admin (using sudo to bypass permission issues)
sudo -u postgres psql -d electronic_store_inventory << 'PSQL'
-- Drop existing tables if they exist
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    description TEXT,
    specifications JSONB,
    price DECIMAL(10, 2) CHECK (price >= 0),
    stock_quantity INTEGER CHECK (stock_quantity >= 0) DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id) 
        REFERENCES categories(id)
        ON DELETE RESTRICT
);

-- Grant permissions to inventory_admin
ALTER TABLE categories OWNER TO inventory_admin;
ALTER TABLE items OWNER TO inventory_admin;

-- Create indexes
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_categories_name ON categories(name);
PSQL

echo "📝 Seeding data..."
sudo -u postgres psql -d electronic_store_inventory << 'PSQL'
-- Insert categories
INSERT INTO categories (name, description) VALUES
('Smartphones', 'Mobile phones with advanced computing capability'),
('Tablets', 'Portable touchscreen devices larger than smartphones'),
('Computers', 'Desktop and laptop computers for work and gaming'),
('Gaming Consoles', 'Home video game consoles'),
('Handheld Gaming', 'Portable gaming devices');

-- Insert sample smartphones
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(1, 'iPhone 15 Pro', 'Apple', 'A3104', 'Latest Apple flagship smartphone', '{"screen": "6.1 Super Retina XDR", "storage": "256GB", "ram": "8GB", "processor": "A17 Pro", "camera": "48MP+12MP+12MP"}', 999.99, 25, 'APL-IP15P-256', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch?wid=5120&hei=2880&fmt=webp'),
(1, 'Samsung Galaxy S24', 'Samsung', 'SM-S921B', 'Android flagship with AI features', '{"screen": "6.2 Dynamic AMOLED", "storage": "256GB", "ram": "8GB", "processor": "Snapdragon 8 Gen 3", "camera": "50MP+12MP+10MP"}', 799.99, 30, 'SAM-GS24-256', 'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-s921-sm-s921uzkaxaa-539416987'),
(1, 'Google Pixel 8 Pro', 'Google', 'G8P0', 'Best-in-class camera phone', '{"screen": "6.7 OLED", "storage": "128GB", "ram": "12GB", "processor": "Google Tensor G3", "camera": "50MP+48MP+48MP"}', 899.99, 15, 'GOO-PX8P-128', 'https://store.google.com/product/pixel_8_pro?hl=en-US');

-- Insert sample tablets
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(2, 'iPad Pro 12.9"', 'Apple', 'A2764', 'Professional tablet with M2 chip', '{"screen": "12.9 Liquid Retina XDR", "storage": "256GB", "ram": "8GB", "processor": "M2", "cellular": "WiFi+Cellular"}', 1099.99, 12, 'APL-IPDP-256', 'https://www.apple.com/v/ipad-pro/ai/images/overview/hero/hero__d0l5t6j3kdeq_large.jpg'),
(2, 'Samsung Galaxy Tab S9', 'Samsung', 'SM-X716B', 'Premium Android tablet', '{"screen": "12.4 Dynamic AMOLED", "storage": "256GB", "ram": "12GB", "processor": "Snapdragon 8 Gen 2", "s-pen": "included"}', 899.99, 18, 'SAM-GTBS9-256', 'https://images.samsung.com/is/image/samsung/p6pim/levant/feature/164173812/levant-feature-thin--light--and-packed-with-power-535909146');

-- Insert sample computers
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(3, 'MacBook Pro 16"', 'Apple', 'A2991', 'Professional laptop for creators', '{"screen": "16.2 Liquid Retina XDR", "storage": "512GB SSD", "ram": "16GB", "processor": "M3 Pro", "gpu": "18-core"}', 2499.99, 8, 'APL-MBP16-512', 'https://www.apple.com/v/macbook-pro-14-and-16/b/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg'),
(3, 'Alienware m18', 'Dell', 'AMD18', 'Gaming laptop with RTX 4090', '{"screen": "18 QHD+ 165Hz", "storage": "2TB SSD", "ram": "32GB", "processor": "i9-13900HX", "gpu": "RTX 4090 16GB"}', 3299.99, 5, 'DEL-AWM18-2T', 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m18-r1/media-gallery/notebook-alienware-m18-r1-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3333&hei=1915&qlt=100,1&resMode=sharp2&size=3333,1915');

-- Insert gaming consoles
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(4, 'PlayStation 5', 'Sony', 'CFI-2000', 'Next-gen gaming console', '{"storage": "825GB SSD", "resolution": "8K", "ray-tracing": "yes", "controller": "DualSense"}', 499.99, 15, 'SON-PS5-STD', 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21'),
(4, 'Xbox Series X', 'Microsoft', 'RRT-00001', 'Most powerful Xbox ever', '{"storage": "1TB SSD", "resolution": "8K", "ray-tracing": "yes", "controller": "Xbox Wireless"}', 499.99, 12, 'MS-XBSX-1T', 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4mRni');

-- Insert handheld gaming devices
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(5, 'PlayStation Portal', 'Sony', 'PSP-1000', 'Remote player for PS5', '{"screen": "8 LCD", "connectivity": "WiFi 5", "battery": "7-9 hours", "features": "DualSense integration"}', 199.99, 25, 'SON-PSP-PRT', 'https://gmedia.playstation.com/is/image/SIEPDC/portal-product-thumbnail-01-en-22aug23'),
(5, 'Steam Deck OLED', 'Valve', 'SD-OLED-512', 'Handheld gaming PC', '{"screen": "7.4 OLED", "storage": "512GB", "processor": "AMD Zen 2", "gpu": "AMD RDNA 2"}', 549.99, 8, 'VAL-SDOL-512', 'https://cdn.akamai.steamstatic.com/steamdeck/images/steamdeck_oled_hero.png');
PSQL

echo "✅ Tables created and data seeded!"
echo ""
echo "📊 Verification:"
sudo -u postgres psql -d electronic_store_inventory -c "SELECT 'Categories:' as table, COUNT(*) FROM categories UNION ALL SELECT 'Items:', COUNT(*) FROM items;"
