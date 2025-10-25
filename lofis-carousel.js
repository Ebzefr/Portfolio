// Auto-Carousel Initialization for Lofis App Modal
// This script should be called after the Lofis modal content is loaded

function initLofisCarousels() {
    // Initialize wireframe carousel
    initSwipeCarousel('wireframeCarousel');
    
    // Initialize hi-fi carousel
    initSwipeCarousel('hifiCarousel');
}

function initSwipeCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) {
        console.log(`Carousel ${carouselId} not found`);
        return;
    }

    const cards = carousel.querySelectorAll('.deck-card');
    
    if (cards.length === 0) {
        console.log(`No cards found in ${carouselId}`);
        return;
    }

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    function showCard(index) {
        // Remove active class from all cards
        cards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to current card
        cards[index].classList.add('active');
        currentIndex = index;
    }

    function showNextCard() {
        const nextIndex = (currentIndex + 1) % cards.length;
        
        // Add exit animation to current card
        cards[currentIndex].classList.add('swipe-left');
        
        setTimeout(() => {
            cards[currentIndex].classList.remove('swipe-left');
            showCard(nextIndex);
        }, 300);
    }

    function showPreviousCard() {
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        
        // Add exit animation to current card
        cards[currentIndex].classList.add('swipe-right');
        
        setTimeout(() => {
            cards[currentIndex].classList.remove('swipe-right');
            showCard(prevIndex);
        }, 300);
    }

    // Touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        isDragging = true;
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        touchEndX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const diff = touchStartX - touchEndX;
        
        if (diff > swipeThreshold) {
            // Swiped left - go to next
            showNextCard();
        } else if (diff < -swipeThreshold) {
            // Swiped right - go to previous
            showPreviousCard();
        }
    }

    // Add touch event listeners
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse drag support for desktop testing
    carousel.addEventListener('mousedown', (e) => {
        touchStartX = e.screenX;
        isDragging = true;
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        touchEndX = e.screenX;
    });

    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        touchEndX = e.screenX;
        handleSwipe();
    });

    carousel.addEventListener('mouseleave', (e) => {
        if (isDragging) {
            isDragging = false;
        }
    });

    // Show first card initially
    showCard(0);
    
    console.log(`Swipe carousel ${carouselId} initialized with ${cards.length} cards`);
}

// Clean up all carousels when modal closes
function cleanupCarousels() {
    // No timers to clean up, just reset
    console.log('Carousels cleaned up');
}

// Export for use in modal
window.initLofisCarousels = initLofisCarousels;
window.cleanupCarousels = cleanupCarousels;