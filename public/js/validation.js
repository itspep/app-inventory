// Form validation for inventory app
document.addEventListener('DOMContentLoaded', function() {
    // Category form validation
    const categoryForm = document.querySelector('form[action*="/categories"]');
    if (categoryForm && !categoryForm.action.includes('delete')) {
        categoryForm.addEventListener('submit', function(e) {
            const nameInput = document.getElementById('name');
            if (!nameInput || nameInput.value.trim() === '') {
                e.preventDefault();
                alert('Category name is required!');
                nameInput.focus();
                return false;
            }
        });
    }

    // Item form validation
    const itemForm = document.querySelector('form[action*="/items"]');
    if (itemForm && !itemForm.action.includes('delete')) {
        itemForm.addEventListener('submit', function(e) {
            const nameInput = document.getElementById('name');
            const categorySelect = document.getElementById('category_id');
            const priceInput = document.getElementById('price');
            const stockInput = document.getElementById('stock_quantity');
            
            let errors = [];
            
            if (!nameInput || nameInput.value.trim() === '') {
                errors.push('Item name is required');
                nameInput.classList.add('is-invalid');
            }
            
            if (!categorySelect || categorySelect.value === '') {
                errors.push('Category is required');
                categorySelect.classList.add('is-invalid');
            }
            
            if (priceInput && parseFloat(priceInput.value) < 0) {
                errors.push('Price cannot be negative');
                priceInput.classList.add('is-invalid');
            }
            
            if (stockInput && parseInt(stockInput.value) < 0) {
                errors.push('Stock quantity cannot be negative');
                stockInput.classList.add('is-invalid');
            }
            
            if (errors.length > 0) {
                e.preventDefault();
                alert('Please fix the following errors:\n\n' + errors.join('\n'));
                return false;
            }
        });
    }

    // Add validation styling
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });

    // Auto-format price input
    const priceInput = document.getElementById('price');
    if (priceInput) {
        priceInput.addEventListener('blur', function() {
            let value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                this.value = value.toFixed(2);
            }
        });
    }

    // Auto-format stock input
    const stockInput = document.getElementById('stock_quantity');
    if (stockInput) {
        stockInput.addEventListener('blur', function() {
            let value = parseInt(this.value);
            if (!isNaN(value) && value >= 0) {
                this.value = Math.floor(value);
            }
        });
    }

    // JSON specification validation
    const specInput = document.getElementById('specifications');
    if (specInput) {
        specInput.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                try {
                    JSON.parse(this.value);
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } catch (e) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                    console.log('Invalid JSON in specifications:', e.message);
                }
            }
        });
    }

    // Admin password validation for delete forms
    const deleteForms = document.querySelectorAll('form[action*="delete"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const passwordInput = this.querySelector('input[type="password"]');
            if (passwordInput && passwordInput.value.trim() === '') {
                e.preventDefault();
                alert('Admin password is required for deletion!');
                passwordInput.focus();
                return false;
            }
        });
    });
});
