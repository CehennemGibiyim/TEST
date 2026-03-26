/**
 * Albion TR Tools - Main JavaScript
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    console.log('%c⚔️ Albion TR Tools', 'color: #D4AF37; font-size: 24px; font-weight: bold;');
    console.log('%cTürkiye için ❤️ ile yapıldı', 'color: #8b949e; font-size: 12px;');
    console.log('%chttps://github.com/CehennemGibiyim/TEST', 'color: #4169E1; font-size: 10px;');

    // Initialize all components
    initAnimations();
    initBackToTop();
    initStatCounters();
    initCopyButtons();
    initScrollEffects();

    // Scroll animations
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Back to top button
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Stat counter animation
    function initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.dataset.target);
                    animateCounter(target, finalValue);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }

    // Copy to clipboard
    function initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const textToCopy = this.dataset.copy;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
        });
    }

    // Scroll effects
    function initScrollEffects() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Utility functions
    window.AlbionTR = {
        formatPrice: function(price) {
            if (price >= 1000000000) return (price / 1000000000).toFixed(1) + 'G';
            if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
            if (price >= 1000) return (price / 1000).toFixed(1) + 'K';
            return price.toString();
        },

        formatDate: function(dateStr) {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (days === 0) return 'Bugün';
            if (days === 1) return 'Dün';
            if (days < 7) return `${days} gün önce`;
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        },

        debounce: function(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

});
