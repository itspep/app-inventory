-- Drop tables if they exist (for development)
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

-- Create indexes for better performance
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_categories_name ON categories(name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for item details with category
CREATE VIEW item_details AS
SELECT 
    i.*,
    c.name as category_name,
    c.description as category_description
FROM items i
JOIN categories c ON i.category_id = c.id;
