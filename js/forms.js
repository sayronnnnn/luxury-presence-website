/**
 * Forms Module
 * Handles form validation, submission, and user interactions
 */

class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', Utils.debounce(() => this.validateField(input), 300));
            });
        });
    }
    
    setupValidation() {
        // Add validation attributes to form elements
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
        });
        
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.setAttribute('pattern', '[0-9\\s\\-\\+\\(\\)]+');
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        if (this.validateForm(form)) {
            this.submitForm(form);
        }
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required`;
        }
        
        // Email validation
        if (fieldType === 'email' && value && !Utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Phone validation
        if (fieldType === 'tel' && value && !Utils.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        // Custom validation for specific fields
        if (fieldName === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        }
        
        if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }
    
    getFieldLabel(field) {
        const label = field.closest('.form-group')?.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    showFieldError(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid && message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = 'var(--text-sm)';
            errorElement.style.marginTop = 'var(--space-1)';
            formGroup.appendChild(errorElement);
        }
        
        // Update field styling
        if (isValid) {
            Utils.removeClass(field, 'error');
        } else {
            Utils.addClass(field, 'error');
        }
    }
    
    async submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        this.setLoadingState(submitButton, true);
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateSubmission();
            
            // Show success message
            this.showSuccessMessage(form);
            form.reset();
            
        } catch (error) {
            // Show error message
            this.showErrorMessage(form, error.message);
        } finally {
            // Reset button state
            this.setLoadingState(submitButton, false, originalText);
        }
    }
    
    setLoadingState(button, isLoading, originalText = '') {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> Sending...';
            Utils.addClass(button, 'loading');
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
            Utils.removeClass(button, 'loading');
        }
    }
    
    async simulateSubmission() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() < 0.9) {
            return { success: true };
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
    
    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
        `;
        
        this.showMessage(form, message);
    }
    
    showErrorMessage(form, errorText) {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${errorText}</span>
        `;
        
        this.showMessage(form, message);
    }
    
    showMessage(form, messageElement) {
        // Remove existing messages
        const existingMessages = form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Add message styles
        messageElement.style.cssText = `
            padding: var(--space-4);
            margin: var(--space-4) 0;
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-weight: var(--font-medium);
        `;
        
        if (messageElement.classList.contains('success')) {
            messageElement.style.background = 'rgba(16, 185, 129, 0.1)';
            messageElement.style.color = 'var(--success-color)';
            messageElement.style.border = '1px solid rgba(16, 185, 129, 0.2)';
        } else {
            messageElement.style.background = 'rgba(239, 68, 68, 0.1)';
            messageElement.style.color = 'var(--error-color)';
            messageElement.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        }
        
        // Insert message at the top of the form
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto-remove success messages after 5 seconds
        if (messageElement.classList.contains('success')) {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }
}

// Add CSS for form validation
const formStyles = `
    .field-error {
        color: var(--error-color);
        font-size: var(--text-sm);
        margin-top: var(--space-1);
        display: block;
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .btn.loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
`;

// Inject form styles
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});
