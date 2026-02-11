// Confirm significant updates
document.addEventListener('DOMContentLoaded', function() {
    const editForms = document.querySelectorAll('form[action*="/edit"]');
    
    editForms.forEach(form => {
        // Check if this is an edit form (not delete)
        if (!form.action.includes('delete')) {
            form.addEventListener('submit', function(e) {
                const priceInput = document.getElementById('price');
                const stockInput = document.getElementById('stock_quantity');
                
                if (priceInput && stockInput) {
                    const currentPrice = parseFloat(priceInput.dataset.original) || 0;
                    const currentStock = parseInt(stockInput.dataset.original) || 0;
                    const newPrice = parseFloat(priceInput.value) || 0;
                    const newStock = parseInt(stockInput.value) || 0;
                    
                    // Check for significant changes
                    const priceChange = Math.abs((newPrice - currentPrice) / currentPrice * 100);
                    const stockChange = Math.abs(newStock - currentStock);
                    
                    let confirmMessage = '';
                    
                    if (priceChange > 50 && currentPrice > 0) {
                        confirmMessage += `Price change: $${currentPrice.toFixed(2)} → $${newPrice.toFixed(2)} (${priceChange.toFixed(0)}%)\n`;
                    }
                    
                    if (stockChange > 50) {
                        confirmMessage += `Stock change: ${currentStock} → ${newStock} (${stockChange} units)\n`;
                    }
                    
                    if (newStock === 0 && currentStock > 0) {
                        confirmMessage += '⚠️ Setting stock to 0 (out of stock)\n';
                    }
                    
                    if (confirmMessage) {
                        confirmMessage = 'Significant changes detected:\n\n' + confirmMessage + '\nAre you sure you want to save these changes?';
                        
                        if (!confirm(confirmMessage)) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
            });
        }
    });
});
