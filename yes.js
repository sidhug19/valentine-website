// ============================================
// Valentine's Day - Celebration Page Script
// Features: Canvas fireworks, confetti, hearts
// Pure JavaScript - No external libraries
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Arrays to store particles
    let fireworks = [];
    let particles = [];
    let hearts = [];
    
    // Colors for fireworks
    const colors = [
        '#ff6b9d', '#e91e63', '#ff1744', '#f50057',
        '#d500f9', '#651fff', '#3d5afe', '#00b0ff',
        '#00e5ff', '#1de9b6', '#76ff03', '#ffea00', '#ff9100'
    ];
    
    // ============================================
    // Firework Class
    // ============================================
    class Firework {
        constructor(targetX, targetY) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 8;
            this.angle = Math.atan2(targetY - this.y, targetX - this.x);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.brightness = Math.random() * 50 + 50;
            this.hue = Math.random() * 360;
            this.trail = [];
            this.trailLength = 5;
            this.dead = false;
        }
        
        update() {
            // Store trail
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.trailLength) {
                this.trail.shift();
            }
            
            // Move firework
            this.x += this.vx;
            this.y += this.vy;
            
            // Check if reached target (or close enough)
            const dist = Math.sqrt(
                Math.pow(this.targetX - this.x, 2) + 
                Math.pow(this.targetY - this.y, 2)
            );
            
            if (dist < 10 || this.vy > 0) {
                this.dead = true;
                createExplosion(this.x, this.y, this.hue);
            }
        }
        
        draw() {
            ctx.beginPath();
            // Draw trail
            for (let i = 0; i < this.trail.length; i++) {
                const point = this.trail[i];
                const opacity = i / this.trail.length;
                ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${opacity})`;
                ctx.fillRect(point.x, point.y, 3, 3);
            }
            
            // Draw firework head
            ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
            ctx.fillRect(this.x, this.y, 4, 4);
            ctx.closePath();
        }
    }
    
    // ============================================
    // Particle Class (for explosion)
    // ============================================
    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            // Random explosion velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.friction = 0.95;
            this.gravity = 0.1;
            this.brightness = Math.random() * 50 + 50;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.dead = false;
        }
        
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            
            if (this.alpha <= 0) {
                this.dead = true;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // ============================================
    // Heart Particle Class
    // ============================================
    class HeartParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 20 + 15;
            this.speed = Math.random() * 2 + 1;
            this.sway = Math.random() * 2 - 1;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayOffset = Math.random() * Math.PI * 2;
            this.alpha = 1;
            this.dead = false;
            this.color = ['#ff6b9d', '#e91e63', '#ff1744', '#f50057'][Math.floor(Math.random() * 4)];
        }
        
        update() {
            this.y -= this.speed;
            this.x += Math.sin(this.swayOffset) * this.sway;
            this.swayOffset += this.swaySpeed;
            
            if (this.y < -50) {
                this.dead = true;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px Arial`;
            ctx.fillText('💕', this.x, this.y);
            ctx.restore();
        }
    }
    
    // ============================================
    // Create Explosion
    // ============================================
    function createExplosion(x, y, hue) {
        // Create particles
        const particleCount = 50 + Math.random() * 30;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, hue));
        }
        
        // Create some hearts in the explosion
        for (let i = 0; i < 5; i++) {
            const heart = new HeartParticle();
            heart.x = x + (Math.random() - 0.5) * 100;
            heart.y = y + (Math.random() - 0.5) * 100;
            heart.speed = (Math.random() - 0.5) * 4;
            hearts.push(heart);
        }
    }
    
    // ============================================
    // Launch Firework
    // ============================================
    function launchFirework() {
        const targetX = Math.random() * (canvas.width - 100) + 50;
        const targetY = Math.random() * (canvas.height / 2) + 50;
        fireworks.push(new Firework(targetX, targetY));
    }
    
    // ============================================
    // Animation Loop
    // ============================================
    function animate() {
        // Clear canvas with trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].dead) {
                fireworks.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].dead) {
                particles.splice(i, 1);
            }
        }
        
        // Update and draw hearts
        for (let i = hearts.length - 1; i >= 0; i--) {
            hearts[i].update();
            hearts[i].draw();
            if (hearts[i].dead) {
                hearts.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // ============================================
    // Auto-launch fireworks
    // ============================================
    function startFireworks() {
        // Launch initial burst
        for (let i = 0; i < 5; i++) {
            setTimeout(launchFirework, i * 300);
        }
        
        // Continue launching periodically
        return setInterval(() => {
            if (Math.random() > 0.3) {
                launchFirework();
            }
        }, 800);
    }
    
    // Start animation
    animate();
    let fireworkInterval = startFireworks();
    
    // ============================================
    // Button Handlers
    // ============================================
    
    // Replay button
    document.getElementById('replay-btn').addEventListener('click', function() {
        // Clear existing
        fireworks = [];
        particles = [];
        hearts = [];
        
        // Clear interval and restart
        clearInterval(fireworkInterval);
        
        // Launch big burst
        for (let i = 0; i < 10; i++) {
            setTimeout(launchFirework, i * 200);
        }
        
        fireworkInterval = startFireworks();
    });
    
    // Back button
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Click anywhere to launch extra firework
    canvas.addEventListener('click', function(e) {
        fireworks.push(new Firework(e.clientX, e.clientY));
    });
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        fireworks.push(new Firework(touch.clientX, touch.clientY));
    }, { passive: true });
});