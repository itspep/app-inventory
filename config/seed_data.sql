-- Seed data for Electronic Store Inventory

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Smartphones', 'Mobile phones with advanced computing capability'),
('Tablets', 'Portable touchscreen devices larger than smartphones'),
('Computers', 'Desktop and laptop computers for work and gaming'),
('Gaming Consoles', 'Home video game consoles'),
('Handheld Gaming', 'Portable gaming devices');

-- Insert sample smartphones
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(1, 'iPhone 15 Pro', 'Apple', 'A3104', 'Latest Apple flagship smartphone', '{"screen": "6.1" Super Retina XDR", "storage": "256GB", "ram": "8GB", "processor": "A17 Pro", "camera": "48MP+12MP+12MP"}', 999.99, 25, 'APL-IP15P-256', 'https://example.com/iphone15.jpg'),
(1, 'Samsung Galaxy S24', 'Samsung', 'SM-S921B', 'Android flagship with AI features', '{"screen": "6.2" Dynamic AMOLED", "storage": "256GB", "ram": "8GB", "processor": "Snapdragon 8 Gen 3", "camera": "50MP+12MP+10MP"}', 799.99, 30, 'SAM-GS24-256', 'https://example.com/galaxy-s24.jpg'),
(1, 'Google Pixel 8 Pro', 'Google', 'G8P0', 'Best-in-class camera phone', '{"screen": "6.7" OLED", "storage": "128GB", "ram": "12GB", "processor": "Google Tensor G3", "camera": "50MP+48MP+48MP"}', 899.99, 15, 'GOO-PX8P-128', 'https://example.com/pixel8.jpg');

-- Insert sample tablets
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(2, 'iPad Pro 12.9"', 'Apple', 'A2764', 'Professional tablet with M2 chip', '{"screen": "12.9" Liquid Retina XDR", "storage": "256GB", "ram": "8GB", "processor": "M2", "cellular": "WiFi+Cellular"}', 1099.99, 12, 'APL-IPDP-256', 'https://example.com/ipad-pro.jpg'),
(2, 'Samsung Galaxy Tab S9', 'Samsung', 'SM-X716B', 'Premium Android tablet', '{"screen": "12.4" Dynamic AMOLED", "storage": "256GB", "ram": "12GB", "processor": "Snapdragon 8 Gen 2", "s-pen": "included"}', 899.99, 18, 'SAM-GTBS9-256', 'https://example.com/tab-s9.jpg');

-- Insert sample computers
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(3, 'MacBook Pro 16"', 'Apple', 'A2991', 'Professional laptop for creators', '{"screen": "16.2" Liquid Retina XDR", "storage": "512GB SSD", "ram": "16GB", "processor": "M3 Pro", "gpu": "18-core"}', 2499.99, 8, 'APL-MBP16-512', 'https://example.com/macbook-pro.jpg'),
(3, 'Alienware m18', 'Dell', 'AMD18', 'Gaming laptop with RTX 4090', '{"screen": "18" QHD+ 165Hz", "storage": "2TB SSD", "ram": "32GB", "processor": "i9-13900HX", "gpu": "RTX 4090 16GB"}', 3299.99, 5, 'DEL-AWM18-2T', 'https://example.com/alienware.jpg'),
(3, 'Surface Laptop Studio', 'Microsoft', 'SFI-00001', 'Convertible laptop for professionals', '{"screen": "14.4" PixelSense Flow", "storage": "1TB SSD", "ram": "32GB", "processor": "i7-11370H", "gpu": "RTX 3050 Ti"}', 2199.99, 10, 'MS-SLAP-1TB', 'https://example.com/surface-studio.jpg');

-- Insert gaming consoles
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(4, 'PlayStation 5', 'Sony', 'CFI-2000', 'Next-gen gaming console', '{"storage": "825GB SSD", "resolution": "8K", "ray-tracing": "yes", "controller": "DualSense"}', 499.99, 15, 'SON-PS5-STD', 'https://example.com/ps5.jpg'),
(4, 'Xbox Series X', 'Microsoft', 'RRT-00001', 'Most powerful Xbox ever', '{"storage": "1TB SSD", "resolution": "8K", "ray-tracing": "yes", "controller": "Xbox Wireless"}', 499.99, 12, 'MS-XBSX-1T', 'https://example.com/xbox-series-x.jpg'),
(4, 'Nintendo Switch OLED', 'Nintendo', 'HEG-001', 'Hybrid gaming console', '{"screen": "7" OLED", "storage": "64GB", "resolution": "1080p docked", "battery": "4.5-9 hours"}', 349.99, 20, 'NIN-NSW-OLED', 'https://example.com/switch-oled.jpg');

-- Insert handheld gaming devices
INSERT INTO items (category_id, name, brand, model, description, specifications, price, stock_quantity, sku, image_url) VALUES
(5, 'PlayStation Portal', 'Sony', 'PSP-1000', 'Remote player for PS5', '{"screen": "8" LCD", "connectivity": "WiFi 5", "battery": "7-9 hours", "features": "DualSense integration"}', 199.99, 25, 'SON-PSP-PRT', 'https://example.com/ps-portal.jpg'),
(5, 'Steam Deck OLED', 'Valve', 'SD-OLED-512', 'Handheld gaming PC', '{"screen": "7.4" OLED", "storage": "512GB", "processor": "AMD Zen 2", "gpu": "AMD RDNA 2"}', 549.99, 8, 'VAL-SDOL-512', 'https://example.com/steam-deck.jpg'),
(5, 'Game Boy Advance SP', 'Nintendo', 'AGS-001', 'Classic handheld (Retro)', '{"screen": "2.9" front-lit", "battery": "rechargeable", "compatibility": "GBA/GB games"}', 129.99, 5, 'NIN-GBA-SP', 'https://example.com/gba-sp.jpg');

-- Display summary
SELECT 
    c.name as category,
    COUNT(i.id) as item_count,
    SUM(i.stock_quantity) as total_stock,
    SUM(i.price * i.stock_quantity) as total_value
FROM categories c
LEFT JOIN items i ON c.id = i.category_id
GROUP BY c.name
ORDER BY c.name;
