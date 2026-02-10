# Manual Test for CREATE Operations

## Test 1: Create New Category
1. Go to: http://localhost:3000/categories/new
2. Fill in:
   - Name: "Accessories"
   - Description: "Phone cases, chargers, headphones, etc."
3. Click "Create Category"
4. Verify: Redirects to /categories with success message
5. Verify: New category appears in categories list

## Test 2: Create New Item
1. Go to: http://localhost:3000/items/new
2. Fill in:
   - Category: Select "Accessories" (or any category)
   - Name: "Wireless Earbuds"
   - Brand: "Sony"
   - Model: "WF-1000XM4"
   - Price: 249.99
   - Stock: 15
   - SKU: "SON-WF1000XM4"
   - Description: "Premium noise-cancelling earbuds"
   - Image URL: (optional test URL)
3. Click "Create Item"
4. Verify: Redirects to item detail page with success message
5. Verify: Item appears in category items list

## Test 3: Form Validation
1. Try to submit empty forms
2. Try negative prices/stock
3. Try invalid URLs
4. Verify: Client-side validation prevents submission
5. Verify: Error messages appear

## Test 4: JSON Specifications
1. In item form, try:
   - Valid JSON: {"battery": "24 hours", "connectivity": "Bluetooth 5.2"}
   - Invalid JSON: {battery: 24 hours}
2. Verify: Valid JSON is accepted
3. Verify: Invalid JSON shows error (but doesn't prevent submission on client side)

## Expected Results:
- All forms submit successfully
- Data appears in database
- Success messages show
- Redirects work correctly
