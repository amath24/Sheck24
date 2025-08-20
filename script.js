// === VARIABLES GLOBALES ===
let isMenuOpen = false;
let currentFilter = 'all';

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initPortfolioFilters();
    initContactForm();
    initSmoothScrolling();
    initScrollIndicator();
    initParticlesAnimation();
});

// === NAVIGATION ===
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const body = document.body;

    // Toggle menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fermer le menu lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Fermer le menu au redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Effet de scroll sur la navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mise à jour du lien actif selon la section visible
        updateActiveNavLink();
    });
}

// === MISE À JOUR DU LIEN ACTIF ===
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// === ANIMATIONS AU SCROLL ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Éléments à animer
    const elementsToAnimate = [
        '.about-text',
        '.about-image',
        '.service-card',
        '.portfolio-item',
        '.contact-info',
        '.contact-form',
        '.stat-item'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });

    // Animations spécifiques
    const leftElements = document.querySelectorAll('.about-text, .contact-info');
    leftElements.forEach(element => {
        element.classList.remove('fade-in');
        element.classList.add('slide-in-left');
    });

    const rightElements = document.querySelectorAll('.about-image, .contact-form');
    rightElements.forEach(element => {
        element.classList.remove('fade-in');
        element.classList.add('slide-in-right');
    });
}

// === FILTRES PORTFOLIO ===
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mise à jour du bouton actif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrage des éléments
            filterPortfolioItems(filter);
            currentFilter = filter;
        });
    });
}

function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            // Afficher l'élément avec animation
            setTimeout(() => {
                item.classList.remove('hidden');
                item.style.animationDelay = `${index * 0.1}s`;
            }, index * 50);
        } else {
            // Masquer l'élément
            item.classList.add('hidden');
        }
    });
}

// === FORMULAIRE DE CONTACT ===
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validation
        if (!validateForm(data)) {
            return;
        }
        
        // Simulation d'envoi
        simulateFormSubmission(data);
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Veuillez entrer une adresse email valide');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères');
    }
    
    if (errors.length > 0) {
        showNotification('Erreur: ' + errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(data) {
    // Affichage du message de chargement
    const submitButton = document.querySelector('.contact-form .btn-primary');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    
    // Simulation d'envoi (2 secondes)
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Réinitialisation du formulaire
        document.getElementById('contact-form').reset();
        
        // Message de succès
        showNotification('Message envoyé avec succès !', 'success');
    }, 2000);
}

// === SYSTÈME DE NOTIFICATIONS ===
function showNotification(message, type = 'info') {
    // Création de l'élément notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    
    // Couleurs selon le type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1',
        warning: '#f59e0b'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Ajout au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// === SCROLL FLUIDE ===
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === INDICATEUR DE SCROLL ===
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// === EFFETS PARALLAX ===
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// === GESTION DES ERREURS ===
window.addEventListener('error', function(e) {
    console.error('Erreur détectée:', e.error);
});

// === OPTIMISATION PERFORMANCE ===
// Throttle function pour optimiser les événements scroll
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Application du throttle aux événements scroll
const throttledScrollHandler = throttle(function() {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// === CHARGEMENT LAZY POUR LES IMAGES ===
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// === ANIMATIONS COMPLEXES ===
function initAdvancedAnimations() {
    // Animation des compteurs
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// === ACCESSIBILITÉ ===
function initAccessibility() {
    // Gestion du focus pour la navigation au clavier
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #6366f1';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// === PARTICULES ANIMÉES ===
function initParticlesAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    function animateParticle(particle) {
        // Position aléatoire de départ
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        // Direction aléatoire
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 100;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;
        
        // Animation
        particle.animate([
            { left: `${startX}px`, top: `${startY}px`, opacity: 0, transform: 'scale(1)' },
            { opacity: 1, offset: 0.1 },
            { opacity: 1, offset: 0.9 },
            { left: `${endX}px`, top: `${endY}px`, opacity: 0, transform: 'scale(0)' }
        ], {
            duration: 8000,
            easing: 'linear',
            iterations: Infinity
        });
    }
    
    // Animer chaque particule
    particles.forEach((particle, index) => {
        setTimeout(() => {
            animateParticle(particle);
            
            // Réanimer périodiquement
            setInterval(() => {
                animateParticle(particle);
            }, 8000);
        }, index * 1000); // Décalage pour chaque particule
    });
}

// === INITIALISATION COMPLÈTE ===
document.addEventListener('DOMContentLoaded', function() {
    initAdvancedAnimations();
    initLazyLoading();
    initAccessibility();
    initParticlesAnimation();
});