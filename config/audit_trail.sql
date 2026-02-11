-- Audit trail for items table
CREATE TABLE IF NOT EXISTS item_changes (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100),
    CONSTRAINT fk_item
        FOREIGN KEY(item_id) 
        REFERENCES items(id)
        ON DELETE CASCADE
);

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_item_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.name IS DISTINCT FROM NEW.name THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'name', OLD.name, NEW.name);
    END IF;
    
    IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'category_id', OLD.category_id::TEXT, NEW.category_id::TEXT);
    END IF;
    
    IF OLD.price IS DISTINCT FROM NEW.price THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'price', OLD.price::TEXT, NEW.price::TEXT);
    END IF;
    
    IF OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'stock_quantity', OLD.stock_quantity::TEXT, NEW.stock_quantity::TEXT);
    END IF;
    
    IF OLD.brand IS DISTINCT FROM NEW.brand THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'brand', OLD.brand, NEW.brand);
    END IF;
    
    IF OLD.model IS DISTINCT FROM NEW.model THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'model', OLD.model, NEW.model);
    END IF;
    
    IF OLD.sku IS DISTINCT FROM NEW.sku THEN
        INSERT INTO item_changes (item_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'sku', OLD.sku, NEW.sku);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for item changes
DROP TRIGGER IF EXISTS item_changes_trigger ON items;
CREATE TRIGGER item_changes_trigger
    AFTER UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION log_item_changes();

-- Index for faster queries
CREATE INDEX idx_item_changes_item_id ON item_changes(item_id);
CREATE INDEX idx_item_changes_changed_at ON item_changes(changed_at DESC);
