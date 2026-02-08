/* =================================================================
   OPG ORŠULIĆ — PREMIUM WEBSITE JAVASCRIPT
   ================================================================= */

// ── Language Switching ────────────────────────────────────────────
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('[data-en]').forEach(el => {
        const translation = el.getAttribute('data-' + lang);
        if (translation) {
            if (['A', 'BUTTON', 'SPAN'].includes(el.tagName)) {
                el.textContent = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });
    localStorage.setItem('preferredLanguage', lang);
}

window.addEventListener('load', function() {
    var savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'en') {
        var langBtn = document.querySelector('.lang-btn[onclick*="' + savedLang + '"]');
        if (langBtn) langBtn.click();
    }
});
// ── Gallery Slider ───────────────────────────────────────────────
var currentSlide = 0;
var slider = document.getElementById('gallerySlider');
var items = document.querySelectorAll('.gallery-item');
var dotsContainer = document.getElementById('galleryDots');
var totalSlides = items.length;

for (var i = 0; i < totalSlides; i++) {
    var dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.onclick = (function(idx) { return function() { goToSlide(idx); }; })(i);
    dotsContainer.appendChild(dot);
}

function updateDots() {
    document.querySelectorAll('.gallery-dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentSlide);
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
    if (!items.length) return;
    var isMobile = window.innerWidth <= 768;
    if (isMobile) {
        var container = slider.parentElement;
        var containerWidth = container.offsetWidth - 100;
        slider.style.transform = 'translateX(-' + (currentSlide * containerWidth) + 'px)';
    } else {
        var cWidth = slider.parentElement.offsetWidth - 140;
        var itemWidth = (cWidth - 48) / 3;
        var slideWidth = itemWidth + 24;
        slider.style.transform = 'translateX(-' + (currentSlide * slideWidth) + 'px)';
    }
    updateDots();
}

var resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateGallery, 250);
});
updateGallery();

// ── Mobile Menu ──────────────────────────────────────────────────
function toggleMobileMenu() {
    var navLinks = document.getElementById('navLinks');
    var toggle = document.querySelector('.mobile-menu-toggle');
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function() {
        document.getElementById('navLinks').classList.remove('active');
        document.querySelector('.mobile-menu-toggle').classList.remove('active');
    });
});
// ── Header Scroll Effect ─────────────────────────────────────────
window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var scrollY = window.pageYOffset;
    header.classList.toggle('scrolled', scrollY > 60);
    var scrollBtn = document.querySelector('.scroll-to-top');
    scrollBtn.classList.toggle('visible', scrollY > 400);
    var waBtn = document.querySelector('.whatsapp-float');
    if (waBtn) waBtn.classList.toggle('visible', scrollY > 400);
});

// ── Scroll Progress Bar ──────────────────────────────────────────
var scrollProgressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', function() {
    var winScroll = document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    scrollProgressBar.style.width = scrolled + '%';
});

// ── Scroll to Top ────────────────────────────────────────────────
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Scroll Animations (Intersection Observer) ────────────────────
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
});
// ── Smooth Scroll for Anchor Links ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            var headerOffset = 80;
            var elementPosition = target.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// ── Touch Swipe for Gallery ──────────────────────────────────────
var touchStartX = 0, touchEndX = 0;
slider.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
slider.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) moveGallery(diff > 0 ? 1 : -1);
}, { passive: true });

// ── Keyboard Navigation ──────────────────────────────────────────
document.addEventListener('keydown', function(e) {
    var lightbox = document.getElementById('lightbox');
    var isLightboxOpen = lightbox && lightbox.classList.contains('active');
    if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') changeLightboxImage(-1);
        else if (e.key === 'ArrowRight') changeLightboxImage(1);
        else if (e.key === 'Escape') closeLightbox();
    } else {
        if (e.key === 'ArrowLeft') moveGallery(-1);
        else if (e.key === 'ArrowRight') moveGallery(1);
    }
});
// ── Lightbox ─────────────────────────────────────────────────────
var currentLightboxIndex = 0;
var lightboxImages = [
    { src: 'images/duje.jpeg', alt: 'Duje na bazenu' },
    { src: 'images/duje.jpeg', alt: 'Duje ponovo' },
    { src: 'images/duje.jpeg', alt: 'Još jednom Duje' },
    { src: 'images/duje.jpeg', alt: 'I opet Duje' },
    { src: 'images/duje.jpeg', alt: 'Duje 5' },
    { src: 'images/duje.jpeg', alt: 'Duje 6' },
    { src: 'images/duje.jpeg', alt: 'Duje 7' },
    { src: 'images/duje.jpeg', alt: 'Duje 8' },
    { src: 'images/duje.jpeg', alt: 'Duje 9 - SVUGDJE!' }
];

function openLightbox(index) {
    currentLightboxIndex = index;
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var caption = document.getElementById('lightboxCaption');
    lightbox.classList.add('active');
    lightboxImg.src = lightboxImages[index].src;
    caption.textContent = lightboxImages[index].alt;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= lightboxImages.length) currentLightboxIndex = 0;
    else if (currentLightboxIndex < 0) currentLightboxIndex = lightboxImages.length - 1;
    document.getElementById('lightboxImg').src = lightboxImages[currentLightboxIndex].src;
    document.getElementById('lightboxCaption').textContent = lightboxImages[currentLightboxIndex].alt;
}
// ── WhatsApp Floating Button ─────────────────────────────────────
(function() {
    var btn = document.createElement('a');
    btn.href = 'https://wa.me/385976017599';
    btn.target = '_blank';
    btn.className = 'whatsapp-float';
    btn.innerHTML = '💬';
    btn.title = 'Contact us on WhatsApp';
    document.body.appendChild(btn);
})();

// ── Lazy Loading Images ──────────────────────────────────────────
if ('IntersectionObserver' in window) {
    var imageObserver = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
    });
}

// ── Easter Egg (Konami Code) ─────────────────────────────────────
var konamiCode = [];
var konamiPattern = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.transition = 'transform 1s';
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(function() { document.body.style.transform = 'rotate(0deg)'; }, 1000);
        var msg = document.createElement('div');
        msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#D4880F;color:white;padding:2rem 3rem;border-radius:16px;font-size:1.5rem;z-index:99999;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
        msg.textContent = '🍊 Secret Mandarin Code Activated! 🍊';
        document.body.appendChild(msg);
        setTimeout(function() { msg.remove(); }, 3000);
    }
});

console.log('🍊 OPG Oršulić Premium Website loaded!');
console.log('✅ All features initialized');