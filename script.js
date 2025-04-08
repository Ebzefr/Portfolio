function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icons = document.querySelector(".ham-icons");
    menu.classList.toggle("open"); 
    icons.classList.toggle("open"); 

}

/* Swiper Initialization JavaScript */
// Swiper Initialization
document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper-container', {
        // Show 4 slides per view on desktop
        slidesPerView: 4,
        slidesPerGroup: 4, // Move in groups of 4
        spaceBetween: 20,
        
        // Enable loop
        loop: true,
        loopFillGroupWithBlank: true,
        
        // Responsive breakpoints
        breakpoints: {
            320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 10
            },
            640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 15
            },
            1024: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 20
            }
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Auto advance slides
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        
        // Ensure proper centering and clean transitions
        watchOverflow: true,
        centerInsufficientSlides: false,
        speed: 500,
        
        // Event handlers
        on: {
            init: function() {
                // Force update on initialization
                this.update();
            }
        }
    });
});