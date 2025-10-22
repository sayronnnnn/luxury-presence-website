/**
 * Navigation Module
 * Handles navigation functionality including mobile menu and smooth scrolling
 */

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle scroll events
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 16));
        
        // Handle resize events
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }
    
    openMobileMenu() {
        Utils.addClass(this.navMenu, 'active');
        Utils.addClass(this.mobileToggle, 'active');
        Utils.addClass(document.body, 'menu-open');
        this.isMenuOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.mobileToggle.setAttribute('aria-label', 'Close mobile menu');
    }
    
    closeMobileMenu() {
        Utils.removeClass(this.navMenu, 'active');
        Utils.removeClass(this.mobileToggle, 'active');
        Utils.removeClass(document.body, 'menu-open');
        this.isMenuOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Focus management
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.mobileToggle.setAttribute('aria-label', 'Open mobile menu');
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class to navbar
        if (scrollY > 100) {
            Utils.addClass(this.navbar, 'scrolled');
        } else {
            Utils.removeClass(this.navbar, 'scrolled');
        }
        
        // Update active navigation link
        this.setActiveLink();
    }
    
    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = Utils.getOffsetTop(section);
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Remove active class from all links
                this.navLinks.forEach(link => Utils.removeClass(link, 'active'));
                // Add active class to current link
                Utils.addClass(navLink, 'active');
            }
        });
    }
    
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    // Smooth scroll to section
    scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = this.navbar.offsetHeight;
            Utils.smoothScrollTo(targetElement, offset);
        }
    }
    
    // Handle navigation link clicks
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
