// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = hamburger.classList.contains('is-active') ? 'hidden' : 'auto';
});

// Close menu when clicking on a mobile nav item
document.querySelectorAll('.mobile-nav-item, .mobile-menu-btn').forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Update active link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

//Profile Section Function
// Text rotation animation
const roles = [
    'FullStack Developer',
    'Data Analyst',
    'Cloud Specialist',
    'UX/UI Designer'
];

let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const rotatingText = document.querySelector('.rotating-text');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeEffect() {
    const currentRole = roles[currentRoleIndex];
    
    if (isDeleting) {
        // Remove characters
        rotatingText.textContent = currentRole.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            setTimeout(typeEffect, 500);
            return;
        }
    } else {
        // Add characters
        rotatingText.textContent = currentRole.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, pauseTime);
            return;
        }
    }
    
    setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
}

// Start the typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 500);
});


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

// Load projects data
let projectsData = null;

// Fetch projects.json on page load
fetch('projects.json')
    .then(response => response.json())
    .then(data => {
        projectsData = data;
    })
    .catch(error => console.error('Error loading projects:', error));

// Open project modal
function openProject(projectId) {
    if (!projectsData) {
        console.error('Projects data not loaded yet');
        return;
    }

    const project = projectsData.projects.find(p => p.id === projectId);
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    // Build modal content based on project type
    let modalHTML = '';

    if (projectId === 'analytics') {
        // UK Tech Jobs modal content
        modalHTML = buildAnalyticsModal(project);
    } else if (projectId === 'ecommerce') {
        // E-Commerce Dashboard modal content (uses same structure as analytics)
        modalHTML = buildAnalyticsModal(project);
    } else if (projectId === 'app') {
        // Lofis App modal content
        modalHTML = buildLofisModal(project);
    } else if (projectId === 'websecura') {
        // WebSecura modal content
        modalHTML = buildWebSecuraModal(project);
    }

    // Insert content and show modal
    document.getElementById('modalContent').innerHTML = modalHTML;
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Initialize auto-carousel for Lofis App after modal is shown
    if (projectId === 'app' && window.initLofisCarousels) {
        setTimeout(() => {
            window.initLofisCarousels();
        }, 200);
    }
}

// Close modal
function closeProjectModal() {
    // Cleanup carousels if they exist
    if (window.cleanupCarousels) {
        window.cleanupCarousels();
    }
    
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target == modal) {
        closeProjectModal();
    }
}

// Build UK Tech Jobs modal
function buildAnalyticsModal(project) {
    return `
        <section class="job-detail-section">
            <div class="job-header">
                <h1>${project.name}</h1>
                <div class="author-date">
                    <div class="author">${project.author}</div>
                    <div class="date">${project.date}</div>
                </div>
            </div>

            <div class="project-intro">
                <div class="project-text">
                    <p>${project.description}</p>
                    <br>
                    <p>${project.detailedDescription}</p>
                </div>
                <div class="project-cover">
                    <img src="${project.coverImage}" alt="${project.name}">
                </div>
            </div>

            <div class="project-sections">
                <div class="tech-stack">
                    <h2>Tech Stack</h2>
                    <div class="tech-grid">
                        ${project.techStack.map(tech => `
                            <div class="tech-icon">
                                <img src="${tech.icon}" alt="${tech.name}">
                                <p>${tech.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="problem-solution">
                    <h2>Problem</h2>
                    <ul>
                        ${project.problems.map(problem => `<li>${problem}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="goals">
                    <h2>Goals</h2>
                    <ul>
                        ${project.goals.map(goal => `<li>${goal}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </section>

        <section class="insight-section">
            <div class="insight-container">
                <h2>Insight and Results</h2>
                <p>This section highlights the core results of the analysis and gives a visual preview of the dashboard in action. You'll find key trends uncovered from the data, the challenges faced during development, and an interactive link to explore the project firsthand.</p>
                
                <h3>Dashboard</h3>
                <div class="dashboard">
                    <div class="dashboard-image">
                        <img src="${project.insights.dashboardImage}" alt="Dashboard">
                    </div>
                </div>
                
                <h3>Valuable Findings</h3>
                <div class="result-grid">
                    ${project.insights.findings.map(finding => `
                        <div class="result-icon">
                            <img src="${finding.icon}" alt="Finding">
                            <p>${finding.text}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="challenge-container">
                    <div class="challenges">
                        <h3>Challenges</h3>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="solutions">
                        <h3>Solution</h3>
                        <ul>
                            ${project.solutions.map(solution => `<li>${solution}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="button-container">
                    <a href="${project.links.live}" target="_blank" class="oval-button">Live Dashboard</a>
                    <a href="${project.links.github}" target="_blank" class="oval-button">GitHub</a>
                </div>
            </div>
        </section>
    `;
}

// Build Lofis App modal
function buildLofisModal(project) {
    return `
        <section class="project-detail-section">
            <div class="project-header">
                <h1>${project.name}</h1>
                <div class="author-date">
                    <div class="author">${project.author}</div>
                    <div class="date">${project.date}</div>
                </div>
            </div>

            <div class="project-intro">
                <div class="project-text">
                    <p>${project.description}</p>
                    <br>
                    <p>${project.detailedDescription}</p>
                </div>
                <div class="project-cover">
                    <img src="${project.coverImage}" alt="${project.name}">
                </div>
            </div>

            <div class="project-sections">
                <div class="tech-stack">
                    <h2>Tech Stack</h2>
                    <div class="tech-grid">
                        ${project.techStack.map(tech => `
                            <div class="tech-icon">
                                <img src="${tech.icon}" alt="${tech.name}">
                                <p>${tech.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="problem-solution">
                    <h2>Problems</h2>
                    <ul>
                        ${project.problems.map(problem => `<li>${problem}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="goals">
                    <h2>Goals</h2>
                    <ul>
                        ${project.goals.map(goal => `<li>${goal}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </section>

        <section class="research-section">
            <div class="research-container">
                <h2>Research</h2>
                <p>To design a user-centered restaurant app, I began with exploratory research to understand the needs, behaviors, and pain points of potential users. This included user surveys, persona development, and competitor analysis. Insights from this research guided key design decisions—ensuring the app supports a wide range of user needs.</p>
                
                <h3>Survey</h3>
                <div class="survey-grid">
                    ${project.research.surveyImages.map(img => `
                        <div class="survey-image">
                            <img src="${img}" alt="Survey">
                        </div>
                    `).join('')}
                </div>
                
                <h3>Personas</h3>
                <div class="personas-grid">
                    ${project.research.personaImages.map(img => `
                        <div class="persona-image">
                            <img src="${img}" alt="Persona">
                        </div>
                    `).join('')}
                </div>
                
                <div class="pain-solution-container">
                    <div class="pain-points">
                        <h3>Pain Points</h3>
                        <ul>
                            ${project.research.painPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="solution">
                        <h3>Solution</h3>
                        <ul>
                            ${project.research.solutions.map(solution => `<li>${solution}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <h3>User flow</h3>
                <div class="user-flow-container">
                    <div class="user-flow-image">
                        <img src="${project.research.userFlowImage}" alt="User Flow">
                    </div>
                </div>
            </div>
        </section>

        <section class="design-section">
            <div class="design-container">
                <h2>Design</h2>
                
                <h3>Wireframe</h3>
                <div class="wireframe-grid">
                    ${project.design.wireframes.map(img => `
                        <div class="wireframe-image">
                            <img src="${img}" alt="Wireframe">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Auto-Carousel for Mobile Wireframes -->
                <div class="card-deck-container" id="wireframeCarousel">
                    <div class="swipe-instruction">← Swipe to navigate →</div>
                    <div class="card-deck">
                        ${project.design.wireframes.map((img, index) => `
                            <div class="deck-card ${index === 0 ? 'active' : ''}">
                                <img src="${img}" alt="Wireframe ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <h3>Colour</h3>
                <div class="color-section">
                    <h4>Main Colors</h4>
                    <div class="color-palette">
                        ${project.design.colors.main.map(color => `
                            <div class="color-square" style="background-color: ${color};">${color}</div>
                        `).join('')}
                    </div>
                </div>
                <div class="color-section">
                    <h4>Neutral Colors</h4>
                    <div class="color-palette">
                        ${project.design.colors.neutral.map(color => `
                            <div class="color-square ${color === '#F4F4F4' || color === '#FFFFFF' ? 'light-text' : ''}" style="background-color: ${color};">${color}</div>
                        `).join('')}
                    </div>
                </div>
                
                <h3>Logo</h3>
                <div class="logo-container">
                    ${project.design.logoImages.map(img => `
                        <div class="logo-image">
                            <img src="${img}" alt="Logo">
                        </div>
                    `).join('')}
                </div>
                
                <h3>Hi-Fidelity Design</h3>
                <div class="hifi-grid">
                    ${project.design.hiFidelityScreens.map(img => `
                        <div class="hifi-image">
                            <img src="${img}" alt="Hi-Fi Design">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Auto-Carousel for Mobile Hi-Fi -->
                <div class="card-deck-container" id="hifiCarousel">
                    <div class="swipe-instruction">← Swipe to navigate →</div>
                    <div class="card-deck">
                        ${project.design.hiFidelityScreens.map((img, index) => `
                            <div class="deck-card ${index === 0 ? 'active' : ''}">
                                <img src="${img}" alt="Hi-Fi ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Build WebSecura modal
function buildWebSecuraModal(project) {
    return `
        <section class="web-detail-section">
            <div class="web-header">
                <h1>${project.name}</h1>
                <div class="author-date">
                    <div class="author">${project.author}</div>
                    <div class="date">${project.date}</div>
                </div>
            </div>

            <div class="project-intro">
                <div class="project-text">
                    <p>${project.description}</p>
                </div>
                <div class="project-cover">
                    <img src="${project.coverImage}" alt="${project.name}">
                </div>
            </div>

            <div class="project-sections">
                <div class="tech-stack">
                    <h2>Tech Stack</h2>
                    <div class="tech-grid">
                        ${project.techStack.map(tech => `
                            <div class="tech-icon">
                                <img src="${tech.icon}" alt="${tech.name}">
                                <p>${tech.name}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="problem-solution">
                    <h2>Problem</h2>
                    <ul>
                        ${project.problems.map(problem => `<li>${problem}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="goals">
                    <h2>Goals</h2>
                    <ul>
                        ${project.goals.map(goal => `<li>${goal}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </section>

        <section class="feature-section">
            <div class="feature-container">
                <h2>Features</h2>
                <p>This section highlights the core results of the analysis and gives a visual preview of the dashboard in action. You'll find key trends uncovered from the data, the challenges faced during development, and an interactive link to explore the project firsthand.</p>
                
                <h3>UI Display</h3>
                <div class="display">
                    <div class="display-image">
                        <img src="${project.features.displayImage}" alt="Display">
                    </div>
                </div>
                
                <h3>Key Functions</h3>
                <div class="function-grid">
                    ${project.features.keyFunctions.map(func => `
                        <div class="function-icon">
                            <img src="${func.icon}" alt="Function">
                            <p>${func.text}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="challenge-container">
                    <div class="challenges">
                        <h3>Challenges</h3>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="solutions">
                        <h3>Solution</h3>
                        <ul>
                            ${project.solutions.map(solution => `<li>${solution}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="button-container">
                    <a href="${project.links.live}" target="_blank" class="oval-button2">Live Preview</a>
                    <a href="${project.links.github}" target="_blank" class="oval-button2">GitHub</a>
                </div>
            </div>
        </section>
    `;
}

// Card Deck Functionality
function initCardDeck(deckId, counterId, images) {
    const deckContainer = document.getElementById(deckId);
    const counter = document.getElementById(counterId);
    
    if (!deckContainer || !images || images.length === 0) return;
    
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Create all cards
    images.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.className = 'deck-card';
        card.style.zIndex = images.length - index;
        card.innerHTML = `<img src="${imgSrc}" alt="Design ${index + 1}">`;
        
        if (index === 0) {
            card.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
        } else {
            card.style.transform = `translateX(0) translateY(${index * 3}px) rotate(0deg)`;
            card.style.opacity = '0.7';
        }
        
        deckContainer.appendChild(card);
    });
    
    const cards = deckContainer.querySelectorAll('.deck-card');
    
    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    function showNextCard() {
        if (currentIndex >= images.length - 1) return;
        
        const currentCard = cards[currentIndex];
        currentCard.classList.add('swiped-right');
        
        currentIndex++;
        updateCounter();
        
        // Update remaining cards
        for (let i = currentIndex; i < cards.length; i++) {
            const card = cards[i];
            const offset = (i - currentIndex) * 3;
            card.style.transform = `translateX(0) translateY(${offset}px) rotate(0deg)`;
            card.style.opacity = i === currentIndex ? '1' : '0.7';
        }
    }
    
    function showPrevCard() {
        if (currentIndex <= 0) return;
        
        currentIndex--;
        updateCounter();
        
        const currentCard = cards[currentIndex];
        currentCard.classList.remove('swiped-right', 'swiped-left');
        currentCard.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
        currentCard.style.opacity = '1';
        
        // Update remaining cards
        for (let i = currentIndex + 1; i < cards.length; i++) {
            const card = cards[i];
            const offset = (i - currentIndex) * 3;
            card.style.transform = `translateX(0) translateY(${offset}px) rotate(0deg)`;
            card.style.opacity = '0.7';
        }
    }
    
    // Touch and mouse events
    function handleStart(e) {
        if (currentIndex >= images.length) return;
        
        isDragging = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        cards[currentIndex].style.transition = 'none';
    }
    
    function handleMove(e) {
        if (!isDragging || currentIndex >= images.length) return;
        
        currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;
        const rotation = deltaX / 20;
        
        cards[currentIndex].style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    }
    
    function handleEnd(e) {
        if (!isDragging || currentIndex >= images.length) return;
        
        isDragging = false;
        const deltaX = currentX - startX;
        
        cards[currentIndex].style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        // Swipe threshold
        if (Math.abs(deltaX) > 100) {
            if (deltaX > 0) {
                // Swiped right - go to previous
                cards[currentIndex].style.transform = 'translateX(0) translateY(0) rotate(0deg)';
                showPrevCard();
            } else {
                // Swiped left - go to next
                showNextCard();
            }
        } else {
            // Return to position
            cards[currentIndex].style.transform = 'translateX(0) translateY(0) rotate(0deg)';
        }
        
        currentX = 0;
        startX = 0;
    }
    
    // Add event listeners to current card
    cards.forEach((card, index) => {
        card.addEventListener('touchstart', handleStart);
        card.addEventListener('touchmove', handleMove);
        card.addEventListener('touchend', handleEnd);
        
        card.addEventListener('mousedown', handleStart);
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseup', handleEnd);
        card.addEventListener('mouseleave', handleEnd);
    });
    
    updateCounter();
}

// Auto-carousel function for wireframes and hi-fi designs
function initAutoCarousel(carouselId, counterId, totalCards) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.deck-card');
    const counter = document.getElementById(counterId);
    let currentIndex = 0;
    let intervalId;

    function showNextCard() {
        // Remove active class from current card
        cards[currentIndex].classList.remove('active');
        cards[currentIndex].classList.add('exiting');

        // Move to next card
        currentIndex = (currentIndex + 1) % totalCards;

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
        }, 300);
    }

    // Start auto-sliding
    function startAutoSlide() {
        intervalId = setInterval(showNextCard, 5000); // 5 seconds
    }

    // Stop auto-sliding
    function stopAutoSlide() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }

    // Start the carousel
    startAutoSlide();

    // Pause on hover (optional)
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Clean up on modal close
    window.addEventListener('modalClosed', stopAutoSlide);
}

// Update close modal function to trigger cleanup
const originalCloseModal = closeProjectModal;
closeProjectModal = function() {
    window.dispatchEvent(new Event('modalClosed'));
    originalCloseModal();
};