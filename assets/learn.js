/**
 * CipherLab Learning Module JavaScript
 * Handles interactivity for the learn page and modules
 */

// Update the progress display
function updateProgressDisplay() {
    const completedLessons = loadQuizProgress();
    const totalLessons = document.querySelectorAll('.lesson-box').length;
    const percentage = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
    
    // Update progress bar
    const progressBar = document.getElementById('quiz-progress-value');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    
    // Update lesson status indicators
    completedLessons.forEach(lessonId => {
        const statusElement = document.getElementById(`status-${lessonId}`);
        if (statusElement) {
            statusElement.className = 'fas fa-check-circle';
            const textElement = statusElement.nextElementSibling;
            if (textElement) textElement.textContent = 'Completed';
        }
    });
}

// Initialize the tab system
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.module-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleId = button.getAttribute('data-module');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${moduleId}-content`).classList.add('active');
        });
    });
}

// Adding hover effects to lesson boxes
function enhanceLessonBoxes() {
    const lessonBoxes = document.querySelectorAll('.lesson-box');
    
    lessonBoxes.forEach(box => {
        // Add glow effect on hover
        box.addEventListener('mouseenter', () => {
            const icon = box.querySelector('.lesson-icon i');
            if (icon) icon.classList.add('glow-icon');
        });
        
        box.addEventListener('mouseleave', () => {
            const icon = box.querySelector('.lesson-icon i');
            if (icon) icon.classList.remove('glow-icon');
        });
    });
}

// Enhanced reset progress functionality
function setupResetButton() {
    const resetButton = document.getElementById('reset-progress');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
                // Show visual feedback
                this.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Resetting...';
                
                // Wait a moment for animation effect
                setTimeout(() => {
                    // Clear storage
                    sessionStorage.removeItem('cipherLabQuizProgress');
                    
                    // Reset UI elements
                    document.querySelectorAll('.lesson-status').forEach(status => {
                        const icon = status.querySelector('i');
                        const text = status.querySelector('span');
                        
                        if (icon) icon.className = 'fas fa-circle';
                        if (text) text.textContent = 'Not started';
                    });
                    
                    // Reset progress bar
                    updateProgressDisplay();
                    
                    // Reset button text
                    this.innerHTML = 'Reset Progress';
                    
                    // Show confirmation
                    const messageContainer = document.createElement('div');
                    messageContainer.className = 'alert alert-success animate__animated animate__fadeIn';
                    messageContainer.innerHTML = 'Progress has been reset successfully!';
                    
                    // Add to page and remove after delay
                    const progressContainer = document.querySelector('.progress-container');
                    if (progressContainer) {
                        progressContainer.appendChild(messageContainer);
                        
                        setTimeout(() => {
                            messageContainer.classList.remove('animate__fadeIn');
                            messageContainer.classList.add('animate__fadeOut');
                            
                            setTimeout(() => {
                                progressContainer.removeChild(messageContainer);
                            }, 500);
                        }, 2000);
                    }
                }, 800);
            }
        });
    }
}

// Enhanced lesson navigation
function enhanceNavigation() {
    const backButton = document.getElementById('back-to-modules');
    if (backButton) {
        backButton.addEventListener('click', () => {
            const lessonSection = document.getElementById('lesson-content-section');
            
            // Add animation when returning to modules
            if (lessonSection) {
                lessonSection.classList.add('animate__animated', 'animate__fadeOut');
                
                setTimeout(() => {
                    lessonSection.style.display = 'none';
                    lessonSection.classList.remove('animate__animated', 'animate__fadeOut');
                    
                    // Scroll to modules section
                    const modulesContainer = document.querySelector('.modules-container');
                    if (modulesContainer) {
                        modulesContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            }
        });
    }
}

// Initialize interactive demos
function initInteractiveDemos() {
    // Caesar cipher interactive demo enhancement
    const caesarInput = document.getElementById('caesar-input');
    const caesarShift = document.getElementById('caesar-shift');
    
    if (caesarInput && caesarShift) {
        // Add visual feedback during interaction
        caesarInput.addEventListener('focus', () => {
            caesarInput.style.boxShadow = '0 0 8px var(--primary)';
        });
        
        caesarInput.addEventListener('blur', () => {
            caesarInput.style.boxShadow = '';
        });
        
        caesarShift.addEventListener('input', () => {
            // Update shift arrow text with animation
            const shiftLabel = document.getElementById('shift-label');
            if (shiftLabel) {
                shiftLabel.textContent = `Shift by ${caesarShift.value}`;
                shiftLabel.classList.add('pulse-animation');
                
                setTimeout(() => {
                    shiftLabel.classList.remove('pulse-animation');
                }, 500);
            }
        });
    }
    
    // Vigenère cipher interactive demo enhancement
    const vigenereInput = document.getElementById('vigenere-input');
    const vigenereKey = document.getElementById('vigenere-key');
    
    if (vigenereInput && vigenereKey) {
        // Add visual feedback
        vigenereInput.addEventListener('focus', () => {
            vigenereInput.style.boxShadow = '0 0 8px var(--primary)';
        });
        
        vigenereInput.addEventListener('blur', () => {
            vigenereInput.style.boxShadow = '';
        });
        
        vigenereKey.addEventListener('focus', () => {
            vigenereKey.style.boxShadow = '0 0 8px var(--secondary)';
        });
        
        vigenereKey.addEventListener('blur', () => {
            vigenereKey.style.boxShadow = '';
        });
    }
}

// Initialize the quiz check functionality
function initQuizChecks() {
    const quizButtons = document.querySelectorAll('.simple-button[data-correct]');
    
    quizButtons.forEach(button => {
        button.addEventListener('click', function() {
            const correctOption = this.getAttribute('data-correct');
            const questionContainer = this.closest('.quiz-container');
            const options = questionContainer.querySelectorAll('.simple-option input[type="radio"]');
            const feedbackContainer = questionContainer.querySelector('.feedback-container');
            
            let selectedOption = null;
            options.forEach(option => {
                if (option.checked) {
                    selectedOption = option.value;
                }
            });
            
            // If no option selected, show alert
            if (!selectedOption) {
                alert('Please select an answer first!');
                return;
            }
            
            // Show feedback with animation
            if (feedbackContainer) {
                feedbackContainer.style.display = 'block';
                feedbackContainer.classList.add('animate__animated', 'animate__fadeIn');
                
                const isCorrect = selectedOption === correctOption;
                
                // Show correct/incorrect message
                feedbackContainer.querySelector('.correct-answer').style.display = isCorrect ? 'block' : 'none';
                feedbackContainer.querySelector('.incorrect-answer').style.display = isCorrect ? 'none' : 'block';
                
                // Disable options
                options.forEach(option => {
                    option.disabled = true;
                    
                    // Highlight correct/incorrect options
                    const optionContainer = option.closest('.simple-option');
                    if (optionContainer) {
                        if (option.value === correctOption) {
                            optionContainer.classList.add('correct-option');
                        } else if (option.checked) {
                            optionContainer.classList.add('incorrect-option');
                        }
                    }
                });
                
                // Update check button
                this.disabled = true;
                this.innerHTML = isCorrect ? '<i class="fas fa-check-circle"></i> Correct!' : '<i class="fas fa-times-circle"></i> Try Again';
                this.className = isCorrect ? 'simple-button correct-answer-btn' : 'simple-button incorrect-answer-btn';
            }
        });
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    enhanceLessonBoxes();
    setupResetButton();
    enhanceNavigation();
    initInteractiveDemos();
    initQuizChecks();
    updateProgressDisplay();
    
    // Apply visual enhancements
    document.querySelectorAll('.lesson-icon i').forEach(icon => {
        icon.classList.add('pulse-icon');
    });
    
    // Add smooth transition when showing a lesson
    const lessonSection = document.getElementById('lesson-content-section');
    if (lessonSection) {
        // Make sure original showLesson function still works
        const originalShowLesson = window.showLesson;
        
        window.showLesson = function(lessonId) {
            // Show section with animation
            lessonSection.style.display = 'block';
            lessonSection.classList.add('animate__animated', 'animate__fadeIn');
            
            setTimeout(() => {
                lessonSection.classList.remove('animate__animated', 'animate__fadeIn');
                
                // Call the original function
                if (typeof originalShowLesson === 'function') {
                    originalShowLesson(lessonId);
                }
            }, 300);
        };
    }
});
