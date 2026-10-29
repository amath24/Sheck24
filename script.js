// ================================================================
// PORTFOLIO AMATH ALAIN SECK — SCRIPT.JS
// Inspiré fidèlement de sdley.netlify.app
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    initIntroLoader();
    initScrollReveal();
    initSidebar();
    initMobileMenu();
    initSmoothScroll();
    initActivitySlider();
    initLeafletMap();
    initContactForm();
    initCubeInteraction();
});

// ==================== 1. SIDEBAR ACTIVE LINK (INTERSECTION OBSERVER) ====================
function initSidebar() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sd-nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.id === 'nav-' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ==================== 2. MENU MOBILE ====================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.sd-mobile-link');

    if (!hamburger || !overlay) return;

    function toggleMenu() {
        const isOpen = overlay.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        overlay.style.display = isOpen ? 'flex' : 'none';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            overlay.classList.remove('open');
            hamburger.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// ==================== 3. SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = window.innerWidth <= 768 ? 60 : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== 4. SLIDER D'ACTIVITÉS (CAPTURE 184138) ====================
function initActivitySlider() {
    const slides = document.querySelectorAll('.sd-slide');
    const dots = document.querySelectorAll('.sd-slider-dots .dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayTimer = null;

    function showSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoPlay();
        });
    });

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    startAutoPlay();
}

// ==================== 5. CARTE LEAFLET DAKAR / KEUR MASSAR (CAPTURE 184036) ====================
function initLeafletMap() {
    const mapElement = document.getElementById('sdley-map');
    if (!mapElement || typeof L === 'undefined') return;

    // Coordonnées de Keur Massar / Dakar, Sénégal
    const lat = 14.7833;
    const lng = -17.3167;

    const map = L.map('sdley-map', {
        center: [lat, lng],
        zoom: 12,
        scrollWheelZoom: false
    });

    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marqueur personnalisé sur Keur Massar
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #041624;">
            <strong style="color: #0b2545;">Amath Alain SECK</strong><br>
            Développeur Fullstack &amp; Mobile<br>
            <span style="color: #e5b800; font-weight: 600;">Keur Massar, Dakar</span>
        </div>
    `).openPopup();
}

// ==================== 6. CUBE 3D INTERACTION ====================
function initCubeInteraction() {
    const cube = document.getElementById('tech-cube');
    if (!cube) return;

    let isHovered = false;
    cube.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    cube.addEventListener('mouseleave', () => {
        isHovered = false;
    });
}

// ==================== 7. FORMULAIRE DE CONTACT AVEC NOTIFICATION ====================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = document.getElementById('submit-btn');
        const originalText = btn.textContent;
        btn.textContent = 'ENVOI EN COURS...';
        btn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                showNotification('Message envoyé avec succès ! Je vous répondrai au plus vite.', 'success');
            } else {
                throw new Error('Erreur de transmission');
            }
        } catch (err) {
            showNotification('Erreur : Impossible d\'envoyer le message. Vous pouvez m\'écrire directement à amathalain2004@gmail.com', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.textContent = message;
    
    Object.assign(notif.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        padding: '14px 22px',
        borderRadius: '6px',
        background: type === 'success' ? '#ffd700' : '#ef4444',
        color: type === 'success' ? '#041624' : '#ffffff',
        fontWeight: '700',
        fontSize: '0.9rem',
        fontFamily: "'Inter', sans-serif",
        zIndex: '99999',
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease',
        maxWidth: '380px'
    });

    document.body.appendChild(notif);

    requestAnimationFrame(() => {
        notif.style.opacity = '1';
        notif.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(-20px)';
        setTimeout(() => notif.remove(), 300);
    }, 5000);
}

// ==================== 8. ANIMATION D'INTRODUCTION À L'ARRIVÉE ====================
function initIntroLoader() {
    const loader = document.getElementById('intro-loader');
    if (!loader) {
        document.body.classList.add('site-ready');
        return;
    }

    const triggerReveal = () => {
        // Ajoute la classe site-ready pour démarrer la cascade du Hero
        document.body.classList.add('site-ready');
        // Fade out du rideau d'introduction
        loader.classList.add('fade-out');

        setTimeout(() => {
            loader.style.display = 'none';
        }, 700);
    };

    // Laisse admirer le logo et la barre se remplir ~1 seconde
    setTimeout(triggerReveal, 1100);
}

// ==================== 9. ANIMATIONS AU DÉFILEMENT (SCROLL REVEAL) ====================
function initScrollReveal() {
    const selectors = [
        '.sd-page-title',
        '.sd-highlight-box',
        '.sd-services-header',
        '.sd-timeline-item',
        '.sd-cube-stage',
        '.sd-project-card',
        '.sd-service-card',
        '.sd-slider-wrapper',
        '.sd-contact-intro',
        '.sd-contact-form',
        '.sd-contact-map-side'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    // Fallback pour anciens navigateurs
    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -70px 0px',
        threshold: 0.12
    });

    elements.forEach(el => {
        el.classList.add('sd-reveal-item');

        // Échelonnage fluide en cascade pour les cartes de grilles
        if (el.classList.contains('sd-project-card') || el.classList.contains('sd-service-card')) {
            const siblings = Array.from(el.parentNode.children);
            const index = siblings.indexOf(el);
            const delay = (index % 3) * 0.12;
            el.style.transitionDelay = `${delay}s`;
        } else if (el.classList.contains('sd-timeline-item')) {
            const siblings = Array.from(el.parentNode.children);
            const index = siblings.indexOf(el);
            const delay = index * 0.1;
            el.style.transitionDelay = `${delay}s`;
        }

        revealObserver.observe(el);
    });
}
