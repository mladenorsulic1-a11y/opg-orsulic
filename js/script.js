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

/* =================================================================
   LIGHTBOX FUNCTIONALITY
   ================================================================= */

let currentLightboxIndex = 0;
const lightboxImages = [
    { src: 'images/opg4.jpg', alt: 'Harvesting Mandarins' },
    { src: 'images/opg5.jpg', alt: 'Fresh Mandarin Harvest' },
    { src: 'images/opg6.jpg', alt: 'Mandarin Orchards' },
    { src: 'images/opg7.jpg', alt: 'Neretva Valley Farm' },
    { src: 'images/pic1.jpeg', alt: 'Orchard View 1' },
    { src: 'images/pic2.jpeg', alt: 'Orchard View 2' },
    { src: 'images/pic3.jpeg', alt: 'Orchard View 3' },
    { src: 'images/pic4.jpeg', alt: 'Orchard View 4' },
    { src: 'images/pic5.jpeg', alt: 'Orchard View 5' }
];

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    lightbox.classList.add('active');
    lightboxImg.src = lightboxImages[index].src;
    caption.textContent = lightboxImages[index].alt;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    caption.textContent = lightboxImages[currentLightboxIndex].alt;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeLightboxImage(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

/* =================================================================
   CUSTOM VIDEO PLAYER
   ================================================================= */

function playVideo(button) {
    const container = button.closest('.video-container');
    const video = container.querySelector('.custom-video');
    const overlay = container.querySelector('.video-overlay');
    
    if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        container.classList.add('playing');
    } else {
        video.pause();
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
        container.classList.remove('playing');
    }
}

// Auto hide overlay when video is playing
document.querySelectorAll('.custom-video').forEach(video => {
    video.addEventListener('play', function() {
        const container = this.closest('.video-container');
        const overlay = container.querySelector('.video-overlay');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        container.classList.add('playing');
    });
    
    video.addEventListener('pause', function() {
        const container = this.closest('.video-container');
        const overlay = container.querySelector('.video-overlay');
        if (!this.ended) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';
            container.classList.remove('playing');
        }
    });
    
    video.addEventListener('ended', function() {
        const container = this.closest('.video-container');
        const overlay = container.querySelector('.video-overlay');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
        container.classList.remove('playing');
    });
});

/* =================================================================
   SCROLL PROGRESS INDICATOR
   ================================================================= */

function updateScrollProgress() {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.prepend(scrollProgress);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
updateScrollProgress();

/* =================================================================
   LAZY LOADING IMAGES (Enhanced)
   ================================================================= */

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* =================================================================
   WHATSAPP FLOATING BUTTON
   ================================================================= */

function createWhatsAppButton() {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/385976017599';
    whatsappBtn.target = '_blank';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.innerHTML = '💬';
    whatsappBtn.title = 'Contact us on WhatsApp';
    document.body.appendChild(whatsappBtn);
    
    // Show button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            whatsappBtn.style.display = 'flex';
        } else {
            whatsappBtn.style.display = 'none';
        }
    });
}

// Initialize WhatsApp button
createWhatsAppButton();

/* =================================================================
   COUNTER ANIMATION (for statistics if needed)
   ================================================================= */

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/* =================================================================
   SMOOTH REVEAL ON SCROLL (Enhanced)
   ================================================================= */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
});

/* =================================================================
   COPY TO CLIPBOARD (for email/phone)
   ================================================================= */

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = currentLang === 'en' ? 'Copied!' : 'Kopirano!';
        element.style.color = '#4caf50';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '';
        }, 2000);
    });
}

/* =================================================================
   EASTER EGG - Konami Code
   ================================================================= */

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Easter egg activated!
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
        }, 1000);
        
        // Show fun message
        const msg = document.createElement('div');
        msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#ff9800;color:white;padding:2rem;border-radius:20px;font-size:2rem;z-index:99999;';
        msg.textContent = '🍊 Secret Mandarin Code Activated! 🍊';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
});

/* =================================================================
   PERFORMANCE MONITORING
   ================================================================= */

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`🍊 Page loaded in ${pageLoadTime}ms`);
    });
}

/* =================================================================
   INITIALIZE ALL FEATURES ON LOAD
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍊 All enhanced features initialized!');
    console.log('✅ Lightbox gallery');
    console.log('✅ Custom video player');
    console.log('✅ Scroll progress bar');
    console.log('✅ WhatsApp floating button');
    console.log('✅ Lazy loading images');
    console.log('✅ Easter egg activated (try Konami code!)');
});

console.log('🍊 OPG Oršulić Enhanced Website v2.0!');
