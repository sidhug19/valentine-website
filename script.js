// ============================================
// Valentine's Day - Main Page Script
// Features: Floating hearts, dodging "No" button
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Create floating hearts background
    createFloatingHearts();
    
    // Setup the dodging No button
    setupDodgingButton();
    
    // Setup Yes button click handler
    setupYesButton();
});

// ============================================
// Floating Hearts Background
// ============================================
function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const heartSymbols = ['💕', '💖', '💗', '💓', '💝', '♥️', '🩷'];
    const numberOfHearts = 15;
    
    for (let i = 0; i < numberOfHearts; i++) {
        createHeart(container, heartSymbols, i);
    }
}

function createHeart(container, symbols, index) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Random positioning and timing
    const leftPosition = Math.random() * 100;
    const animationDuration = 8 + Math.random() * 10; // 8-18 seconds
    const animationDelay = Math.random() * 5;
    const fontSize = 15 + Math.random() * 25; // 15-40px
    
    heart.style.left = `${leftPosition}%`;
    heart.style.animationDuration = `${animationDuration}s`;
    heart.style.animationDelay = `${animationDelay}s`;
    heart.style.fontSize = `${fontSize}px`;
    
    container.appendChild(heart);
}

// ============================================
// Dodging "No" Button Logic
// ============================================
function setupDodgingButton() {
    const noBtn = document.getElementById('no-btn');
    const proximityThreshold = 120; // Distance in pixels to trigger dodge
    
    // Mouse proximity detection for desktop
    document.addEventListener('mousemove', function(e) {
        dodgeButton(e.clientX, e.clientY);
    });
    
    // Touch detection for mobile
    document.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        dodgeButton(touch.clientX, touch.clientY);
    }, { passive: true });
    
    // Also dodge on touch move (finger dragging)
    document.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        dodgeButton(touch.clientX, touch.clientY);
    }, { passive: true });
    
    // Handle button click (in case they manage to tap it)
    noBtn.addEventListener('click', function(e) {
        e.preventDefault();
        moveButtonToRandomPosition();
    });
    
    function dodgeButton(mouseX, mouseY) {
        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        // Calculate distance between mouse and button center
        const distance = Math.sqrt(
            Math.pow(mouseX - btnCenterX, 2) + 
            Math.pow(mouseY - btnCenterY, 2)
        );
        
        // If mouse is too close, move the button
        if (distance < proximityThreshold) {
            moveButtonToRandomPosition();
        }
    }
    
    function moveButtonToRandomPosition() {
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        // Calculate safe area (keeping button fully on screen)
        // Add padding to keep away from edges
        const padding = 20;
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;
        const minX = padding;
        const minY = padding;
        
        // Generate random position within safe bounds
        const newX = Math.random() * (maxX - minX) + minX;
        const newY = Math.random() * (maxY - minY) + minY;
        
        // Apply new position with smooth animation
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
        noBtn.style.transform = 'scale(0.9)';
        
        // Add a little rotation for fun
        const rotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees
        noBtn.style.transform = `scale(0.9) rotate(${rotation}deg)`;
        
        // Reset scale after animation
        setTimeout(() => {
            noBtn.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }
}

// ============================================
// Yes Button Handler
// ============================================
function setupYesButton() {
    const yesBtn = document.getElementById('yes-btn');
    
    yesBtn.addEventListener('click', function() {
        // Add a little celebration before redirecting
        yesBtn.style.transform = 'scale(1.3)';
        yesBtn.textContent = 'Yay! 💖';
        
        setTimeout(() => {
            window.location.href = 'yes.html';
        }, 400);
    });
}