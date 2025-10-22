/**
 * Main Application Entry Point
 * Initializes all modules and handles global application logic
 */

class Application {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.setupGlobalStyles();
        this.initializeModules();
        this.bindGlobalEvents();
        this.isInitialized = true;
        
        console.log('Application initialized successfully');
    }
    
    setupGlobalStyles() {
        // Add global CSS variables and styles
        const globalStyles = `
            :root {
                --scrollbar-width: 0px;
            }
            
            * {
                scrollbar-width: thin;
                scrollbar-color: var(--accent-color) transparent;
            }
            
            *::-webkit-scrollbar {
                width: 8px;
            }
            
            *::-webkit-scrollbar-track {
                background: transparent;
            }
            
            *::-webkit-scrollbar-thumb {
                background: var(--accent-color);
                border-radius: 4px;
            }
            
            *::-webkit-scrollbar-thumb:hover {
                background: var(--accent-light);
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            .loading {
                opacity: 0.6;
                pointer-events: none;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = globalStyles;
        document.head.appendChild(styleSheet);
    }
    
    initializeModules() {
        // Initialize navigation
        this.modules.navigation = new Navigation();
        
        // Initialize particle system (if not reduced motion)
        if (!Utils.prefersReducedMotion()) {
            this.modules.particles = new ParticleSystem('particles');
        }
        
        // Initialize form handler
        this.modules.forms = new FormHandler();
        
        // Initialize animation controller
        this.modules.animations = new AnimationController();
        
        // Initialize image loading
        Utils.initImageLoading();
        
        // Initialize additional features
        this.initializeAdditionalFeatures();
    }
    
    initializeAdditionalFeatures() {
        // Add smooth scrolling to all anchor links
        this.setupSmoothScrolling();
        
        // Add loading states
        this.setupLoadingStates();
        
        // Add keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = document.getElementById('navbar')?.offsetHeight || 0;
                    Utils.smoothScrollTo(targetElement, offset);
                }
            });
        });
    }
    
    setupLoadingStates() {
        // Add loading state to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                Utils.removeClass(img, 'loading');
            });
            
            img.addEventListener('error', () => {
                Utils.addClass(img, 'error');
                img.alt = 'Image failed to load';
            });
            
            if (!img.complete) {
                Utils.addClass(img, 'loading');
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('nav-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    const toggle = document.getElementById('mobile-menu-toggle');
                    if (toggle) toggle.click();
                }
            }
            
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if (window.performance) {
                const perfData = window.performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });
        
        // Monitor scroll performance
        let scrollCount = 0;
        window.addEventListener('scroll', Utils.throttle(() => {
            scrollCount++;
            if (scrollCount % 100 === 0) {
                console.log('Scroll events:', scrollCount);
            }
        }, 100));
    }
    
    bindGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Connection lost', 'warning');
        });
    }
    
    handleResize() {
        // Update viewport dimensions
        const dimensions = Utils.getViewportDimensions();
        
        // Update CSS custom properties
        Utils.setCSSVariable('--viewport-width', `${dimensions.width}px`);
        Utils.setCSSVariable('--viewport-height', `${dimensions.height}px`);
        
        // Handle responsive changes
        if (Utils.isMobile()) {
            Utils.addClass(document.body, 'mobile');
            Utils.removeClass(document.body, 'tablet desktop');
        } else if (Utils.isTablet()) {
            Utils.addClass(document.body, 'tablet');
            Utils.removeClass(document.body, 'mobile desktop');
        } else {
            Utils.addClass(document.body, 'desktop');
            Utils.removeClass(document.body, 'mobile tablet');
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause animations
            this.pauseAnimations();
        } else {
            // Page is visible, resume animations
            this.resumeAnimations();
        }
    }
    
    pauseAnimations() {
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }
    
    resumeAnimations() {
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Public API methods
    getModule(name) {
        return this.modules[name];
    }
    
    destroy() {
        // Clean up modules
        Object.values(this.modules).forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.App = new Application();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.App) {
        window.App.destroy();
    }
});
