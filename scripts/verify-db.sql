-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'items', COUNT(*) FROM items;

-- Check sample data
SELECT 
    c.name as category,
    i.name as item,
    i.brand,
    i.model,
    i.price,
    i.stock_quantity
FROM items i
JOIN categories c ON i.category_id = c.id
ORDER BY c.name, i.name
LIMIT 10;

-- Check constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';
