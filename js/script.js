/* =================================================================
   OPG ORŠULIĆ - JAVASCRIPT
   ================================================================= */

// Language Switching
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'SPAN') {
                element.textContent = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Load saved language preference
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        const langBtn = document.querySelector(`.lang-btn[onclick*="${savedLang}"]`);
        if (langBtn) langBtn.click();
    }
});

// Gallery Slider
let currentSlide = 0;
const slider = document.getElementById('gallerySlider');
const items = document.querySelectorAll('.gallery-item');
const dotsContainer = document.getElementById('galleryDots');
const totalSlides = items.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
}

function updateDots() {
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveGallery(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateGallery();
}

function goToSlide(index) {
    currentSlide = index;
    updateGallery();
}

function updateGallery() {
    if (items.length === 0) return;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: show one image at a time
        const slideWidth = items[0].offsetWidth + 32;
        slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    } else {
        // Desktop: show 3 images
        const containerWidth = slider.parentElement.offsetWidth - 140;
        const itemWidth = (containerWidth - 64) / 3;
        const slideWidth = itemWidth + 32;
        slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
    
    updateDots();
}

// Update gallery on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateGallery, 250);
});

// Initialize gallery
updateGallery();

// Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;
    
    header.classList.toggle('scrolled', currentScroll > 50);
    
    // Scroll to top button
    const scrollBtn = document.querySelector('.scroll-to-top');
    scrollBtn.classList.toggle('visible', currentScroll > 300);
    
    lastScroll = currentScroll;
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll Animation with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Touch swipe for gallery
let touchStartX = 0, touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        moveGallery(1); // Swipe left
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        moveGallery(-1); // Swipe right
    }
}

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveGallery(-1);
    } else if (e.key === 'ArrowRight') {
        moveGallery(1);
    }
});

console.log('🍊 OPG Oršulić website loaded successfully!');
