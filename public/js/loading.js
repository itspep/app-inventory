// Loading states for forms
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (submitBtn && !submitBtn.classList.contains('btn-loading')) {
                const originalText = submitBtn.innerHTML;
                submitBtn.classList.add('btn-loading');
                submitBtn.innerHTML = '<span>' + originalText + '</span>';
                
                // Prevent double submission
                setTimeout(() => {
                    if (submitBtn.classList.contains('btn-loading')) {
                        submitBtn.classList.remove('btn-loading');
                        submitBtn.innerHTML = originalText;
                    }
                }, 10000);
            }
        });
    });
    
    // Add skeleton loading to tables
    const tables = document.querySelectorAll('.table-container');
    if (tables.length > 0) {
        tables.forEach(table => {
            if (table.querySelector('tbody tr') === null) {
                // Show skeleton loading
                const skeletonRows = 5;
                let skeletonHtml = '<tbody>';
                for (let i = 0; i < skeletonRows; i++) {
                    skeletonHtml += '<tr>';
                    skeletonHtml += '<td colspan="7"><div class="skeleton" style="height: 60px;"></div></td>';
                    skeletonHtml += '</tr>';
                }
                skeletonHtml += '</tbody>';
                table.querySelector('table').innerHTML = skeletonHtml;
            }
        });
    }
});
