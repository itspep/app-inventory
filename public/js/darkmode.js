// Dark mode functionality
class DarkMode {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Create toggle button
        this.createToggle();
        
        // Apply theme
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    createToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.id = 'themeToggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `
            <i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
        `;
        
        document.body.appendChild(toggle);
        
        toggle.addEventListener('click', () => this.toggle());
    }

    toggle() {
        document.body.classList.toggle('dark-mode');
        this.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = `fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
        
        toast.show(`${this.theme === 'dark' ? '🌙' : '☀️'} Dark mode ${this.theme === 'dark' ? 'enabled' : 'disabled'}`, 'info', 2000);
    }
}

// Initialize dark mode
new DarkMode();
