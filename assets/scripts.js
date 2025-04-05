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
    
    // FORCE INITIALIZE Matrix Rain Background
    initMatrixRain();
    
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

// Matrix rain effect - FIXED AND SIMPLIFIED
function initMatrixRain() {
    // Remove any existing canvas
    const existingCanvas = document.querySelector('.matrix-background');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-background');
    
    // Set explicit styles to ensure visibility
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-3',
        pointerEvents: 'none',
        opacity: '0.3'
    });
    
    // Add to body as first child for z-index stacking
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    // Matrix settings
    const font_size = 14;
    const characters = "01";
    const columns = Math.ceil(canvas.width / font_size) + 1;
    
    // Drop positions start slightly above the top
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -10) * font_size;
    }
    
    // Main drawing function
    function draw() {
        // Translucent black to create fade effect
        ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Green text
        ctx.fillStyle = "#00FF41";
        ctx.font = font_size + "px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // x = i * font_size, y = drop position
            const y = drops[i];
            const x = i * font_size;
            
            // Draw the character
            ctx.fillText(text, x, y);
            
            // Increment y coordinate
            drops[i] += font_size;
            
            // Random reset to top with randomized delay
            if (drops[i] > canvas.height && Math.random() > 0.98) {
                drops[i] = Math.floor(Math.random() * -10) * font_size;
            }
        }
    }
    
    // Run animation at 15fps (more distinctive matrix effect)
    const matrixInterval = setInterval(draw, 66);
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(matrixInterval);
        } else {
            setInterval(draw, 66);
        }
    });
}

    // Particle network background - COMPLETELY REWRITTEN WITH CSS ANIMATION
function initParticleNetwork() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    // Remove any existing particles
    const existingContainer = document.querySelector('.particle-network');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-network');
    Object.assign(particleContainer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'visible',
        zIndex: '-1'
    });
    
    heroSection.appendChild(particleContainer);
    
    // Use CSS animations instead of JS for better performance
    const particleCount = 15;
    const particleColors = ['#00FF41', '#00FFFF', '#00CC33'];
    
    // Add CSS for animations to ensure they work
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        @keyframes float-particle {
            0% { transform: translate(0, 0); }
            25% { transform: translate(20px, 15px); }
            50% { transform: translate(0, 30px); }
            75% { transform: translate(-20px, 15px); }
            100% { transform: translate(0, 0); }
        }
        
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.5;
            animation: float-particle 15s infinite ease-in-out;
            box-shadow: 0 0 5px currentColor;
        }
    `;
    document.head.appendChild(styleEl);
    
    // Create particles with different animation delays
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2; // Larger for visibility
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        
        particle.classList.add('particle');
        
        // Position randomly
        const left = Math.random() * 95 + 2.5; // Avoid edges
        const top = Math.random() * 95 + 2.5;
        
        // Unique animation delay and duration for each particle
        const delay = Math.random() * -15; // Negative to start at different points
        const duration = 15 + Math.random() * 10; // Between 15-25s
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            color: color,
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
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
    
    // No JS animation function needed - using CSS animations instead
    
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

// Completely overhauled scroll behavior fix
function fixScrollBehavior() {
    // 1. Make scrolling more reliable by disabling any fancy scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // 2. Disable any scroll events that might be interfering
    const scrollEvents = ['wheel', 'mousewheel', 'DOMMouseScroll'];
    
    scrollEvents.forEach(eventName => {
        window.addEventListener(eventName, function(e) {
            // Allow default browser scrolling (passive: true)
        }, { passive: true }); 
    });
    
    // 3. Fix for scroll restoration issues
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // 4. Add a single, efficient scroll handler to detect and fix any stuck scrolling
    let lastKnownScrollY = window.scrollY;
    let scrollTimeout = null;
    let stuckScrollCheckInterval = null;
    let stuckScrollCounter = 0;
    
    // Clear any stuck scroll checking intervals when the user scrolls
    window.addEventListener('scroll', function() {
        if (stuckScrollCheckInterval) {
            clearInterval(stuckScrollCheckInterval);
            stuckScrollCheckInterval = null;
            stuckScrollCounter = 0;
        }
        
        lastKnownScrollY = window.scrollY;
        
        // Set up a new check after scrolling appears to stop
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Start monitoring for stuck scrolls
            if (!stuckScrollCheckInterval) {
                stuckScrollCheckInterval = setInterval(function() {
                    // If we detect no scroll change for several intervals, perform unstick operation
                    if (Math.abs(window.scrollY - lastKnownScrollY) < 1) {
                        stuckScrollCounter++;
                        
                        // After 3 checks with no movement, try to unstick
                        if (stuckScrollCounter >= 3) {
                            // Simple force redraw
                            document.body.style.overflow = 'hidden';
                            setTimeout(function() {
                                document.body.style.overflow = '';
                            }, 10);
                            
                            clearInterval(stuckScrollCheckInterval);
                            stuckScrollCheckInterval = null;
                            stuckScrollCounter = 0;
                        }
                    } else {
                        // Reset counter if scroll position changes naturally
                        lastKnownScrollY = window.scrollY;
                        stuckScrollCounter = 0;
                    }
                }, 1000); // Check every second
            }
        }, 200);
    }, { passive: true });
    
    // 5. Monitor and fix any CSS-related scroll issues
    document.addEventListener('DOMContentLoaded', function() {
        // Force document to be scrollable even with little content
        const forceScrollableStyle = document.createElement('style');
        forceScrollableStyle.innerHTML = `
            html, body {
                min-height: 101vh; /* Force scrollbar to appear */
                overscroll-behavior: none; /* Prevent scroll bounce */
            }
            
            *::-webkit-scrollbar {
                width: 12px;
            }
            
            *::-webkit-scrollbar-track {
                background: rgba(10, 10, 10, 0.2);
            }
            
            *::-webkit-scrollbar-thumb {
                background-color: rgba(0, 255, 65, 0.3);
                border-radius: 6px;
                border: 3px solid #0a0a0a;
            }
        `;
        document.head.appendChild(forceScrollableStyle);
    });
}