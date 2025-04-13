/**
 * Learn Page Enhancements - Updating Quick Check UI to match Final Quiz
 */

document.addEventListener('DOMContentLoaded', function() {
    // Apply enhanced styling to Quick Check questions
    updateQuickCheckStyles();
});

function updateQuickCheckStyles() {
    // Find all quick check containers
    const quickCheckContainers = document.querySelectorAll('.lesson-quiz');
    
    if (quickCheckContainers.length === 0) return;
    
    // For each quick check container
    quickCheckContainers.forEach(container => {
        // Add the enhanced class
        container.classList.add('enhanced-quick-check');
        
        // Style the container to match final quiz
        const quizContainer = container.querySelector('.quiz-container');
        if (quizContainer) {
            // Update the quiz container styling
            quizContainer.classList.add('final-quiz-style');
            
            // Update the question text styling
            const questionText = quizContainer.querySelector('.quiz-question');
            if (questionText) {
                questionText.classList.add('final-quiz-question');
            }
            
            // Update the options container
            const optionsContainer = quizContainer.querySelector('.simple-options');
            if (optionsContainer) {
                optionsContainer.classList.add('options-container');
                
                // Update each option to match final quiz
                const options = optionsContainer.querySelectorAll('.simple-option');
                options.forEach(option => {
                    option.classList.add('option');
                    
                    // Add option radio element
                    const input = option.querySelector('input[type="radio"]');
                    if (input) {
                        // Create option radio span
                        const optionRadio = document.createElement('span');
                        optionRadio.className = 'option-radio';
                        
                        // Move the input inside the span visually (but keep the actual input for functionality)
                        input.style.opacity = '0';
                        input.style.position = 'absolute';
                        option.insertBefore(optionRadio, option.firstChild);
                        
                        // Add event listener to handle selection
                        input.addEventListener('change', function() {
                            // Remove selected class from all options
                            options.forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            
                            // Add selected class to this option if checked
                            if (this.checked) {
                                option.classList.add('selected');
                            }
                        });
                    }
                });
            }
            
            // Update the submit button
            const submitButton = quizContainer.querySelector('.simple-button');
            if (submitButton) {
                submitButton.classList.add('primary-button');
                
                // Keep the existing onClick handler
                const originalOnClick = submitButton.getAttribute('onclick');
                
                // Create icon element
                const icon = document.createElement('i');
                icon.className = 'fas fa-check';
                
                // Add icon to button before text
                submitButton.innerHTML = ''; // Clear existing content
                submitButton.appendChild(icon);
                submitButton.appendChild(document.createTextNode(' Check My Answer'));
                
                // Restore the original onClick handler
                if (originalOnClick) {
                    submitButton.setAttribute('onclick', originalOnClick);
                }
            }
        }
    });
}

// Add CSS styles to make Quick Check match Final Quiz
const styles = document.createElement('style');
styles.textContent = `
    /* Enhanced Quick Check Styling */
    .enhanced-quick-check {
        margin-top: 2rem;
        background-color: var(--medium-dark);
        border-radius: 12px;
        border: 1px solid var(--primary);
        overflow: hidden;
    }
    
    .enhanced-quick-check h3 {
        background-color: var(--light-dark);
        padding: 1rem 1.5rem;
        margin: 0;
        border-bottom: 1px solid var(--primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .final-quiz-style {
        padding: 1.5rem;
        border-left: none !important;
    }
    
    .final-quiz-question {
        font-size: 1.3rem;
        color: var(--text);
        margin-bottom: 1.5rem;
    }
    
    .enhanced-quick-check .options-container {
        margin-bottom: 1.5rem;
    }
    
    .enhanced-quick-check .option {
        background-color: var(--dark);
        border: 1px solid var(--primary-dark);
        border-radius: 8px;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.2s ease;
    }
    
    .enhanced-quick-check .option:hover {
        background-color: var(--light-dark);
        transform: translateY(-2px);
    }
    
    .enhanced-quick-check .option.selected {
        background-color: var(--primary-dark);
        border-color: var(--primary);
        color: var(--dark);
    }
    
    .enhanced-quick-check .option-radio {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary);
        border-radius: 50%;
        margin-right: 1rem;
        position: relative;
    }
    
    .enhanced-quick-check .option.selected .option-radio:after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--dark);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .enhanced-quick-check .primary-button {
        background: linear-gradient(45deg, var(--primary-dark), var(--primary));
        color: var(--dark);
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
    }
    
    .enhanced-quick-check .primary-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 255, 65, 0.4);
    }
    
    .enhanced-quick-check .correct-answer-btn {
        background: linear-gradient(45deg, #00aa44, #00ff41);
    }
    
    .enhanced-quick-check .incorrect-answer-btn {
        background: linear-gradient(45deg, #aa0000, #ff3333);
    }
    
    /* Feedback container styles */
    .enhanced-quick-check .feedback-container {
        background-color: var(--darker);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border-left: 4px solid var(--primary);
    }
    
    .enhanced-quick-check .correct-answer {
        color: var(--primary);
    }
    
    .enhanced-quick-check .incorrect-answer {
        color: #ff3333;
    }
`;

document.head.appendChild(styles);