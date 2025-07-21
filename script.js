/**
 * Creative Services Website - Main JavaScript File
 * Author: Creative Studio
 * Version: 1.0.0
 * Description: Comprehensive JavaScript for creative services website
 */

'use strict';

// Main App Object - Mengorganisir semua fungsi
const CreativeApp = {
    // Configuration
    config: {
        scrollThreshold: 100,
        animationDelay: 200,
        typingSpeed: 100,
        whatsappNumber: '6281234567890',
        instagramUsername: 'namakamu'
    },

    // Cache DOM elements
    elements: {},

    // Initialize app
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initAnimations();
        this.initComponents();
        this.showWelcomeMessage();
        console.log('🚀 Creative Services Website initialized successfully!');
    },

    // Cache frequently used DOM elements
    cacheElements() {
        this.elements = {
            // Navigation
            hamburger: document.querySelector('.hamburger'),
            navMenu: document.querySelector('.nav-menu'),
            navLinks: document.querySelectorAll('.nav-menu a'),
            header: document.querySelector('.header'),
            
            // Hero section
            hero: document.querySelector('.hero'),
            heroTitle: document.querySelector('.hero h1'),
            
            // Sections
            serviceCards: document.querySelectorAll('.service-card'),
            portfolioItems: document.querySelectorAll('.portfolio-item'),
            contactButtons: document.querySelectorAll('.contact-btn'),
            
            // Interactive elements
            backToTopBtn: document.getElementById('backToTop'),
            allButtons: document.querySelectorAll('.btn, .contact-btn'),
            
            // Animation elements
            animatedElements: document.querySelectorAll('.animate-on-scroll, .slide-left, .slide-right, .scale-in')
        };
    },

    // Bind all event listeners
    bindEvents() {
        // Navigation events
        this.elements.hamburger?.addEventListener('click', this.toggleMobileMenu.bind(this));
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));

        // Button events
        this.elements.backToTopBtn?.addEventListener('click', this.scrollToTop.bind(this));

        // Contact button events
        this.bindContactEvents();

        // Portfolio interaction events
        this.bindPortfolioEvents();

        // Service card events
        this.bindServiceCardEvents();

        // Window events
        window.addEventListener('load', this.handlePageLoad.bind(this));
        window.addEventListener('error', this.handleError.bind(this));

        // Touch events for mobile optimization
        if (this.isTouchDevice()) {
            this.bindTouchEvents();
        }
    },

    // Mobile menu toggle
    toggleMobileMenu() {
        const hamburger = this.elements.hamburger;
        const navMenu = this.elements.navMenu;
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open');
        
        // Close menu when clicking outside
        if (navMenu.classList.contains('active')) {
            document.addEventListener('click', this.closeMobileMenuOutside.bind(this));
        }
    },

    // Close mobile menu when clicking outside
    closeMobileMenuOutside(e) {
        const hamburger = this.elements.hamburger;
        const navMenu = this.elements.navMenu;
        
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.removeEventListener('click', this.closeMobileMenuOutside.bind(this));
        }
    },

    // Handle navigation clicks
    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollTo(href);
            this.closeMobileMenu();
        }
    },

    // Close mobile menu
    closeMobileMenu() {
        this.elements.hamburger.classList.remove('active');
        this.elements.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    },

    // Smooth scroll to element
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = this.elements.header.offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Handle scroll events
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        this.updateHeaderStyle(scrollY);
        this.updateBackToTopButton(scrollY);
        this.updateProgressBar(scrollY);
        this.handleParallaxEffect(scrollY);
        this.triggerScrollAnimations();
    },

    // Update header style on scroll
    updateHeaderStyle(scrollY) {
        const header = this.elements.header;
        
        if (scrollY > this.config.scrollThreshold) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            header.classList.add('scrolled');
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
            header.classList.remove('scrolled');
        }
    },

    // Update back to top button visibility
    updateBackToTopButton(scrollY) {
        const backToTopBtn = this.elements.backToTopBtn;
        
        if (scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    },

    // Update scroll progress bar
    updateProgressBar(scrollY) {
        if (!this.progressBar) return;
        
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrollY / documentHeight) * 100;
        this.progressBar.style.width = Math.min(scrollProgress, 100) + '%';
    },

    // Handle parallax effect
    handleParallaxEffect(scrollY) {
        const hero = this.elements.hero;
        if (hero && scrollY < window.innerHeight) {
            const rate = scrollY * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    },

    // Scroll to top functionality
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Handle window resize
    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Recalculate animations if needed
        this.triggerScrollAnimations();
    },

    // Initialize scroll animations
    initAnimations() {
        this.createScrollObserver();
        this.setupStaggeredAnimations();
        this.createProgressBar();
        this.createFloatingElements();
        this.initTypingEffect();
    },

    // Create intersection observer for scroll animations
    createScrollObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add special effects for specific elements
                    if (entry.target.classList.contains('service-card')) {
                        this.animateServiceCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('portfolio-item')) {
                        this.animatePortfolioItem(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        this.elements.animatedElements.forEach(el => {
            this.scrollObserver.observe(el);
        });
    },

    // Setup staggered animations
    setupStaggeredAnimations() {
        // Service cards staggered animation
        this.elements.serviceCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.2}s`;
        });

        // Portfolio items staggered animation
        this.elements.portfolioItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`;
        });
    },

    // Create progress bar
    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(this.progressBar);
    },

    // Create floating background elements
    createFloatingElements() {
        const hero = this.elements.hero;
        if (!hero) return;
        
        for (let i = 0; i < 8; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 80 + 40}px;
                height: ${Math.random() * 80 + 40}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float${i} ${Math.random() * 8 + 6}s ease-in-out infinite;
                pointer-events: none;
            `;
            hero.appendChild(element);
        }
        
        this.addFloatingAnimations();
    },

    // Add CSS animations for floating elements
    addFloatingAnimations() {
        let animations = '';
        for (let i = 0; i < 8; i++) {
            animations += `
                @keyframes float${i} {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) rotate(0deg); 
                    }
                    25% { 
                        transform: translateY(-${Math.random() * 30 + 10}px) translateX(${Math.random() * 20 - 10}px) rotate(90deg); 
                    }
                    50% { 
                        transform: translateY(-${Math.random() * 40 + 20}px) translateX(${Math.random() * 30 - 15}px) rotate(180deg); 
                    }
                    75% { 
                        transform: translateY(-${Math.random() * 20 + 5}px) translateX(${Math.random() * 20 - 10}px) rotate(270deg); 
                    }
                }
            `;
        }
        
        const style = document.createElement('style');
        style.textContent = animations;
        document.head.appendChild(style);
    },

    // Initialize typing effect for hero title
    initTypingEffect() {
        const heroTitle = this.elements.heroTitle;
        if (!heroTitle) return;
        
        const originalText = heroTitle.textContent;
        const words = originalText.split(' ');
        let wordIndex = 0;
        let charIndex = 0;
        
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';
        
        const typeWord = () => {
            if (wordIndex < words.length) {
                if (charIndex < words[wordIndex].length) {
                    heroTitle.textContent += words[wordIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWord, this.config.typingSpeed);
                } else {
                    heroTitle.textContent += ' ';
                    wordIndex++;
                    charIndex = 0;
                    setTimeout(typeWord, this.config.typingSpeed * 2);
                }
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWord, 2000);
    },

    // Bind contact button events
    bindContactEvents() {
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
        const instagramButtons = document.querySelectorAll('a[href*="instagram"]');
        
        whatsappButtons.forEach(btn => {
            btn.addEventListener('click', this.trackWhatsAppClick.bind(this));
        });
        
        instagramButtons.forEach(btn => {
            btn.addEventListener('click', this.trackInstagramClick.bind(this));
        });
    },

    // Track WhatsApp clicks
    trackWhatsAppClick(e) {
        console.log('WhatsApp button clicked');
        this.showNotification('Mengarahkan ke WhatsApp...', 'info');
        
        // Optional: Add analytics tracking here
        // gtag('event', 'click', { event_category: 'contact', event_label: 'whatsapp' });
    },

    // Track Instagram clicks
    trackInstagramClick(e) {
        console.log('Instagram button clicked');
        this.showNotification('Mengarahkan ke Instagram...', 'info');
        
        // Optional: Add analytics tracking here
        // gtag('event', 'click', { event_category: 'contact', event_label: 'instagram' });
    },

    // Bind portfolio interaction events
    bindPortfolioEvents() {
        this.elements.portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', this.handlePortfolioHover.bind(this));
            item.addEventListener('mouseleave', this.handlePortfolioLeave.bind(this));
            item.addEventListener('click', this.handlePortfolioClick.bind(this));
        });
    },

    // Handle portfolio hover
    handlePortfolioHover(e) {
        const item = e.currentTarget;
        item.style.transform = 'scale(1.08) rotateY(5deg)';
        item.style.zIndex = '10';
    },

    // Handle portfolio leave
    handlePortfolioLeave(e) {
        const item = e.currentTarget;
        item.style.transform = 'scale(1) rotateY(0deg)';
        item.style.zIndex = '1';
    },

    // Handle portfolio click
    handlePortfolioClick(e) {
        const item = e.currentTarget;
        const title = item.querySelector('.portfolio-overlay h4')?.textContent || 'Portfolio Item';
        
        this.showNotification(`Melihat detail: ${title}`, 'info');
        
        // Optional: Open lightbox or detailed view
        this.openPortfolioModal(item);
    },

    // Open portfolio modal (placeholder for future implementation)
    openPortfolioModal(item) {
        // This would open a modal with larger image and details
        console.log('Opening portfolio modal for:', item);
    },

    // Bind service card events
    bindServiceCardEvents() {
        this.elements.serviceCards.forEach(card => {
            card.addEventListener('mousemove', this.handleServiceCardTilt.bind(this));
            card.addEventListener('mouseleave', this.handleServiceCardReset.bind(this));
        });
    },

    // Handle service card tilt effect
    handleServiceCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        card.style.transition = 'none';
    },

    // Reset service card transform
    handleServiceCardReset(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'all 0.3s ease';
    },

    // Initialize additional components
    initComponents() {
        this.initCustomCursor();
        this.initPreloader();
        this.initKeyboardNavigation();
        this.initServiceCounters();
        this.setupLazyLoading();
    },

    // Initialize custom cursor
    initCustomCursor() {
        if (this.isTouchDevice()) return;
        
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(99, 102, 241, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
            display: none;
        `;
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', this.updateCursor.bind(this));
        document.addEventListener('mouseenter', () => this.cursor.style.display = 'block');
        document.addEventListener('mouseleave', () => this.cursor.style.display = 'none');
        
        // Enhanced cursor for interactive elements
        this.elements.allButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursor.style.background = 'rgba(99, 102, 241, 0.3)';
            });
            
            btn.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'rgba(99, 102, 241, 0.6)';
            });
        });
    },

    // Update cursor position
    updateCursor(e) {
        if (this.cursor) {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        }
    },

    // Initialize preloader
    initPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="spinner"></div>
                <div class="loading-text">Memuat Creative Services...</div>
            </div>
        `;
        
        const preloaderStyles = `
            .preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                transition: opacity 0.5s ease;
            }
            
            .preloader-content {
                text-align: center;
                color: white;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            .loading-text {
                font-size: 1.2rem;
                font-weight: 500;
                opacity: 0.9;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = preloaderStyles;
        document.head.appendChild(style);
        
        document.body.insertBefore(preloader, document.body.firstChild);
        
        // Remove preloader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 1500);
        });
    },

    // Initialize keyboard navigation
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.closeMobileMenu();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToTop();
                    break;
                case 'End':
                    e.preventDefault();
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                    break;
            }
        });
    },

    // Initialize service counters (animated numbers)
    initServiceCounters() {
        const stats = [
            { element: '.projects-count', target: 150, suffix: '+' },
            { element: '.clients-count', target: 80, suffix: '+' },
            { element: '.years-count', target: 5, suffix: '' }
        ];
        
        stats.forEach(stat => {
            const element = document.querySelector(stat.element);
            if (element) {
                this.animateCounter(element, stat.target, stat.suffix);
            }
        });
    },

    // Animate counter numbers
    animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current) + suffix;
            
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            }
        }, 30);
    },

    // Setup lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    // Bind touch events for mobile
    bindTouchEvents() {
        document.body.classList.add('touch-device');
        
        this.elements.serviceCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('touch-active');
                }, 300);
            });
        });
    },

    // Animate service card when it comes into view
    animateServiceCard(card) {
        const icon = card.querySelector('.service-icon');
        const title = card.querySelector('h3');
        const features = card.querySelectorAll('.service-features li');
        
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotate(360deg)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }, 600);
            }, 200);
        }
        
        if (title) {
            title.style.animation = 'fadeInUp 0.6s ease 0.3s both';
        }
        
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
            }, 400 + (index * 100));
        });
    },

    // Animate portfolio item when it comes into view
    animatePortfolioItem(item) {
        const overlay = item.querySelector('.portfolio-overlay');
        
        setTimeout(() => {
            item.style.transform = 'scale(1.05)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 300);
        }, 100);
    },

    // Trigger scroll animations manually
    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                el.classList.add('animated');
            }
        });
    },

    // Handle page load
    handlePageLoad() {
        document.body.style.opacity = '1';
        this.showWelcomeMessage();
        
        // Optional: Initialize any third-party plugins here
        // this.initPlugins();
    },

    // Handle JavaScript errors
    handleError(error) {
        console.error('Application error:', error);
        this.showNotification('Terjadi kesalahan. Silakan refresh halaman.', 'error');
    },

    // Show welcome message
    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('Selamat datang di Creative Services! 🎨', 'success');
        }, 3000);
    },

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${colors[type]};
            color: white;
            border-radius: 10px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    },

    // Utility: Check if device supports touch
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Utility: Throttle function calls
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Utility: Debounce function calls
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Clean up function (call before page unload if needed)
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Disconnect observers
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        
        // Clean up custom elements
        if (this.progressBar) {
            this.progressBar.remove();
        }
        
        if (this.cursor) {
            this.cursor.remove();
        }
        
        console.log('CreativeApp destroyed');
    }
};

// Advanced Features Module
const AdvancedFeatures = {
    // Initialize advanced features
    init() {
        this.initParticleSystem();
        this.initWaveAnimation();
        this.initGlowEffects();
        this.initScrollMagic();
    },

    // Particle system for hero background
    initParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.6;
        `;
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(canvas);
            this.startParticles(canvas);
        }
    },

    // Start particle animation
    startParticles