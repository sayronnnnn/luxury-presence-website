/**
 * Particles Module
 * Creates animated particle effects for the hero section
 */

class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.createCanvas();
        this.createParticles();
        this.start();
        this.bindEvents();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.update();
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
    }
    
    bindEvents() {
        window.addEventListener('resize', Utils.debounce(() => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        }, 250));
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.reset();
    }
    
    reset() {
        this.x = Utils.random(0, this.canvasWidth);
        this.y = Utils.random(0, this.canvasHeight);
        this.vx = Utils.random(-0.5, 0.5);
        this.vy = Utils.random(-0.5, 0.5);
        this.size = Utils.random(1, 3);
        this.opacity = Utils.random(0.1, 0.6);
        this.life = 1;
        this.decay = Utils.random(0.001, 0.005);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        
        // Wrap around edges
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.x > this.canvasWidth) this.x = 0;
        if (this.y < 0) this.y = this.canvasHeight;
        if (this.y > this.canvasHeight) this.y = 0;
        
        // Reset if life is over
        if (this.life <= 0) {
            this.reset();
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (Utils.prefersReducedMotion()) return;
    
    new ParticleSystem('particles');
});
