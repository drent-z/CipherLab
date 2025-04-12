// Store quiz data in localStorage with enhanced module tracking
function saveQuizProgress(completedLessons, totalLessons) {
    // Get existing progress data or create new object
    const progressData = localStorage.getItem('cipherLabQuizProgress');
    let progress = progressData ? JSON.parse(progressData) : {};
    
    // Update with new data
    progress.completedLessons = completedLessons;
    progress.totalLessons = totalLessons;
    progress.lastUpdated = new Date().toISOString();
    
    // Track module completion
    const moduleProgress = {};
    
    // Group completed lessons by module
    completedLessons.forEach(lessonId => {
        const moduleMatch = lessonId.match(/lesson(\d+)-/);
        if (moduleMatch) {
            const moduleNum = moduleMatch[1];
            if (!moduleProgress[moduleNum]) {
                moduleProgress[moduleNum] = 0;
            }
            moduleProgress[moduleNum]++;
        }
    });
    
    // Save module progress
    progress.moduleProgress = moduleProgress;
    
    // Persist to localStorage
    localStorage.setItem('cipherLabQuizProgress', JSON.stringify(progress));
    
    // Also update last activity timestamp
    localStorage.setItem('cipherLabLastActivity', new Date().toISOString());
}

// Load quiz progress from localStorage
function loadQuizProgress() {
    const progressData = localStorage.getItem('cipherLabQuizProgress');
    if (progressData) {
        const progress = JSON.parse(progressData);
        return progress.completedLessons || [];
    }
    return [];
}

// Get module completion status
function getModuleCompletionStatus() {
    const progressData = localStorage.getItem('cipherLabQuizProgress');
    if (progressData) {
        const progress = JSON.parse(progressData);
        return progress.moduleProgress || {};
    }
    return {};
}

// Check if a specific module is complete
function isModuleComplete(moduleNum, requiredLessons) {
    const moduleProgress = getModuleCompletionStatus();
    return moduleProgress[moduleNum] >= requiredLessons;
}

// Learn module functions with enhanced progress tracking
function showLesson(lessonId) {
    // Hide the modules section and show the lesson content section
    document.getElementById('lesson-content-section').style.display = 'block';
    
    // Get current module from lessonId (e.g., lesson1-2 -> module1)
    const moduleNum = lessonId.charAt(6);
    const currentModule = `module${moduleNum}`;
    
    // Record lesson view in localStorage for tracking
    recordLessonView(lessonId);
    
    // Get all lesson content elements
    const lessonElements = document.querySelectorAll('[id$="-content"]');
    lessonElements.forEach(element => {
        if (element.id === `${lessonId}-content`) {
            element.style.display = 'block';
            document.getElementById('lesson-title').textContent = element.querySelector('h4') ? 
                element.querySelector('h4').textContent : 
                document.querySelector(`[onclick="showLesson('${lessonId}')"] h4`).textContent;
        } else {
            element.style.display = 'none';
        }
    });
    
    // Handle lesson navigation
    setupLessonNavigation(lessonId, currentModule);
    
    // Scroll to top of lesson
    window.scrollTo({
        top: document.getElementById('lesson-content-section').offsetTop - 100,
        behavior: 'smooth'
    });
    
    // Check if lesson is completed
    const completedLessons = loadQuizProgress();
    if (completedLessons.includes(lessonId)) {
        document.getElementById('complete-lesson').classList.add('completed');
        document.getElementById('complete-lesson').innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        
        // Add completed class to the lesson content section
        const lessonContent = document.getElementById(`${lessonId}-content`);
        if (lessonContent) {
            lessonContent.classList.add('completed-lesson');
        }
    } else {
        document.getElementById('complete-lesson').classList.remove('completed');
        document.getElementById('complete-lesson').innerHTML = '<i class="fas fa-check-circle"></i> Mark as Complete';
    }
    
    // Update progress status
    updateQuizProgress();
}

// Record lesson view
function recordLessonView(lessonId) {
    // Get or create lesson views from localStorage
    const viewsData = localStorage.getItem('cipherLabLessonViews');
    let views = viewsData ? JSON.parse(viewsData) : {};
    
    // Update view count for this lesson
    if (!views[lessonId]) {
        views[lessonId] = 0;
    }
    views[lessonId]++;
    
    // Update last viewed timestamp
    views.lastViewed = {
        lessonId: lessonId,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('cipherLabLessonViews', JSON.stringify(views));
    localStorage.setItem('cipherLabLastActivity', new Date().toISOString());
}

// Setup lesson navigation buttons
function setupLessonNavigation(lessonId, currentModule) {
    const prevButton = document.getElementById('prev-lesson');
    const nextButton = document.getElementById('next-lesson');
    const completeButton = document.getElementById('complete-lesson');
    const backButton = document.getElementById('back-to-modules');
    
    // Get all lesson boxes in the current module
    const lessonBoxes = document.querySelectorAll(`#${currentModule}-content .lesson-box`);
    const lessonIds = Array.from(lessonBoxes).map(box => {
        const onclick = box.getAttribute('onclick');
        return onclick.match(/'(.*?)'/)[1];
    });
    
    const currentIndex = lessonIds.indexOf(lessonId);
    
    // Setup previous button
    if (currentIndex > 0) {
        prevButton.style.visibility = 'visible';
        prevButton.onclick = () => showLesson(lessonIds[currentIndex - 1]);
    } else {
        prevButton.style.visibility = 'hidden';
    }
    
    // Setup next button
    if (currentIndex < lessonIds.length - 1) {
        nextButton.style.visibility = 'visible';
        nextButton.onclick = () => showLesson(lessonIds[currentIndex + 1]);
    } else {
        nextButton.style.visibility = 'hidden';
    }
    
    // Setup complete button
    completeButton.onclick = () => {
        const completedLessons = loadQuizProgress();
        if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
            saveQuizProgress(completedLessons, lessonIds.length);
            
            // Update the lesson status icon in the module view
            const statusIcon = document.getElementById(`status-${lessonId}`);
            if (statusIcon) {
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.parentElement.innerHTML = '<i class="fas fa-check-circle"></i> <span>Completed</span>';
            }
            
            // Update the complete button
            completeButton.classList.add('completed');
            completeButton.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
            
            // Update the quiz progress
            updateQuizProgress();
        }
    };
    
    // Setup back button
    backButton.onclick = () => {
        document.getElementById('lesson-content-section').style.display = 'none';
        
        // Show the active module tab
        const moduleTab = document.querySelector(`[data-module="${currentModule}"]`);
        if (moduleTab) {
            moduleTab.click();
        }
        
        // Scroll to the module section
        window.scrollTo({
            top: document.querySelector('.simple-tabs').offsetTop - 100,
            behavior: 'smooth'
        });
    };
}

// Function to check quiz answers
function checkAnswer(button, lessonId) {
    const correctOption = button.getAttribute('data-correct');
    const questionContainer = button.closest('.quiz-container');
    const options = questionContainer.querySelectorAll('.simple-option');
    const feedbackContainer = questionContainer.querySelector('.feedback-container');
    
    let selectedOption = null;
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.checked) {
            selectedOption = radio.value;
        }
    });
    
    // If no option selected, show alert
    if (!selectedOption) {
        alert('Please select an answer first!');
        return;
    }
    
    // Disable all inputs
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        radio.disabled = true;
        option.classList.add(radio.value === correctOption ? 'correct-option' : 'incorrect-option');
    });
    
    // Show feedback
    feedbackContainer.style.display = 'block';
    const isCorrect = selectedOption === correctOption;
    
    feedbackContainer.querySelector('.correct-answer').style.display = isCorrect ? 'block' : 'none';
    feedbackContainer.querySelector('.incorrect-answer').style.display = isCorrect ? 'none' : 'block';
    
    // Disable the check button
    button.disabled = true;
    button.textContent = isCorrect ? 'Correct!' : 'Try Again';
}

// Update the quiz progress indicator with enhanced UI feedback
function updateQuizProgress() {
    const completedLessons = loadQuizProgress();
    const totalLessons = document.querySelectorAll('.lesson-box').length;
    const progressValue = document.getElementById('quiz-progress-value');
    
    if (progressValue) {
        const percentage = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
        progressValue.style.width = `${percentage}%`;
        
        // Update progress text if it exists
        const progressText = document.getElementById('progress-percentage');
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }
    
    // Update status icons for each lesson
    const moduleProgress = getModuleCompletionStatus();
    
    // Update module status indicators if they exist
    Object.keys(moduleProgress).forEach(moduleNum => {
        const moduleStatusElement = document.getElementById(`module${moduleNum}-status`);
        if (moduleStatusElement) {
            const completedCount = moduleProgress[moduleNum];
            const totalCount = document.querySelectorAll(`#module${moduleNum}-content .lesson-box`).length;
            
            // Update status text and add completed class if all lessons are done
            if (completedCount >= totalCount) {
                moduleStatusElement.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                moduleStatusElement.classList.add('module-completed');
            } else {
                moduleStatusElement.innerHTML = `<i class="fas fa-spinner"></i> ${completedCount}/${totalCount} Completed`;
            }
        }
    });
    
    // Show last activity if available
    const lastActivity = localStorage.getItem('cipherLabLastActivity');
    if (lastActivity) {
        const lastActivityDate = new Date(lastActivity);
        const activityElement = document.getElementById('last-activity');
        if (activityElement) {
            activityElement.textContent = `Last activity: ${lastActivityDate.toLocaleDateString()}`;
        }
    }
}

// Start the final quiz
function startFinalQuiz() {
    window.location.href = '/quiz/';
}

document.addEventListener('DOMContentLoaded', () => {
    // Load and initialize saved progress
    initSavedProgress();
    
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
    
    // Update quiz progress display
    updateQuizProgress();
    
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

    // DIRECT TOGGLE WITH NO DELAY
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#main-nav');
    
    // Remove any possible existing event handlers
    if (navbarToggler && navbarCollapse) {
        const newToggler = navbarToggler.cloneNode(true);
        navbarToggler.parentNode.replaceChild(newToggler, navbarToggler);
        
        // Add a direct, simple click handler
        newToggler.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Stop event propagation
            
            // Directly toggle the show class
            navbarCollapse.classList.toggle('show');
            
            // Update aria-expanded
            const isExpanded = navbarCollapse.classList.contains('show');
            newToggler.setAttribute('aria-expanded', isExpanded);
            
            // Force a reflow to ensure CSS transitions work properly
            void navbarCollapse.offsetWidth;
        });
    }
    
    // Make all nav links work properly
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            // Close menu when a link is clicked
            if (navbarCollapse) {
                navbarCollapse.classList.remove('show');
                if (newToggler) {
                    newToggler.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
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
        
        // Store particle data for animation - SLOWER SPEED
        particle.dataset.vx = (Math.random() - 0.5) * 0.7; // x velocity - slower speed
        particle.dataset.vy = (Math.random() - 0.5) * 0.7; // y velocity - slower speed
        
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

// Initialize saved progress from localStorage
function initSavedProgress() {
    // Get module progress
    const progressData = localStorage.getItem('cipherLabQuizProgress');
    if (!progressData) return;
    
    const progress = JSON.parse(progressData);
    
    // Update UI elements with completion status
    if (progress.completedLessons) {
        // Mark completed lessons
        progress.completedLessons.forEach(lessonId => {
            // Update status icon if it exists
            const statusIcon = document.getElementById(`status-${lessonId}`);
            if (statusIcon) {
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.parentElement.innerHTML = '<i class="fas fa-check-circle"></i> <span>Completed</span>';
            }
            
            // Add completed class to lesson box
            const lessonBox = document.querySelector(`[onclick="showLesson('${lessonId}')"]`);
            if (lessonBox) {
                lessonBox.classList.add('completed-lesson');
            }
        });
    }
    
    // Check if final quiz was completed
    if (progress.finalQuizCompleted) {
        const finalQuizCard = document.querySelector('.final-quiz-card');
        if (finalQuizCard) {
            finalQuizCard.classList.add('completed-quiz');
            
            // Maybe add a badge or icon
            const quizStatus = document.getElementById('quiz-status-text');
            if (quizStatus) {
                quizStatus.textContent = 'Completed';
                quizStatus.style.color = 'var(--primary)';
            }
            
            const quizIcon = document.getElementById('quiz-lock-icon');
            if (quizIcon) {
                quizIcon.className = 'fas fa-check-circle';
                quizIcon.style.color = 'var(--primary)';
            }
        }
    }
    
    // If we have a last viewed lesson, maybe offer to resume
    const viewsData = localStorage.getItem('cipherLabLessonViews');
    if (viewsData) {
        const views = JSON.parse(viewsData);
        if (views.lastViewed && views.lastViewed.lessonId) {
            // Create a "resume" button if we're on the learn page
            const resumeContainer = document.querySelector('.resume-container');
            if (resumeContainer) {
                const lastViewedTimestamp = new Date(views.lastViewed.timestamp);
                const now = new Date();
                const daysSinceLastView = Math.floor((now - lastViewedTimestamp) / (1000 * 60 * 60 * 24));
                
                // Only show resume button if viewed in the last 7 days
                if (daysSinceLastView < 7) {
                    const resumeButton = document.createElement('button');
                    resumeButton.className = 'resume-button';
                    resumeButton.innerHTML = `<i class="fas fa-play-circle"></i> Resume Learning`;
                    resumeButton.onclick = function() {
                        showLesson(views.lastViewed.lessonId);
                    };
                    
                    resumeContainer.appendChild(resumeButton);
                }
            }
        }
    }
}

// Interactive cipher demos
function initCipherDemos() {
    // Caesar Cipher Demo
    const caesarInput = document.getElementById('caesar-input');
    const caesarOutput = document.getElementById('caesar-output');
    const caesarShift = document.getElementById('caesar-shift');
    const shiftDisplay = document.getElementById('shift-display');
    const alphabetShifted = document.querySelector('.alphabet-row.shifted');
    
    // Function to update the shifted alphabet visualization
    function updateShiftedAlphabet(shift) {
        if (alphabetShifted) {
            // Create a shifted alphabet
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let shiftedContent = '';
            
            for (let i = 0; i < 26; i++) {
                const shiftedIndex = (i + shift) % 26;
                shiftedContent += `<div class="alphabet-letter">${alphabet[shiftedIndex]}</div>`;
            }
            
            alphabetShifted.innerHTML = shiftedContent;
        }
    }
    
    // Function to update the shift display
    window.updateShiftDisplay = function() {
        if (caesarShift && shiftDisplay) {
            const shift = parseInt(caesarShift.value);
            shiftDisplay.textContent = shift;
            updateShiftedAlphabet(shift);
            updateCaesarCipher();
        }
    };
    
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
        
        // Initialize shifted alphabet visualization
        updateShiftedAlphabet(caesarShift ? parseInt(caesarShift.value) : 3);
        
        caesarInput.addEventListener('input', updateCaesarCipher);
        caesarShift.addEventListener('input', function() {
            updateShiftDisplay();
            updateCaesarCipher();
        });
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