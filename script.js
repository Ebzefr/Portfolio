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
                'portfolio': 'https://ebze.dev/', 
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

// Job details data
const jobDetails = {
    job1: {
        title: "Web Developer & IT Support-Unique and Partners Consults LLC (Remote)",
        period: "05/2025",
        responsibilities: [
            "Designed and deployed a fully responsive business website, improving client visibility and engagement",
            "Managed domain/email setup, DNS routing, and server configuration using cPanel.",
            "Provided technical consulting on automation tools and long-term IT strategy."
        ]
    },
    job2: {
        title: "Network Consultant(Freelance) - GLG (Gerson Lehrman Group)",
        period: "12/2024 - 05/2025",
        responsibilities: [
            "Provide expert insight on student management systems and education tech infrastructure, with a focus on UK universities.",
            "Participate in paid, compliance-regulated consultations with investment and equityfirms.",
            "Share strategic and technical perspectives on platforms like Technology One, supporting client decision-making."
        ]
        
    },
    job3: {
        title: "Student Ambassador (Digital Comms & Outreach) - University of Chester",
        period: "10/2022 - 07/2024",
        responsibilities: [
            "Supported international student outreach via Unibuddy, boosting global engagement.",
            "Created content and supported online campaigns for university events and open days.",
            "Promoted diversity and inclusion through on-campus representation and community events."
        ]
    },
    job4: {
        title: "Tech Support Assistant - Mextron Ltd",
        period: "10/2022 - 07/2024",
        responsibilities: [
            "Maintained software and hardware systems across teams.",
            "Documented technical operations and collaborated with engineers to improve IT infrastructure.",
            "Assisted in system installations, repairs, and upgrades."
        ]     
    }
};

function openModal(jobId) {
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modal-body');
    const job = jobDetails[jobId];
    
    modalBody.innerHTML = `
        <h4>${job.title}</h4>
        <p style="color: #666; font-style: italic; margin-bottom: 1.5rem;">${job.period}</p>
        
        <h5>Key Responsibilities:</h4>
        <ul>
            ${job.responsibilities.map(item => `<li>${item}</li>`).join('')}
        </ul>
        
       
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('jobModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('jobModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});