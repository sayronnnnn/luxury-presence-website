/**
 * Animations Module
 * Handles scroll-triggered animations and intersection observer
 */

class AnimationController {
    constructor() {
        this.animatedElements = [];
        this.observer = null;
        this.easing = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInQuart: t => t * t * t * t,
            easeOutQuart: t => 1 - (--t) * t * t * t,
            easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
            easeInQuint: t => t * t * t * t * t,
            easeOutQuint: t => 1 + (--t) * t * t * t * t,
            easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
        };
        this.init();
    }
    
    init() {
        if (Utils.prefersReducedMotion()) return;
        
        this.setupIntersectionObserver();
        this.bindEvents();
        this.observeElements();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);
    }
    
    bindEvents() {
        // Handle scroll events for parallax effects
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));
        
        // Handle resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    observeElements() {
        // Observe elements with animation classes
        const elements = document.querySelectorAll('[class*="scroll-reveal"], [class*="animate-"]');
        elements.forEach(element => {
            this.observer.observe(element);
        });
        
        // Observe service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
        
        // Observe testimonial cards
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            this.observer.observe(card);
        });
        
        // Observe stat items for number counting
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            this.observer.observe(item);
        });
    }
    
    triggerAnimation(element) {
        // Add revealed class for scroll reveal animations
        if (element.classList.contains('scroll-reveal')) {
            Utils.addClass(element, 'revealed');
        }
        
        if (element.classList.contains('scroll-reveal-left')) {
            Utils.addClass(element, 'revealed');
        }
        
        if (element.classList.contains('scroll-reveal-right')) {
            Utils.addClass(element, 'revealed');
        }
        
        if (element.classList.contains('scroll-reveal-scale')) {
            Utils.addClass(element, 'revealed');
        }
        
        // Trigger specific animations
        if (element.classList.contains('service-card')) {
            this.animateServiceCard(element);
        }
        
        if (element.classList.contains('testimonial-card')) {
            this.animateTestimonialCard(element);
        }
        
        if (element.classList.contains('stat-item')) {
            this.animateStatItem(element);
        }
        
        // Add revealed class for stat items
        if (element.classList.contains('stat-item')) {
            Utils.addClass(element, 'revealed');
        }
    }
    
    animateServiceCard(card) {
        Utils.addClass(card, 'animate-fade-in-up');
        
        // Animate icon
        const icon = card.querySelector('.service-icon');
        if (icon) {
            setTimeout(() => {
                Utils.addClass(icon, 'animate-scale-in');
            }, 200);
        }
    }
    
    animateTestimonialCard(card) {
        Utils.addClass(card, 'animate-fade-in-up');
        
        // Animate quote icon
        const quoteIcon = card.querySelector('.quote-icon');
        if (quoteIcon) {
            setTimeout(() => {
                Utils.addClass(quoteIcon, 'animate-bounce');
            }, 300);
        }
    }
    
    animateStatItem(item) {
        const number = item.querySelector('.stat-number');
        if (number) {
            // Add a small delay for staggered animation
            setTimeout(() => {
                this.animateNumber(number);
            }, 200);
        }
    }
    
    animateNumber(element) {
        // Skip if already animated
        if (element.dataset.animated === 'true') return;
        element.dataset.animated = 'true';
        
        const originalText = element.textContent;
        const target = parseInt(originalText.replace(/[^\d]/g, ''));
        const suffix = originalText.replace(/[\d,]/g, '').trim();
        const duration = 2500; // Slightly longer for more dramatic effect
        const start = performance.now();
        
        // Add visual feedback during animation
        Utils.addClass(element, 'counting');
        
        // Store original text for potential reset
        element.dataset.originalText = originalText;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smoother animation
            const easedProgress = this.easing.easeOutCubic(progress);
            const current = Math.floor(easedProgress * target);
            
            // Format the number with commas and add suffix
            const formattedNumber = current.toLocaleString();
            element.textContent = suffix ? `${formattedNumber}${suffix}` : formattedNumber;
            
            // Add a subtle scale effect during animation
            const scale = 1 + (Math.sin(progress * Math.PI) * 0.1);
            element.style.transform = `scale(${scale})`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure we end with the exact target value
                const finalFormatted = target.toLocaleString();
                element.textContent = suffix ? `${finalFormatted}${suffix}` : finalFormatted;
                
                // Remove visual effects
                Utils.removeClass(element, 'counting');
                element.style.transform = 'scale(1)';
                
                // Add completion animation
                this.animateNumberComplete(element);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animateNumberComplete(element) {
        // Add a subtle completion effect
        Utils.addClass(element, 'animate-pulse');
        setTimeout(() => {
            Utils.removeClass(element, 'animate-pulse');
        }, 600);
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const parallaxOffset = scrollY * 0.5;
            hero.style.transform = `translateY(${parallaxOffset}px)`;
        }
        
        // Floating animation for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const offset = Math.sin((scrollY + index * 100) * 0.01) * 5;
                card.style.transform = `translateY(${offset}px)`;
            }
        });
    }
    
    handleResize() {
        // Re-observe elements after resize
        this.observer.disconnect();
        this.observeElements();
    }
    
    // Add hover animations
    addHoverAnimations() {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                Utils.addClass(card, 'hover-lift');
            });
            
            card.addEventListener('mouseleave', () => {
                Utils.removeClass(card, 'hover-lift');
            });
        });
        
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                Utils.addClass(button, 'hover-scale');
            });
            
            button.addEventListener('mouseleave', () => {
                Utils.removeClass(button, 'hover-scale');
            });
        });
    }
    
    // Create typing animation
    createTypingAnimation(element, text, speed = 100) {
        let index = 0;
        element.textContent = '';
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    // Create loading animation
    createLoadingAnimation(element) {
        const dots = ['', '.', '..', '...'];
        let index = 0;
        
        const animate = () => {
            element.textContent = `Loading${dots[index]}`;
            index = (index + 1) % dots.length;
            setTimeout(animate, 500);
        };
        
        animate();
    }
    
    // Reset number animations (useful for testing)
    resetNumberAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            number.dataset.animated = 'false';
            number.style.transform = 'scale(1)';
            Utils.removeClass(number, 'counting animate-pulse');
            
            // Reset to original text
            if (number.dataset.originalText) {
                number.textContent = number.dataset.originalText;
            }
        });
    }
    
    // Re-trigger number animations (useful for testing)
    retriggerNumberAnimations() {
        this.resetNumberAnimations();
        
        // Re-observe stat items
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            this.observer.unobserve(item);
            this.observer.observe(item);
        });
    }
    
    // Destroy animations
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Add hover animations after a short delay
    setTimeout(() => {
        animationController.addHoverAnimations();
    }, 1000);
    
    // Expose animation controller globally for testing
    window.AnimationController = animationController;
});
