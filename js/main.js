/* ============================================
   CATS THROUGH TIME - Main JavaScript
   A 10,000 Year Journey
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        parallaxStrength: 0.3,
        animationThreshold: 0.15,
        progressUpdateInterval: 10,
        audioFadeTime: 500
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {
        progressBar: document.getElementById('progress-bar'),
        audioToggle: document.getElementById('audio-toggle'),
        ambientAudio: document.getElementById('ambient-audio'),
        navDots: document.querySelectorAll('.nav-dot'),
        sections: document.querySelectorAll('.section'),
        parallaxBgs: document.querySelectorAll('.parallax-bg'),
        animatedElements: document.querySelectorAll('.animate-fade-up, .animate-slide-up, .animate-slide-left'),
        lazyImages: document.querySelectorAll('img[data-src]')
    };

    // ============================================
    // STATE
    // ============================================
    const state = {
        isAudioPlaying: false,
        currentSection: 'hero',
        scrollY: 0,
        ticking: false
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Check if element is in viewport
    function isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold
        );
    }

    // ============================================
    // PROGRESS BAR
    // ============================================
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        if (elements.progressBar) {
            elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        elements.parallaxBgs.forEach(bg => {
            const section = bg.closest('.section');
            if (!section) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Only apply parallax when section is visible
            if (scrollTop + window.innerHeight > sectionTop && 
                scrollTop < sectionTop + sectionHeight) {
                const relativeScroll = scrollTop - sectionTop;
                const parallaxOffset = relativeScroll * CONFIG.parallaxStrength;
                bg.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
            }
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: CONFIG.animationThreshold
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    // animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    function initLazyLoading() {
        const imageObserverOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0
        };

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        // Create a new image to preload
                        const preloadImg = new Image();
                        preloadImg.onload = () => {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        };
                        preloadImg.onerror = () => {
                            // Fallback placeholder on error
                            img.src = 'https://placehold.co/800x600/1a1a1a/666666?text=Image+Unavailable';
                            img.removeAttribute('data-src');
                        };
                        preloadImg.src = src;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, imageObserverOptions);

        elements.lazyImages.forEach(img => {
            // Set placeholder while loading
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%231a1a1a" width="800" height="600"/%3E%3C/svg%3E';
            imageObserver.observe(img);
        });
    }

    // ============================================
    // NAVIGATION DOTS
    // ============================================
    function updateNavDots() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        let currentSectionId = 'hero';
        
        elements.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop - windowHeight / 2 &&
                scrollTop < sectionTop + sectionHeight - windowHeight / 2) {
                currentSectionId = section.id;
            }
        });
        
        if (currentSectionId !== state.currentSection) {
            state.currentSection = currentSectionId;
            
            elements.navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.dataset.section === currentSectionId) {
                    dot.classList.add('active');
                }
            });
        }
    }

    // Smooth scroll to section on dot click
    function initNavDotClicks() {
        elements.navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // AUDIO CONTROL
    // ============================================
    function initAudioControl() {
        if (!elements.audioToggle || !elements.ambientAudio) return;

        const audioOn = elements.audioToggle.querySelector('.audio-on');
        const audioOff = elements.audioToggle.querySelector('.audio-off');
        
        // Set initial volume
        elements.ambientAudio.volume = 0.3;

        elements.audioToggle.addEventListener('click', () => {
            if (state.isAudioPlaying) {
                // Fade out
                fadeAudio(elements.ambientAudio, 0, CONFIG.audioFadeTime, () => {
                    elements.ambientAudio.pause();
                });
                audioOn.classList.add('hidden');
                audioOff.classList.remove('hidden');
            } else {
                elements.ambientAudio.play().then(() => {
                    // Fade in
                    elements.ambientAudio.volume = 0;
                    fadeAudio(elements.ambientAudio, 0.3, CONFIG.audioFadeTime);
                }).catch(err => {
                    console.log('Audio playback failed:', err);
                });
                audioOn.classList.remove('hidden');
                audioOff.classList.add('hidden');
            }
            state.isAudioPlaying = !state.isAudioPlaying;
        });
    }

    function fadeAudio(audio, targetVolume, duration, callback) {
        const startVolume = audio.volume;
        const volumeDiff = targetVolume - startVolume;
        const steps = 20;
        const stepTime = duration / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, Math.min(1, startVolume + (volumeDiff * (currentStep / steps))));
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, stepTime);
    }

    // ============================================
    // SCROLL HANDLER
    // ============================================
    function onScroll() {
        state.scrollY = window.pageYOffset;
        
        if (!state.ticking) {
            window.requestAnimationFrame(() => {
                updateProgressBar();
                updateParallax();
                updateNavDots();
                state.ticking = false;
            });
            state.ticking = true;
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            const sections = Array.from(elements.sections);
            const currentIndex = sections.findIndex(s => s.id === state.currentSection);
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                const nextSection = sections[Math.min(currentIndex + 1, sections.length - 1)];
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                const prevSection = sections[Math.max(currentIndex - 1, 0)];
                if (prevSection) {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'Home') {
                e.preventDefault();
                sections[0].scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'End') {
                e.preventDefault();
                sections[sections.length - 1].scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'm' || e.key === 'M') {
                // Toggle audio with 'm' key
                if (elements.audioToggle) {
                    elements.audioToggle.click();
                }
            }
        });
    }

    // ============================================
    // TOUCH SUPPORT
    // ============================================
    function initTouchSupport() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            // We don't force section snapping on mobile for smoother experience
            // Just let natural scroll happen
        }
    }

    // ============================================
    // PRELOAD CRITICAL IMAGES
    // ============================================
    function preloadCriticalImages() {
        const criticalImages = [
            'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1920'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ============================================
    // PERFORMANCE MONITORING
    // ============================================
    function initPerformanceMonitoring() {
        // Log performance metrics in development
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    console.log(`Page load time: ${loadTime}ms`);
                }, 0);
            });
        }
    }

    // ============================================
    // RESIZE HANDLER
    // ============================================
    const handleResize = debounce(() => {
        // Recalculate parallax positions
        updateParallax();
        updateNavDots();
    }, 250);

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Preload critical assets
        preloadCriticalImages();
        
        // Initialize features
        initScrollAnimations();
        initLazyLoading();
        initNavDotClicks();
        initAudioControl();
        initKeyboardNav();
        initTouchSupport();
        
        // Set up scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Set up resize listener
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Initial updates
        updateProgressBar();
        updateNavDots();
        
        // Trigger initial animations for hero section
        setTimeout(() => {
            const heroAnimations = document.querySelectorAll('.hero-content .animate-fade-up');
            heroAnimations.forEach(el => el.classList.add('visible'));
        }, 100);
        
        // Performance monitoring
        initPerformanceMonitoring();
        
        console.log('Cats Through Time initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
