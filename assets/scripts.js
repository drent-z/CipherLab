document.addEventListener('DOMContentLoaded', () => {
    // Global variables for performance tracking
    let lastScrollY = window.scrollY;
    let scrollTicking = false;
    let resizeTicking = false;
    let animationActive = true; // Flag to check if animations should run
    let fpsThrottle = 30; // Limit FPS for animations (higher number = less frequent updates)
    let fpsCounter = 0;
    
    // Fix for smooth scrolling - prevent scroll lock
    fixScrollBehavior();
    
    // Initialize Matrix Rain Background - OPTIMIZED
    if (document.querySelector('.matrix-background')) {
        initMatrixRain();
    }
    
    // Initialize particle network background - OPTIMIZED
    if (document.querySelector('.hero')) {
        initParticleNetwork();
    }
    
    // Initialize scroll animations - only when needed
    if (document.querySelectorAll('.fade-in').length > 0) {
        initScrollAnimations();
    }
    
    // Initialize navbar effects - OPTIMIZED
    if (document.querySelector('.navbar')) {
        initNavbarEffects();
    }
    
    // Initialize typing effects - only when needed
    if (document.querySelectorAll('.typing-text').length > 0) {
        initTypingEffects();
    }
    
    // Binary decoration elements - REDUCED
    if (!isMobileDevice()) {
        createBinaryDecorations();
    }
    
    // Auto fade out flash messages after 3 seconds
    const flashMessages = document.querySelectorAll('.alert');
    if (flashMessages.length > 0) {
        setTimeout(() => {
            flashMessages.forEach((msg) => {
                msg.classList.add('animate__fadeOutUp');
                setTimeout(() => {
                    msg.remove();
                }, 1000);
            });
        }, 3000);
    }

    // Close button functionality
    document.querySelectorAll('.alert .close').forEach((button) => {
        button.addEventListener('click', (event) => {
            const alert = event.target.closest('.alert');
            alert.classList.add('animate__fadeOutUp');
            setTimeout(() => {
                alert.remove();
            }, 1000);
        });
    });

    // Navbar toggle functionality - OPTIMIZED
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
            
            // Create overlay when menu is open
            if (navbarCollapse.classList.contains('show')) {
                const overlay = document.createElement('div');
                overlay.classList.add('navbar-overlay');
                Object.assign(overlay.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: '1000'
                });
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
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Disable animations if user prefers reduced motion
    if (prefersReducedMotion) {
        animationActive = false;
    }
    
    // Detect if the page is not visible and pause heavy animations
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            animationActive = false;
        } else {
            // Only restore animations if user doesn't prefer reduced motion
            animationActive = !prefersReducedMotion;
        }
    });
    
    // Initialize interactive cipher demos if they exist - OPTIMIZED
    if (document.getElementById('caesar-input') || document.getElementById('vigenere-input')) {
        initCipherDemos();
    }
    
    // For mobile devices, further reduce animations
    if (isMobileDevice()) {
        // Set higher throttle value to reduce animation updates
        fpsThrottle = 45; // Less frequent updates on mobile
        
        // Remove particle effects entirely on mobile
        const particleContainer = document.querySelector('.particle-network');
        if (particleContainer) {
            particleContainer.remove();
        }
    }
});

// Helper function to detect mobile
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Matrix rain effect - HIGHLY OPTIMIZED
function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-background');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    const characters = '01';
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
    }
    
    // Reduce number of rendered elements for mobile
    const skipFactor = isMobileDevice() ? 2 : 1; // Only render half the columns on mobile
    
    // Pre-calculate character placements
    const charPositions = [];
    for (let i = 0; i < columns; i++) {
        charPositions[i] = i * fontSize;
    }
    
    let lastTime = 0;
    const drawInterval = 35; // ms between draws
    
    function draw(currentTime) {
        // Only render if enough time has passed
        if (currentTime - lastTime < drawInterval) {
            requestAnimationFrame(draw);
            return;
        }
        
        lastTime = currentTime;
        
        // Only continue if animation is active
        if (!document.hidden) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00FF41';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < columns; i += skipFactor) {
                // Skip rendering every other column
                if (i % skipFactor !== 0 && isMobileDevice()) continue;
                
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                const x = charPositions[i];
                const y = drops[i] * fontSize;
                
                if (y >= 0 && y < canvas.height) { // Only draw if in canvas bounds
                    ctx.fillText(text, x, y);
                }
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    // Start the animation
    requestAnimationFrame(draw);
    
    // Optimize resize handling with throttling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Clear the timeout if it exists
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        // Set a new timeout
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            
            // Update columns based on new width
            const newColumns = Math.floor(canvas.width / fontSize);
            
            // Add new columns if needed
            if (newColumns > columns) {
                for (let i = columns; i < newColumns; i++) {
                    drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
                    charPositions[i] = i * fontSize;
                }
            }
        }, 250); // 250ms debounce
    }, { passive: true });
}

// Particle network background - OPTIMIZED
function initParticleNetwork() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    // Don't initialize this on mobile devices
    if (isMobileDevice()) {
        return;
    }
    
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-network');
    Object.assign(particleContainer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: '-1'
    });
    
    heroSection.appendChild(particleContainer);
    
    // Reduce particle count dramatically for better performance
    const particleCount = 15; // Reduced from 40
    const particleColors = ['#00FF41', '#00FFFF'];
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1; // Smaller size range
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: size + 'px',
            height: size + 'px',
            borderRadius: '50%',
            backgroundColor: particleColors[Math.floor(Math.random() * particleColors.length)],
            opacity: '0.5',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            boxShadow: `0 0 ${size}px ${particle.style.backgroundColor}`
        });
        
        // Store particle data for animation
        const vx = (Math.random() - 0.5) * 0.2; // Slower velocity
        const vy = (Math.random() - 0.5) * 0.2;
        
        particles.push({
            element: particle,
            vx, 
            vy,
            x: parseFloat(particle.style.left) / 100,
            y: parseFloat(particle.style.top) / 100
        });
        
        particleContainer.appendChild(particle);
    }
    
    // Cache container dimensions to avoid layout thrashing
    let containerWidth = particleContainer.offsetWidth;
    let containerHeight = particleContainer.offsetHeight;
    
    // Update dimensions on resize (with debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            containerWidth = particleContainer.offsetWidth;
            containerHeight = particleContainer.offsetHeight;
        }, 250);
    }, { passive: true });
    
    // Track animation frame for cancellation
    let animationFrame;
    
    // Variable to throttle animation frames
    let frameCounter = 0;
    
    // Animate particles with throttling for performance
    function animateParticles() {
        // Skip frames based on throttle setting
        frameCounter++;
        if (frameCounter % 3 !== 0) { // Only process every 3rd frame
            animationFrame = requestAnimationFrame(animateParticles);
            return;
        }
        
        // Only animate if animation is active and page is visible
        if (!document.hidden) {
            particles.forEach(particle => {
                // Get current position
                let x = particle.x;
                let y = particle.y;
                
                // Update position
                x += particle.vx;
                y += particle.vy;
                
                // Boundary check and bounce
                if (x <= 0 || x >= 1) {
                    particle.vx = -particle.vx;
                    x += particle.vx * 2;
                }
                
                if (y <= 0 || y >= 1) {
                    particle.vy = -particle.vy;
                    y += particle.vy * 2;
                }
                
                // Update stored position
                particle.x = x;
                particle.y = y;
                
                // Only update DOM when animation is active and visible
                particle.element.style.left = (x * 100) + '%';
                particle.element.style.top = (y * 100) + '%';
            });
        }
        
        // Continue animation
        animationFrame = requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animationFrame = requestAnimationFrame(animateParticles);
    
    // Cleanup function
    function cleanup() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    }
    
    // Cancel animation when page becomes invisible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanup();
        } else {
            // Restart animation when visible again
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(animateParticles);
            }
        }
    });
}

// Scroll animations - OPTIMIZED WITH THROTTLING
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Early exit if no elements to animate
    if (fadeElements.length === 0) return;
    
    // Use Intersection Observer instead of scroll events when available
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback to optimized scroll handler for older browsers
        let scrollTimeout;
        
        function checkScroll() {
            // Only run if we're not already processing a scroll event
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                const viewportHeight = window.innerHeight;
                
                fadeElements.forEach(element => {
                    if (!element.classList.contains('visible')) {
                        const elementTop = element.getBoundingClientRect().top;
                        const elementVisible = 150;
                        
                        if (elementTop < viewportHeight - elementVisible) {
                            element.classList.add('visible');
                        }
                    }
                });
                
                scrollTimeout = null;
            }, 100); // Only check every 100ms during scroll
        }
        
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll(); // Check on initial load
    }
}

// Navbar effects - OPTIMIZED
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    // Store the last known scroll position
    let lastScrollTop = 0;
    let scrollTimeoutId = null;
    
    // Throttled scroll handler
    function handleScroll() {
        if (scrollTimeoutId) return;
        
        scrollTimeoutId = setTimeout(() => {
            const scrollTop = window.scrollY;
            
            // Only update class if we crossed the threshold
            if ((lastScrollTop <= 50 && scrollTop > 50) || 
                (lastScrollTop > 50 && scrollTop <= 50)) {
                
                if (scrollTop > 50) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
            scrollTimeoutId = null;
        }, 100); // Process every 100ms at most
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
}

// Terminal typing effects - OPTIMIZED
function initTypingEffects() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    if (typingElements.length === 0) return;
    
    // Don't animate if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingElements.forEach(element => {
            // Just show the text immediately without animation
            const text = element.getAttribute('data-text') || '';
            element.textContent = text;
            element.style.width = 'auto';
            element.style.borderRight = 'none';
        });
        return;
    }
    
    // Stagger the animations to avoid multiple animations running simultaneously
    typingElements.forEach((element, index) => {
        const text = element.getAttribute('data-text') || element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let i = 0;
        const speed = 70; // Slightly slower typing for better performance
        
        // Delay start based on element index
        setTimeout(() => {
            function typeWriter() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed + Math.random() * 40); // Add randomness to feel more natural
                } else {
                    // Remove animation style once complete
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }
            
            typeWriter();
        }, index * 500); // Stagger by 500ms per element
    });
}

// Create binary background decorations - SIMPLIFIED
function createBinaryDecorations() {
    // Use fewer binary decorations
    const binaryCount = 3; // Reduced from 5
    
    // Don't add decorations on mobile
    if (isMobileDevice()) return;
    
    // Create decorations with a documentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < binaryCount; i++) {
        const binary = document.createElement('div');
        binary.classList.add('binary-decoration');
        
        // Generate shorter binary text
        let binaryText = '';
        for (let j = 0; j < 50; j++) { // Reduced length
            binaryText += Math.round(Math.random());
        }
        
        binary.textContent = binaryText;
        Object.assign(binary.style, {
            position: 'absolute',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            transform: `rotate(${Math.random() * 90 - 45}deg)`,
            opacity: '0.1' // Lower opacity
        });
        
        fragment.appendChild(binary);
    }
    
    // Add all decorations at once
    document.body.appendChild(fragment);
}

// Interactive cipher demos - OPTIMIZED
function initCipherDemos() {
    // Cache DOM lookups
    const caesarInput = document.getElementById('caesar-input');
    const caesarOutput = document.getElementById('caesar-output');
    const caesarShift = document.getElementById('caesar-shift');
    
    let caesarDebounceTimer;
    
    // Caesar Cipher functions
    if (caesarInput && caesarOutput && caesarShift) {
        function updateCaesarCipher() {
            // Clear the previous timer
            clearTimeout(caesarDebounceTimer);
            
            // Set a new timer
            caesarDebounceTimer = setTimeout(() => {
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
            }, 300); // 300ms debounce
        }
        
        caesarInput.addEventListener('input', updateCaesarCipher);
        caesarShift.addEventListener('input', updateCaesarCipher);
    }
    
    // Vigenère Cipher Demo - OPTIMIZED
    const vigenereInput = document.getElementById('vigenere-input');
    const vigenereOutput = document.getElementById('vigenere-output');
    const vigenereKey = document.getElementById('vigenere-key');
    
    let vigenereDebounceTimer;
    
    if (vigenereInput && vigenereOutput && vigenereKey) {
        function updateVigenereCipher() {
            // Clear the previous timer
            clearTimeout(vigenereDebounceTimer);
            
            // Set a new timer
            vigenereDebounceTimer = setTimeout(() => {
                const text = vigenereInput.value.toUpperCase();
                let key = vigenereKey.value.toUpperCase().replace(/[^A-Z]/g, '');
                
                if (key.length === 0) {
                    vigenereOutput.textContent = text;
                    return;
                }
                
                let result = '';
                let keyIndex = 0;
                
                // Cache key array for better performance
                const keyChars = key.split('');
                const keyLength = keyChars.length;
                
                for (let i = 0; i < text.length; i++) {
                    const char = text.charAt(i);
                    
                    if (char.match(/[A-Z]/)) {
                        // Get the key character and its value (0-25)
                        const keyChar = keyChars[keyIndex % keyLength];
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
            }, 300); // 300ms debounce
        }
        
        vigenereInput.addEventListener('input', updateVigenereCipher);
        vigenereKey.addEventListener('input', updateVigenereCipher);
    }
}

// Function to fix scroll behavior issues
function fixScrollBehavior() {
    // Passive event listener to prevent scroll jank
    let isScrolling;
    
    window.addEventListener('scroll', function() {
        // Clear the timeout if scrolling continues
        window.clearTimeout(isScrolling);
        
        // Set a timeout to detect when scrolling stops
        isScrolling = setTimeout(function() {
            // Fix any stuck scrolls by resetting the scroll position slightly
            if (window.scrollY > 0) {
                // Small adjustment to "unstick" any locked scrolling
                window.scrollBy(0, -1);
                window.scrollBy(0, 1);
            }
        }, 100);
    }, { passive: true });
    
    // Prevent scroll lock by checking for scroll position changes
    let lastScrollPosition = window.scrollY;
    let scrollCheckInterval;
    
    function startScrollCheck() {
        if (!scrollCheckInterval) {
            scrollCheckInterval = setInterval(() => {
                const currentScroll = window.scrollY;
                // If scroll position is same for several checks, it might be stuck
                if (Math.abs(currentScroll - lastScrollPosition) < 1 && 
                    document.body.style.overflow !== 'hidden') {
                    // Small adjustment to "unstick" any locked scrolling
                    window.scrollBy(0, -1);
                    window.scrollBy(0, 1);
                }
                lastScrollPosition = currentScroll;
            }, 2000); // Check every 2 seconds
        }
    }
    
    // Start the check on user interaction
    window.addEventListener('scroll', startScrollCheck, { passive: true, once: true });
}