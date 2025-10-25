// Auto-Carousel Initialization for Lofis App Modal
// This script should be called after the Lofis modal content is loaded

function initLofisCarousels() {
    // Initialize wireframe carousel
    initAutoCarousel('wireframeCarousel', 'wireframeCounter');
    
    // Initialize hi-fi carousel
    initAutoCarousel('hifiCarousel', 'hifiCounter');
}

function initAutoCarousel(carouselId, counterId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) {
        console.log(`Carousel ${carouselId} not found`);
        return;
    }

    const cards = carousel.querySelectorAll('.deck-card');
    const counter = document.getElementById(counterId);
    
    if (cards.length === 0) {
        console.log(`No cards found in ${carouselId}`);
        return;
    }

    let currentIndex = 0;
    let intervalId;
    let touchStartX = 0;
    let touchEndX = 0;

    function showNextCard() {
        // Remove active class from current card
        cards[currentIndex].classList.remove('active');
        cards[currentIndex].classList.add('exiting');

        // Move to next card
        currentIndex = (currentIndex + 1) % cards.length;

        // Show next card after animation
        setTimeout(() => {
            // Remove exiting class from all cards
            cards.forEach(card => card.classList.remove('exiting'));
            
            // Add active class to new card
            cards[currentIndex].classList.add('active');
            
            // Update counter
            if (counter) {
                counter.textContent = currentIndex + 1;
            }
        }, 500);
    }

    function showPreviousCard() {
        // Remove active class from current card
        cards[currentIndex].classList.remove('active');
        cards[currentIndex].classList.add('exiting');

        // Move to previous card
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;

        // Show previous card after animation
        setTimeout(() => {
            // Remove exiting class from all cards
            cards.forEach(card => card.classList.remove('exiting'));
            
            // Add active class to new card
            cards[currentIndex].classList.add('active');
            
            // Update counter
            if (counter) {
                counter.textContent = currentIndex + 1;
            }
        }, 500);
    }

    // Start auto-sliding
    function startAutoSlide() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(showNextCard, 5000); // 1 second
    }

    // Stop auto-sliding
    function stopAutoSlide() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide(); // Pause auto-slide during swipe
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide(); // Resume auto-slide after swipe
    }

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left - go to next
            showNextCard();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right - go to previous
            showPreviousCard();
        }
    }

    // Add touch event listeners
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Start the carousel
    startAutoSlide();

    // Pause on hover (optional - desktop only)
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Store cleanup function
    carousel._cleanup = stopAutoSlide;
    
    console.log(`Carousel ${carouselId} initialized with ${cards.length} cards (auto-slide: 1s, swipe enabled)`);
}

// Clean up all carousels when modal closes
function cleanupCarousels() {
    ['wireframeCarousel', 'hifiCarousel'].forEach(id => {
        const carousel = document.getElementById(id);
        if (carousel && carousel._cleanup) {
            carousel._cleanup();
        }
    });
}

// Export for use in modal
window.initLofisCarousels = initLofisCarousels;
window.cleanupCarousels = cleanupCarousels;