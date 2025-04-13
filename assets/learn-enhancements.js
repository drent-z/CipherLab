/**
 * CipherLab Learning Module Enhancements
 * Extra functionality for the learn page that complements learn.js
 * 
 * Note: This file extends functionality in learn.js but doesn't duplicate it.
 * If something is already in learn.js, don't implement it here.
 */

// Initialize additional learn page enhancements
function initAdditionalEnhancements() {
    // Only run on learn page
    if (!document.querySelector('.roadmap-node')) return;
    
    // Add keyboard navigation support
    enableKeyboardNavigation();
    
    // Add accessibility improvements
    enhanceAccessibility();
    
    // Add smooth scrolling to internal links
    addSmoothScrolling();
}

// Enable keyboard navigation for lessons
function enableKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Only if we're viewing a lesson
        if (document.getElementById('lesson-content-section').style.display !== 'block') return;
        
        const prevButton = document.getElementById('prev-lesson');
        const nextButton = document.getElementById('next-lesson');
        
        // Left arrow key - previous lesson
        if (e.key === 'ArrowLeft' && prevButton && prevButton.style.visibility !== 'hidden') {
            prevButton.click();
            e.preventDefault();
        }
        
        // Right arrow key - next lesson
        if (e.key === 'ArrowRight' && nextButton && nextButton.style.visibility !== 'hidden') {
            nextButton.click();
            e.preventDefault();
        }
        
        // ESC key - back to modules
        if (e.key === 'Escape') {
            const backButton = document.getElementById('back-to-modules');
            if (backButton) {
                backButton.click();
                e.preventDefault();
            }
        }
    });
}

// Enhance accessibility
function enhanceAccessibility() {
    // Add appropriate ARIA attributes
    const lessonBoxes = document.querySelectorAll('.lesson-box');
    lessonBoxes.forEach((box, index) => {
        box.setAttribute('role', 'button');
        box.setAttribute('aria-label', `Start lesson: ${box.querySelector('h4').textContent}`);
        box.setAttribute('tabindex', '0');
        
        // Allow keyboard activation
        box.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
                e.preventDefault();
            }
        });
    });
    
    // Make tab buttons more accessible
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        const moduleId = button.getAttribute('data-module');
        const moduleNum = moduleId.replace('module', '');
        
        button.setAttribute('aria-controls', `${moduleId}-content`);
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
        button.setAttribute('id', `tab-${moduleId}`);
        
        // Add role="tabpanel" to tab content
        const tabContent = document.getElementById(`${moduleId}-content`);
        if (tabContent) {
            tabContent.setAttribute('role', 'tabpanel');
            tabContent.setAttribute('aria-labelledby', `tab-${moduleId}`);
        }
        
        // Update aria-selected on click
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
            });
            this.setAttribute('aria-selected', 'true');
        });
    });
}

// Add smooth scrolling to internal links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Call init function when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize additional enhancements once the main script has run
    setTimeout(initAdditionalEnhancements, 100);
});</file_content_or_search_replace_blocks>
</invoke>