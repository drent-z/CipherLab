document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix Rain Background
    initMatrixRain();
    
    // Initialize particle network background
    initParticleNetwork();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar effects
    initNavbarEffects();
    
    // Initialize typing effects
    initTypingEffects();
    
    // Binary decoration elements
    createBinaryDecorations();
    
    // Auto fade out flash messages after 3 seconds
    setTimeout(() => {
        const flashMessages = document.querySelectorAll('.alert');
        flashMessages.forEach((msg) => {
            msg.classList.add('animate__fadeOutUp');
            setTimeout(() => {
                msg.remove();
            }, 1000); // Ensure the fade-out animation completes before removing
        });
    }, 3000);

    // Close button functionality
    document.querySelectorAll('.alert .close').forEach((button) => {
        button.addEventListener('click', (event) => {
            const alert = event.target.closest('.alert');
            alert.classList.add('animate__fadeOutUp');
            setTimeout(() => {
                alert.remove();
            }, 1000); // Ensure the fade-out animation completes before removing
        });
    });

    // Navbar toggle functionality
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
            
            // Create overlay when menu is open
            if (navbarCollapse.classList.contains('show')) {
                const overlay = document.createElement('div');
                overlay.classList.add('navbar-overlay');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                overlay.style.zIndex = '1000';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', () => {
                    navbarCollapse.classList.remove('show');
                    overlay.remove();
                });
            } else {
                const existingOverlay = document.querySelector('.navbar-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
            }
        });
    }
    
    // Initialize interactive cipher demos if they exist
    initCipherDemos();
});

// Matrix rain effect
function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-background');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00FF41';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Particle network background
function initParticleNetwork() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-network');
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.overflow = 'hidden';
    particleContainer.style.zIndex = '-1';
    
    heroSection.appendChild(particleContainer);
    
    const particleCount = 40;
    const particleColors = ['#00FF41', '#FF00FF', '#00FFFF'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 5 + 1;
        
        particle.style.position = 'absolute';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
        particle.style.opacity = '0.7';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.backgroundColor}`;
        
        // Store particle data for animation - BETTER SPEED
        particle.dataset.vx = (Math.random() - 0.5) * 1.2; // x velocity - balanced speed
        particle.dataset.vy = (Math.random() - 0.5) * 1.2; // y velocity - balanced speed
        
        particleContainer.appendChild(particle);
    }
    
    // Animate particles
    function animateParticles() {
        const particles = particleContainer.querySelectorAll('div');
        const containerWidth = particleContainer.offsetWidth;
        const containerHeight = particleContainer.offsetHeight;
        
        particles.forEach(particle => {
            // Get current position
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            
            // Convert percentage to pixels
            x = (x / 100) * containerWidth;
            y = (y / 100) * containerHeight;
            
            // Update position
            x += parseFloat(particle.dataset.vx);
            y += parseFloat(particle.dataset.vy);
            
            // Boundary check and bounce
            if (x <= 0 || x >= containerWidth) {
                particle.dataset.vx = -parseFloat(particle.dataset.vx);
                x += parseFloat(particle.dataset.vx) * 2;
            }
            
            if (y <= 0 || y >= containerHeight) {
                particle.dataset.vy = -parseFloat(particle.dataset.vy);
                y += parseFloat(particle.dataset.vy) * 2;
            }
            
            // Convert back to percentage
            particle.style.left = (x / containerWidth * 100) + '%';
            particle.style.top = (y / containerHeight * 100) + '%';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Scroll animations - UPDATED WITH FIX
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkScroll() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Add fade-in class to elements
    document.querySelectorAll('.feature-box, .section-title, .card').forEach(element => {
        if (!element.classList.contains('fade-in')) {
            element.classList.add('fade-in');
        }
    });
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
}

// Navbar effects
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Terminal typing effects
function initTypingEffects() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let i = 0;
        const speed = 50; // typing speed in ms
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start typing with a delay
        setTimeout(typeWriter, 1000);
    });
}

// Create binary background decorations
function createBinaryDecorations() {
    const binaryCount = 5;
    
    for (let i = 0; i < binaryCount; i++) {
        const binary = document.createElement('div');
        binary.classList.add('binary-decoration');
        
        // Generate binary text
        let binaryText = '';
        for (let j = 0; j < 100; j++) {
            binaryText += Math.round(Math.random());
        }
        
        binary.textContent = binaryText;
        binary.style.position = 'absolute';
        binary.style.left = Math.random() * 100 + '%';
        binary.style.top = Math.random() * 100 + '%';
        binary.style.transform = `rotate(${Math.random() * 90 - 45}deg)`;
        
        document.body.appendChild(binary);
    }
}

// Interactive cipher demos
function initCipherDemos() {
    // Caesar Cipher Demo
    const caesarInput = document.getElementById('caesar-input');
    const caesarOutput = document.getElementById('caesar-output');
    const caesarShift = document.getElementById('caesar-shift');
    
    if (caesarInput && caesarOutput && caesarShift) {
        function updateCaesarCipher() {
            const text = caesarInput.value;
            const shift = parseInt(caesarShift.value);
            
            let result = '';
            
            for (let i = 0; i < text.length; i++) {
                let char = text.charAt(i);
                
                if (char.match(/[a-z]/i)) {
                    const code = text.charCodeAt(i);
                    
                    // Uppercase letters
                    if (code >= 65 && code <= 90) {
                        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
                    }
                    // Lowercase letters
                    else if (code >= 97 && code <= 122) {
                        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
                    }
                }
                
                result += char;
            }
            
            caesarOutput.textContent = result;
        }
        
        caesarInput.addEventListener('input', updateCaesarCipher);
        caesarShift.addEventListener('input', updateCaesarCipher);
    }
    
    // Vigenère Cipher Demo
    const vigenereInput = document.getElementById('vigenere-input');
    const vigenereOutput = document.getElementById('vigenere-output');
    const vigenereKey = document.getElementById('vigenere-key');
    
    if (vigenereInput && vigenereOutput && vigenereKey) {
        function updateVigenereCipher() {
            const text = vigenereInput.value.toUpperCase();
            let key = vigenereKey.value.toUpperCase().replace(/[^A-Z]/g, '');
            
            if (key.length === 0) {
                vigenereOutput.textContent = text;
                return;
            }
            
            let result = '';
            let keyIndex = 0;
            
            for (let i = 0; i < text.length; i++) {
                const char = text.charAt(i);
                
                if (char.match(/[A-Z]/)) {
                    // Get the key character and its value (0-25)
                    const keyChar = key.charAt(keyIndex % key.length);
                    const keyValue = keyChar.charCodeAt(0) - 65;
                    
                    // Encrypt the character
                    const charCode = char.charCodeAt(0) - 65;
                    const encryptedChar = String.fromCharCode(((charCode + keyValue) % 26) + 65);
                    
                    result += encryptedChar;
                    keyIndex++;
                } else {
                    result += char;
                }
            }
            
            vigenereOutput.textContent = result;
        }
        
        vigenereInput.addEventListener('input', updateVigenereCipher);
        vigenereKey.addEventListener('input', updateVigenereCipher);
    }
}