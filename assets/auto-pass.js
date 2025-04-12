/**
 * Auto-pass functionality for quiz - standalone implementation
 * This file fixes the auto-pass feature that wasn't working
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up auto-pass functionality...');
    setupAutoPassTrigger();
});

// Set up the trigger for auto-pass
function setupAutoPassTrigger() {
    const trigger = document.getElementById('secret-pass-trigger');
    if (!trigger) {
        console.warn('Auto-pass trigger not found, will retry in 1 second');
        setTimeout(setupAutoPassTrigger, 1000);
        return;
    }

    console.log('Found auto-pass trigger, attaching handler');
    let clickCount = 0;
    
    // Add click handler directly
    trigger.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        clickCount++;
        
        // Visual feedback
        trigger.style.color = '#00FF41';
        setTimeout(() => trigger.style.color = '', 300);
        
        console.log('Secret trigger clicked', clickCount, 'times');
        
        if (clickCount >= 3) {
            console.log('Auto-pass activated!');
            executeAutoPass();
            clickCount = 0;
        }
    };
}

// Direct implementation of auto-pass functionality
function executeAutoPass() {
    try {
        console.log('Executing auto-pass...');
        
        // Show visual notification
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#00FF41';
        notification.style.color = '#0a0a0a';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        notification.style.zIndex = '9999';
        notification.style.fontWeight = 'bold';
        notification.innerHTML = '<i class="fas fa-trophy"></i> Quiz Auto-Passed!';
        document.body.appendChild(notification);
        
        // Get required elements
        const quizEl = document.querySelector('.final-quiz-container');
        const introSection = document.getElementById('final-quiz-intro');
        const questionsSection = document.getElementById('final-quiz-questions');
        const resultsSection = document.getElementById('final-quiz-results');
        const startButton = document.getElementById('start-final-quiz-btn');
        const submitButton = document.getElementById('submit-quiz');
        
        // Make sure we have quiz data
        const quizData = window.quizData; 
        if (!quizData || !Array.isArray(quizData)) {
            console.error('Cannot auto-pass: Quiz data not available');
            alert('Quiz data not available. Please try again in a few seconds.');
            return;
        }
        
        // Calculate perfect score
        const totalQuestions = quizData.length;
        const score = totalQuestions;
        const percentage = 100;
        
        // Generate correct answers
        const correctAnswers = quizData.map(q => q.correctAnswer);
        
        // Update quiz state
        window.userAnswers = correctAnswers;
        window.quizStarted = true;
        
        // Show results section, hide others
        if (introSection) introSection.style.display = 'none';
        if (questionsSection) questionsSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'block';
        if (startButton) startButton.style.display = 'none';
        if (submitButton) submitButton.style.display = 'none';
        
        // Update score display
        const finalScoreEl = document.getElementById('final-score');
        const scorePercentageEl = document.getElementById('score-percentage');
        const maxScoreEl = document.getElementById('max-score');
        
        if (finalScoreEl) finalScoreEl.textContent = score;
        if (scorePercentageEl) scorePercentageEl.textContent = percentage + '%';
        if (maxScoreEl) maxScoreEl.textContent = totalQuestions;
        
        // Show pass message, hide fail message
        const passMessageEl = document.getElementById('pass-message');
        const failMessageEl = document.getElementById('fail-message');
        
        if (passMessageEl) passMessageEl.style.display = 'block';
        if (failMessageEl) failMessageEl.style.display = 'none';
        
        // Set certificate level to highest
        const certLevelEl = document.getElementById('cert-level');
        if (certLevelEl) certLevelEl.textContent = 'Master Cryptographer';
        
        // Save to localStorage
        try {
            // Create result object
            const quizResult = {
                completed: true,
                passed: true,
                score: score,
                totalQuestions: totalQuestions,
                percentage: percentage,
                certLevel: 'Master Cryptographer',
                userAnswers: correctAnswers,
                completedDate: new Date().toISOString()
            };
            
            // Try both storage methods for compatibility
            localStorage.setItem('cipherLabFinalQuizStatus', JSON.stringify(quizResult));
            
            // Update progress tracking
            try {
                const progressData = localStorage.getItem('cipherLabQuizProgress');
                if (progressData) {
                    const progress = JSON.parse(progressData);
                    progress.finalQuizCompleted = true;
                    progress.finalQuizScore = percentage;
                    localStorage.setItem('cipherLabQuizProgress', JSON.stringify(progress));
                }
            } catch (e) {
                console.error('Error updating progress tracking:', e);
            }
            
        } catch (e) {
            console.error('Error saving quiz results:', e);
        }
        
        // Scroll to results section
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
        
        console.log('Auto-pass successfully completed!');
        
    } catch (error) {
        console.error('Error executing auto-pass:', error);
        alert('There was an error with the auto-pass feature. Please try again.');
    }
}
