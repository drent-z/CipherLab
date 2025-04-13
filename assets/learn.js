/**
 * CipherLab Learning Module JavaScript
 * Handles interactivity for the learn page and modules
 */

// Constants
const PROGRESS_KEY = 'cipherLabQuizProgress';

// Module data structure to organize lessons
const moduleData = {
    module1: ['lesson1-1', 'lesson1-2', 'lesson1-3'],
    module2: ['lesson2-1', 'lesson2-2', 'lesson2-3'],
    module3: ['lesson3-1', 'lesson3-2', 'lesson3-3'],
    module4: ['lesson4-1', 'lesson4-2', 'lesson4-3'],
    module5: ['lesson5-1', 'lesson5-2', 'lesson5-3']
};

// Module names for display
const moduleNames = {
    module1: "Fundamentals",
    module2: "Classical Ciphers",
    module3: "Modern Cryptography",
    module4: "Applications",
    module5: "Advanced Topics"
};

// Update the progress display
function updateProgressDisplay() {
    const completedLessons = loadQuizProgress();
    const totalLessons = Object.values(moduleData).flat().length;
    const percentage = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
    
    // Update progress bar
    const progressBar = document.getElementById('quiz-progress-value');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
    
    // Update lesson status indicators
    completedLessons.forEach(lessonId => {
        const statusElement = document.getElementById(`status-${lessonId}`);
        if (statusElement) {
            statusElement.className = 'fas fa-check-circle';
            const textElement = statusElement.nextElementSibling;
            if (textElement) textElement.textContent = 'Completed';
        }
    });
    
    // Update roadmap nodes based on module completion
    updateRoadmapNodes(completedLessons);
}

// Update roadmap nodes based on lesson completion
function updateRoadmapNodes(completedLessons) {
    // Calculate completed modules
    const moduleCompletionStatus = {};
    
    // Initialize all modules as incomplete
    Object.keys(moduleData).forEach(moduleId => {
        moduleCompletionStatus[moduleId] = false;
    });
    
    // Mark modules as completed if all lessons are done
    Object.entries(moduleData).forEach(([moduleId, lessons]) => {
        const allLessonsCompleted = lessons.every(lesson => 
            completedLessons.includes(lesson)
        );
        moduleCompletionStatus[moduleId] = allLessonsCompleted;
    });
    
    // Find the furthest module with at least one completed lesson
    let furthestModuleIndex = 1;
    Object.entries(moduleData).forEach(([moduleId, lessons]) => {
        const moduleIndex = parseInt(moduleId.replace('module', ''));
        const hasCompletedLesson = lessons.some(lesson => 
            completedLessons.includes(lesson)
        );
        
        if (hasCompletedLesson && moduleIndex > furthestModuleIndex) {
            furthestModuleIndex = moduleIndex;
        }
    });
    
    // Update roadmap nodes
    const roadmapNodes = document.querySelectorAll('.roadmap-node');
    const roadmapProgress = document.querySelector('.roadmap-progress');
    
    roadmapNodes.forEach(node => {
        const moduleId = node.getAttribute('data-module');
        const moduleIndex = parseInt(moduleId.replace('module', ''));
        
        // Mark completed modules
        if (moduleCompletionStatus[moduleId]) {
            node.classList.add('completed');
        } else {
            node.classList.remove('completed');
        }
        
        // Update active state
        if (moduleIndex === furthestModuleIndex && 
            !moduleCompletionStatus[moduleId]) {
            node.classList.add('active');
        } else if (!moduleCompletionStatus[moduleId]) {
            node.classList.remove('active');
        }
    });
    
    // Update progress track
    if (roadmapProgress) {
        // Calculate progress width based on furthest module
        const progressWidth = ((furthestModuleIndex - 1) / (Object.keys(moduleData).length - 1)) * 100;
        roadmapProgress.style.width = `${progressWidth}%`;
    }
}

// Initialize the tab system
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.module-content');
    const roadmapNodes = document.querySelectorAll('.roadmap-node');
    
    function activateModule(moduleId) {
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        const button = document.querySelector(`.tab-button[data-module="${moduleId}"]`);
        if (button) button.classList.add('active');
        
        const content = document.getElementById(`${moduleId}-content`);
        if (content) content.classList.add('active');
        
        // Update roadmap
        roadmapNodes.forEach(node => {
            if (node.getAttribute('data-module') === moduleId) {
                node.classList.add('active');
            } else if (!node.classList.contains('completed')) {
                node.classList.remove('active');
            }
        });
    }
    
    // Tab button click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleId = button.getAttribute('data-module');
            activateModule(moduleId);
        });
    });
    
    // Roadmap node click handlers
    roadmapNodes.forEach(node => {
        node.addEventListener('click', () => {
            const moduleId = node.getAttribute('data-module');
            activateModule(moduleId);
            
            // Also scroll to the tab content
            const tabContent = document.querySelector('.simple-tabs');
            if (tabContent) {
                tabContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Enhanced lesson boxes with visual feedback
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
        
        // Add ripple effect on click
        box.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
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
                    sessionStorage.removeItem(PROGRESS_KEY);
                    
                    // Reset progress object
                    saveQuizProgress([], Object.values(moduleData).flat().length);
                    
                    // Reset UI elements
                    document.querySelectorAll('.lesson-status').forEach(status => {
                        const icon = status.querySelector('i');
                        const text = status.querySelector('span');
                        
                        if (icon) icon.className = 'fas fa-circle';
                        if (text) text.textContent = 'Not started';
                    });
                    
                    // Reset roadmap nodes
                    document.querySelectorAll('.roadmap-node').forEach(node => {
                        node.classList.remove('completed');
                    });
                    
                    // Reset progress bar
                    updateProgressDisplay();
                    
                    // Reset button text
                    this.innerHTML = 'Reset Progress';
                    
                    // Show confirmation
                    alert('Your progress has been reset successfully!');
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
    
    // Setup previous and next buttons
    setupLessonNavigation();
}

// Setup lesson navigation buttons
function setupLessonNavigation() {
    const prevButton = document.getElementById('prev-lesson');
    const nextButton = document.getElementById('next-lesson');
    
    if (prevButton && nextButton) {
        // Add hover effects
        [prevButton, nextButton].forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.classList.add('nav-button-hover');
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('nav-button-hover');
            });
        });
    }
}

// Initialize interactive demos
function initInteractiveDemos() {
    // Caesar cipher interactive demo enhancement
    const caesarInput = document.getElementById('caesar-input');
    const caesarShift = document.getElementById('caesar-shift');
    const caesarOutput = document.getElementById('caesar-output');
    
    if (caesarInput && caesarShift && caesarOutput) {
        // Add visual feedback during interaction
        caesarInput.addEventListener('focus', () => {
            caesarInput.style.boxShadow = '0 0 8px var(--primary)';
        });
        
        caesarInput.addEventListener('blur', () => {
            caesarInput.style.boxShadow = '';
        });
        
        function updateCaesarOutput() {
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
        
        caesarInput.addEventListener('input', updateCaesarOutput);
        
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
            
            // Update shifted alphabet display
            updateShiftedAlphabet(parseInt(caesarShift.value));
            
            // Update cipher output
            updateCaesarOutput();
        });
        
        // Initialize with default values
        updateCaesarOutput();
    }
    
    // Function to update shifted alphabet visualization
    function updateShiftedAlphabet(shift) {
        const alphabetShifted = document.querySelector('.alphabet-row.shifted');
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
    
    // Vigenère cipher interactive demo enhancement
    const vigenereInput = document.getElementById('vigenere-input');
    const vigenereKey = document.getElementById('vigenere-key');
    const vigenereOutput = document.getElementById('vigenere-output');
    
    if (vigenereInput && vigenereKey && vigenereOutput) {
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
        
        // Update Vigenère cipher output
        function updateVigenereOutput() {
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
            
            // Add visual feedback
            vigenereOutput.classList.add('result-updated');
            setTimeout(() => {
                vigenereOutput.classList.remove('result-updated');
            }, 300);
        }
        
        vigenereInput.addEventListener('input', updateVigenereOutput);
        vigenereKey.addEventListener('input', updateVigenereOutput);
        
        // Initialize with default values
        updateVigenereOutput();
    }
}

// Initialize the quiz check functionality
function initQuizChecks() {
    // Using event delegation for all quiz buttons
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        // Check if it's a quiz answer button
        if (target.classList.contains('simple-button') && target.hasAttribute('data-correct')) {
            const correctOption = target.getAttribute('data-correct');
            const questionContainer = target.closest('.quiz-container');
            
            if (!questionContainer) return;
            
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
                target.disabled = true;
                target.innerHTML = isCorrect ? '<i class="fas fa-check-circle"></i> Correct!' : '<i class="fas fa-times-circle"></i> Try Again';
                target.className = isCorrect ? 'simple-button correct-answer-btn' : 'simple-button incorrect-answer-btn';
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    feedbackContainer.classList.remove('animate__animated', 'animate__fadeIn');
                }, 1000);
            }
        }
    });
}

// Load quiz progress from sessionStorage
function loadQuizProgress() {
    const progressData = sessionStorage.getItem(PROGRESS_KEY);
    if (progressData) {
        const progress = JSON.parse(progressData);
        return progress.completedLessons || [];
    }
    return [];
}

// Save quiz progress to sessionStorage
function saveQuizProgress(completedLessons, totalLessons) {
    const progress = {
        completedLessons: completedLessons,
        totalLessons: totalLessons
    };
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

// Enhanced showLesson function that works with the new layout
window.showLesson = function(lessonId) {
    // Extract module number from lessonId (e.g. lesson1-2 → module1)
    const moduleNum = lessonId.charAt(6);
    const moduleId = `module${moduleNum}`;
    
    // Get lesson index within module
    const lessons = moduleData[moduleId] || [];
    const currentIndex = lessons.indexOf(lessonId);
    const totalLessons = lessons.length;
    
    // Hide the module content and show the lesson viewer
    document.querySelectorAll('.module-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const lessonViewer = document.getElementById('lesson-viewer');
    if (lessonViewer) {
        lessonViewer.style.display = 'block';
    }
    
    // Update lesson number display
    const currentLessonNumber = document.getElementById('current-lesson-number');
    const totalModuleLessons = document.getElementById('total-module-lessons');
    if (currentLessonNumber) currentLessonNumber.textContent = currentIndex + 1;
    if (totalModuleLessons) totalModuleLessons.textContent = totalLessons;
    
    // Set lesson title
    const lessonCard = document.querySelector(`#${lessonId}-card`);
    if (lessonCard) {
        const currentLessonTitle = document.getElementById('current-lesson-title');
        if (currentLessonTitle) {
            currentLessonTitle.textContent = lessonCard.querySelector('h4').textContent;
        }
    }
    
    // Hide all lesson containers, then show the current one
    const lessonContainers = document.querySelectorAll('.lesson-container');
    lessonContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // Show the selected lesson
    const currentLesson = document.getElementById(`${lessonId}-content`);
    if (currentLesson) {
        currentLesson.style.display = 'block';
    }
    
    // Update navigation buttons
    updateNavigation(lessonId, moduleId);
    
    // Update complete button status
    updateCompleteButton(lessonId);
    
    // Scroll to top of the page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Update navigation buttons based on current lesson
function updateNavigation(lessonId, moduleId) {
    const prevButton = document.getElementById('prev-lesson');
    const nextButton = document.getElementById('next-lesson');
    const backButton = document.getElementById('back-to-module');
    
    if (prevButton && nextButton) {
        const lessons = moduleData[moduleId];
        const currentIndex = lessons.indexOf(lessonId);
        
        // Update previous button
        if (currentIndex > 0) {
            prevButton.style.visibility = 'visible';
            prevButton.onclick = () => window.showLesson(lessons[currentIndex - 1]);
            
            // Add tooltip for previous lesson
            const prevLesson = document.querySelector(`#${lessons[currentIndex - 1]}-card`);
            if (prevLesson) {
                const prevTitle = prevLesson.querySelector('h4').textContent;
                prevButton.setAttribute('title', prevTitle);
            }
        } else {
            prevButton.style.visibility = 'hidden';
        }
        
        // Update next button
        if (currentIndex < lessons.length - 1) {
            nextButton.style.visibility = 'visible';
            nextButton.onclick = () => window.showLesson(lessons[currentIndex + 1]);
            
            // Add tooltip for next lesson
            const nextLesson = document.querySelector(`#${lessons[currentIndex + 1]}-card`);
            if (nextLesson) {
                const nextTitle = nextLesson.querySelector('h4').textContent;
                nextButton.setAttribute('title', nextTitle);
            }
        } else {
            nextButton.style.visibility = 'hidden';
        }
    }
    
    // Set up back button
    if (backButton) {
        backButton.onclick = () => {
            const lessonViewer = document.getElementById('lesson-viewer');
            if (lessonViewer) {
                lessonViewer.style.display = 'none';
            }
            
            const moduleContent = document.getElementById(`${moduleId}-content`);
            if (moduleContent) {
                moduleContent.classList.add('active');
            }
        };
    }
}

// Update the complete button status
function updateCompleteButton(lessonId) {
    const completeButton = document.getElementById('complete-lesson');
    
    if (completeButton) {
        const completedLessons = loadQuizProgress();
        
        if (completedLessons.includes(lessonId)) {
            completeButton.classList.add('completed');
            completeButton.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        } else {
            completeButton.classList.remove('completed');
            completeButton.innerHTML = '<i class="fas fa-check-circle"></i> Mark as Complete';
        }
        
        // Complete button click handler
        completeButton.onclick = () => {
            const completedLessons = loadQuizProgress();
            
            if (!completedLessons.includes(lessonId)) {
                completedLessons.push(lessonId);
                saveQuizProgress(completedLessons, Object.values(moduleData).flat().length);
                
                // Update status icon in lesson card
                const statusIcon = document.getElementById(`status-${lessonId}`);
                const statusText = statusIcon ? statusIcon.nextElementSibling : null;
                
                if (statusIcon) {
                    statusIcon.className = 'fas fa-check-circle';
                }
                
                if (statusText) {
                    statusText.textContent = 'Completed';
                }
                
                // Update button
                completeButton.classList.add('completed');
                completeButton.classList.add('pulse-animation');
                completeButton.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                
                // Remove pulse after animation completes
                setTimeout(() => {
                    completeButton.classList.remove('pulse-animation');
                }, 1000);
                
                // Update progress displays
                updateProgressDisplay();
                
                // Update module progress
                updateModuleProgress(lessonId.charAt(6));
            }
        };
    }
}

// Update module progress after completing a lesson
function updateModuleProgress(moduleNum) {
    const moduleId = `module${moduleNum}`;
    const lessons = moduleData[moduleId] || [];
    const completedLessons = loadQuizProgress();
    
    // Calculate percentage of module completed
    const moduleCompletedCount = lessons.filter(lesson => completedLessons.includes(lesson)).length;
    const modulePercentage = Math.round((moduleCompletedCount / lessons.length) * 100);
    
    // Update UI
    const modulePercentageElement = document.getElementById(`${moduleId}-percentage`);
    const moduleProgressBar = document.getElementById(`${moduleId}-progress-bar`);
    
    if (modulePercentageElement) {
        modulePercentageElement.textContent = `${modulePercentage}%`;
    }
    
    if (moduleProgressBar) {
        moduleProgressBar.style.width = `${modulePercentage}%`;
        moduleProgressBar.setAttribute('aria-valuenow', modulePercentage);
    }
}

// Start the final quiz
window.startFinalQuiz = function() {
    window.location.href = '/quiz/';
};

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize module tabs
    const moduleTabs = document.querySelectorAll('.module-tab');
    moduleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.module-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.module-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const moduleId = this.getAttribute('data-module');
            const moduleContent = document.getElementById(`${moduleId}-content`);
            if (moduleContent) {
                moduleContent.classList.add('active');
            }
            
            // Hide lesson viewer if visible
            const lessonViewer = document.getElementById('lesson-viewer');
            if (lessonViewer) {
                lessonViewer.style.display = 'none';
            }
        });
    });
    
    // Set up "Back to Module" button
    const backToModuleBtn = document.getElementById('back-to-module');
    if (backToModuleBtn) {
        backToModuleBtn.addEventListener('click', function() {
            // Hide lesson viewer
            const lessonViewer = document.getElementById('lesson-viewer');
            if (lessonViewer) {
                lessonViewer.style.display = 'none';
            }
            
            // Find which module was active and show it
            const activeModuleTab = document.querySelector('.module-tab.active');
            if (activeModuleTab) {
                const moduleId = activeModuleTab.getAttribute('data-module');
                const moduleContent = document.getElementById(`${moduleId}-content`);
                if (moduleContent) {
                    moduleContent.classList.add('active');
                }
            } else {
                // Default to module1 if none is active
                const module1Content = document.getElementById('module1-content');
                if (module1Content) {
                    module1Content.classList.add('active');
                    document.querySelector('.module-tab[data-module="module1"]').classList.add('active');
                }
            }
        });
    }
    
    // Other initializations
    setupResetButton();
    enhanceNavigation();
    initInteractiveDemos();
    initQuizChecks();
    updateProgressDisplay();
    
    // Apply visual enhancements
    document.querySelectorAll('.lesson-icon i').forEach(icon => {
        icon.classList.add('pulse-icon');
    });
    
    // Make sure lesson containers are hidden by default
    document.querySelectorAll('.lesson-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Add ripple effect to all buttons
    document.querySelectorAll('.simple-button, .nav-button, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Initialize module progress displays
    for (let i = 1; i <= 5; i++) {
        updateModuleProgress(i);
    }
});

// Add update shift display function for Caesar cipher
window.updateShiftDisplay = function() {
    const caesarShift = document.getElementById('caesar-shift');
    const shiftDisplay = document.getElementById('shift-display');
    const shiftLabel = document.getElementById('shift-label');
    
    if (caesarShift && shiftDisplay) {
        const shift = parseInt(caesarShift.value);
        shiftDisplay.textContent = shift;
        
        if (shiftLabel) {
            shiftLabel.textContent = `Shift by ${shift}`;
        }
    }
};

// Utility function to check answers in quizzes
window.checkAnswer = function(button, lessonId) {
    const correctOption = button.getAttribute('data-correct');
    const questionContainer = button.closest('.quiz-container');
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
    
    // Show feedback
    if (feedbackContainer) {
        feedbackContainer.style.display = 'block';
        
        // Show correct/incorrect message
        const isCorrect = selectedOption === correctOption;
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
        button.disabled = true;
        button.innerHTML = isCorrect ? 
            '<i class="fas fa-check-circle"></i> Correct!' : 
            '<i class="fas fa-times-circle"></i> Try Again';
        button.className = isCorrect ? 
            'simple-button correct-answer-btn' : 
            'simple-button incorrect-answer-btn';
    }
};</file_content_or_search_replace_blocks>
</invoke>