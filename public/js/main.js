// ============================================
// ELECTRONIC STORE INVENTORY - MAIN JAVASCRIPT
// ============================================

// Toast Notification System
class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        }[type] || 'fa-circle-info';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        
        const timeout = setTimeout(() => this.remove(toast), duration);
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.remove(toast);
        });
        
        return toast;
    }

    remove(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }

    success(msg, duration) { return this.show(msg, 'success', duration); }
    error(msg, duration) { return this.show(msg, 'error', duration); }
    warning(msg, duration) { return this.show(msg, 'warning', duration); }
    info(msg, duration) { return this.show(msg, 'info', duration); }
}

// Dark Mode Manager
class DarkMode {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        this.createToggle();
    }

    createToggle() {
        const existing = document.getElementById('themeToggle');
        if (existing) {
            // ensure icon reflects current theme and attach listener
            const icon = existing.querySelector('i');
            if (icon) icon.className = `fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
            existing.addEventListener('click', () => this.toggle());
            return;
        }

        const toggle = document.createElement('button');
        toggle.id = 'themeToggle';
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `<i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>`;

        toggle.addEventListener('click', () => this.toggle());
        document.body.appendChild(toggle);
    }

    toggle() {
        document.body.classList.toggle('dark-mode');
        this.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = `fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
        }
        
        if (window.toast) {
            window.toast.info(`${this.theme === 'dark' ? '🌙' : '☀️'} Dark mode ${this.theme === 'dark' ? 'enabled' : 'disabled'}`, 2000);
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inventory App Initialized');
    
    // Initialize Toast
    window.toast = new Toast();
    
    // Initialize Dark Mode
    new DarkMode();
    
    // ===== URL PARAMS TO TOAST =====
    const urlParams = new URLSearchParams(window.location.search);
    const successMsg = urlParams.get('success');
    const errorMsg = urlParams.get('error');
    
    if (successMsg) {
        window.toast.success(decodeURIComponent(successMsg));
        const url = new URL(window.location);
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url);
    }
    
    if (errorMsg) {
        window.toast.error(decodeURIComponent(errorMsg));
        const url = new URL(window.location);
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url);
    }
    
    // ===== DELETE CONFIRMATION =====
    document.querySelectorAll('form[data-confirm]').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm(this.dataset.confirm || 'Are you sure?')) {
                e.preventDefault();
            }
        });
    });
    
    // ===== ACTIVE NAVIGATION =====
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.startsWith('/categories') && href === '/categories') ||
            (currentPath.startsWith('/items') && href === '/items') ||
            (currentPath.startsWith('/changes') && href === '/changes') ||
            (currentPath.startsWith('/low-stock') && href === '/low-stock')) {
            link.classList.add('active');
        }
    });
    
    // ===== PASSWORD TOGGLE =====
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.closest('.password-container')?.querySelector('input');
            if (input) {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    });
    
    // ===== FORM LOADING STATES =====
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const btn = this.querySelector('button[type="submit"]');
            if (btn && !btn.classList.contains('btn-loading')) {
                btn.classList.add('btn-loading');
            }
        });
    });
    
    // ===== FADE IN ANIMATION =====
    document.querySelectorAll('.card, .dashboard-card, .section, .item-detail').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${i * 0.05}s`;
    });
});

// Handle back/forward cache
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});
