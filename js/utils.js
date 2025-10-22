/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

// DOM Utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Throttle function to limit function execution frequency
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Debounce function to delay function execution
const debounce = (func, wait, immediate) => {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Check if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Check if element is partially in viewport
const isPartiallyInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
};

// Smooth scroll to element
const smoothScrollTo = (element, offset = 0) => {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

// Get element offset from top of document
const getOffsetTop = (element) => {
    let offsetTop = 0;
    do {
        if (!isNaN(element.offsetTop)) {
            offsetTop += element.offsetTop;
        }
    } while (element = element.offsetParent);
    return offsetTop;
};

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get viewport dimensions
const getViewportDimensions = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
};

// Check if device is mobile
const isMobile = () => {
    return window.innerWidth <= 768;
};

// Check if device is tablet
const isTablet = () => {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Check if device is desktop
const isDesktop = () => {
    return window.innerWidth > 1024;
};

// Generate random number between min and max
const random = (min, max) => {
    return Math.random() * (max - min) + min;
};

// Generate random integer between min and max
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Clamp number between min and max
const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
};

// Linear interpolation
const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
};

// Easing functions
const easing = {
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

// Format number with commas
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Format date
const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

// Validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number
const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Sanitize HTML
const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// Create element with attributes
const createElement = (tag, attributes = {}, textContent = '') => {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
};

// Add event listener with automatic cleanup
const addEventListenerWithCleanup = (element, event, handler, options = {}) => {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
};

// Get CSS custom property value
const getCSSVariable = (property) => {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
};

// Set CSS custom property value
const setCSSVariable = (property, value) => {
    document.documentElement.style.setProperty(property, value);
};

// Get element's computed styles
const getComputedStyles = (element) => {
    return window.getComputedStyle(element);
};

// Check if element has class
const hasClass = (element, className) => {
    return element.classList.contains(className);
};

// Add class to element
const addClass = (element, className) => {
    element.classList.add(className);
};

// Remove class from element
const removeClass = (element, className) => {
    element.classList.remove(className);
};

// Toggle class on element
const toggleClass = (element, className) => {
    element.classList.toggle(className);
};

// Add multiple classes to element
const addClasses = (element, classNames) => {
    element.classList.add(...classNames);
};

// Remove multiple classes from element
const removeClasses = (element, classNames) => {
    element.classList.remove(...classNames);
};

// Wait for element to be in DOM
const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
};

// Wait for multiple elements
const waitForElements = (selectors, timeout = 5000) => {
    return Promise.all(selectors.map(selector => waitForElement(selector, timeout)));
};

// Load script dynamically
const loadScript = (src, async = true) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Load CSS dynamically
const loadCSS = (href) => {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
};

// Copy text to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
};

// Get query parameters
const getQueryParams = () => {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
};

// Set query parameter
const setQueryParam = (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
};

// Remove query parameter
const removeQueryParam = (key) => {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
};

// Local storage utilities
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (err) {
            console.error('Error getting from localStorage:', err);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error('Error setting to localStorage:', err);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (err) {
            console.error('Error removing from localStorage:', err);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (err) {
            console.error('Error clearing localStorage:', err);
            return false;
        }
    }
};

// Session storage utilities
const sessionStorage = {
    get: (key) => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (err) {
            console.error('Error getting from sessionStorage:', err);
            return null;
        }
    },
    set: (key, value) => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error('Error setting to sessionStorage:', err);
            return false;
        }
    },
    remove: (key) => {
        try {
            window.sessionStorage.removeItem(key);
            return true;
        } catch (err) {
            console.error('Error removing from sessionStorage:', err);
            return false;
        }
    },
    clear: () => {
        try {
            window.sessionStorage.clear();
            return true;
        } catch (err) {
            console.error('Error clearing sessionStorage:', err);
            return false;
        }
    }
};

// Performance utilities
const performance = {
    mark: (name) => {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
        }
    },
    measure: (name, startMark, endMark) => {
        if (window.performance && window.performance.measure) {
            window.performance.measure(name, startMark, endMark);
        }
    },
    getEntriesByName: (name) => {
        if (window.performance && window.performance.getEntriesByName) {
            return window.performance.getEntriesByName(name);
        }
        return [];
    }
};

// Image loading handler
const handleImageLoad = (img) => {
    img.classList.add('loaded');
    img.classList.remove('image-loading');
};

// Image error handler
const handleImageError = (img) => {
    console.warn('Image failed to load:', img.src);
    img.classList.add('loaded');
    img.classList.remove('image-loading');
    
    // Add a subtle error indicator
    if (!img.src.includes('placeholder')) {
        img.style.border = '2px dashed var(--accent-color)';
        img.style.opacity = '0.7';
    }
};

// Initialize image loading
const initImageLoading = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.classList.add('image-loading');
        
        img.addEventListener('load', () => {
            handleImageLoad(img);
        });
        
        img.addEventListener('error', () => {
            handleImageError(img);
        });
    });
};

// Export utilities for use in other modules
window.Utils = {
    $,
    $$,
    throttle,
    debounce,
    isInViewport,
    isPartiallyInViewport,
    smoothScrollTo,
    getOffsetTop,
    prefersReducedMotion,
    getViewportDimensions,
    isMobile,
    isTablet,
    isDesktop,
    random,
    randomInt,
    clamp,
    lerp,
    easing,
    formatNumber,
    formatCurrency,
    formatDate,
    isValidEmail,
    isValidPhone,
    sanitizeHTML,
    createElement,
    addEventListenerWithCleanup,
    getCSSVariable,
    setCSSVariable,
    getComputedStyles,
    hasClass,
    addClass,
    removeClass,
    toggleClass,
    addClasses,
    removeClasses,
    waitForElement,
    waitForElements,
    loadScript,
    loadCSS,
    copyToClipboard,
    getQueryParams,
    setQueryParam,
    removeQueryParam,
    storage,
    sessionStorage,
    performance,
    handleImageLoad,
    handleImageError,
    initImageLoading
};
