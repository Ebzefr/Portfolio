// Hamburger menu functionality
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('is-active');
            navMenu.classList.remove('active');
        }));

        // Project navigation function
        function openProject(projectId) {
            // Navigate to individual project HTML files
            const projectPages = {
                'clouddey': 'cloud.html',
                'portfolio': '', 
                'websecura': 'web.html',
                'app': 'lofis.html',
                'ecommerce': 'lofisweb.html',
                'analytics': 'job.html'
            };
            
            if (projectPages[projectId]) {
                window.location.href = projectPages[projectId];
            }
        }

        
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
        slidesPerView: 2,
        slidesPerGroup: 2,
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