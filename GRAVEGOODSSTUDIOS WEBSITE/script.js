// Image Animation Controller
class ImageAnimator {
    constructor() {
        this.images = document.querySelectorAll('.image-card');
        this.isVisible = false;
        this.init();
    }

    init() {
        // Add intersection observer for scroll animations
        this.setupIntersectionObserver();
        
        // Add parallax effect on scroll
        this.setupParallaxEffect();
        
        // Add hover animations
        this.setupHoverAnimations();
        
        // Add floating animation
        this.setupFloatingAnimation();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isVisible) {
                    this.isVisible = true;
                    this.animateImagesSequence();
                }
            });
        }, options);

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    animateImagesSequence() {
        this.images.forEach((img, index) => {
            setTimeout(() => {
                img.style.opacity = '1';
                img.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    setupParallaxEffect() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        this.images.forEach((img, index) => {
            const speed = (index % 2 === 0) ? parallaxSpeed : parallaxSpeed * 1.5;
            const yPos = -(scrolled * speed);
            img.style.transform = `translateY(${yPos}px)`;
        });
    }

    setupHoverAnimations() {
        this.images.forEach(img => {
            img.addEventListener('mouseenter', (e) => {
                this.scaleImage(e.currentTarget, 1.05);
                this.addGlow(e.currentTarget);
            });

            img.addEventListener('mouseleave', (e) => {
                this.scaleImage(e.currentTarget, 1);
                this.removeGlow(e.currentTarget);
            });

            // Touch support for mobile
            img.addEventListener('touchstart', (e) => {
                this.scaleImage(e.currentTarget, 1.03);
            });

            img.addEventListener('touchend', (e) => {
                this.scaleImage(e.currentTarget, 1);
            });
        });
    }

    scaleImage(element, scale) {
        const currentTransform = element.style.transform;
        const translateY = currentTransform.match(/translateY\([^)]+\)/)?.[0] || 'translateY(0)';
        element.style.transform = `${translateY} scale(${scale})`;
    }

    addGlow(element) {
        element.style.boxShadow = '0 8px 30px rgba(88, 101, 242, 0.4)';
        element.style.transition = 'all 0.3s ease';
    }

    removeGlow(element) {
        element.style.boxShadow = 'none';
    }

    setupFloatingAnimation() {
        this.images.forEach((img, index) => {
            const delay = index * 0.2;
            const duration = 3 + (index % 3);
            
            img.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });

        // Add CSS animation if not exists
        if (!document.querySelector('#float-keyframes')) {
            const style = document.createElement('style');
            style.id = 'float-keyframes';
            style.textContent = `
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// CTA Button Animation
class ButtonAnimator {
    constructor() {
        this.button = document.querySelector('.cta-button');
        this.init();
    }

    init() {
        if (!this.button) return;

        this.button.addEventListener('mouseenter', () => {
            this.animateButton();
        });

        this.button.addEventListener('click', (e) => {
            this.createRipple(e);
        });
    }

    animateButton() {
        this.button.style.transform = 'translateY(-2px) scale(1.02)';
        setTimeout(() => {
            this.button.style.transform = 'translateY(-2px) scale(1)';
        }, 200);
    }

    createRipple(e) {
        const ripple = document.createElement('span');
        const rect = this.button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;

        if (!document.querySelector('#ripple-style')) {
            rippleStyle.id = 'ripple-style';
            document.head.appendChild(rippleStyle);
        }

        this.button.style.position = 'relative';
        this.button.style.overflow = 'hidden';
        this.button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Text Animation
class TextAnimator {
    constructor() {
        this.title = document.querySelector('.hero-title');
        this.description = document.querySelector('.hero-description');
        this.init();
    }

    init() {
        if (this.title) {
            this.animateTitle();
        }
        if (this.description) {
            this.animateDescription();
        }
    }

    animateTitle() {
        const text = this.title.textContent;
        this.title.textContent = '';
        this.title.style.opacity = '1';

        const lines = text.split('\n').filter(line => line.trim());
        
        lines.forEach((line, lineIndex) => {
            const lineSpan = document.createElement('div');
            lineSpan.style.opacity = '0';
            lineSpan.style.transform = 'translateX(-30px)';
            lineSpan.style.transition = 'all 0.6s ease-out';
            lineSpan.textContent = line.trim();
            this.title.appendChild(lineSpan);

            setTimeout(() => {
                lineSpan.style.opacity = '1';
                lineSpan.style.transform = 'translateX(0)';
            }, lineIndex * 150);
        });
    }

    animateDescription() {
        this.description.style.opacity = '0';
        this.description.style.transform = 'translateY(20px)';

        setTimeout(() => {
            this.description.style.transition = 'all 0.8s ease-out';
            this.description.style.opacity = '1';
            this.description.style.transform = 'translateY(0)';
        }, 600);
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.icon-btn:last-child');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.navMenu) return;

        this.menuBtn.addEventListener('click', () => {
            this.toggleMenu();
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        
        if (window.innerWidth <= 768) {
            if (this.navMenu.classList.contains('active')) {
                this.navMenu.style.display = 'flex';
                this.navMenu.style.flexDirection = 'column';
                this.navMenu.style.position = 'absolute';
                this.navMenu.style.top = '60px';
                this.navMenu.style.left = '0';
                this.navMenu.style.right = '0';
                this.navMenu.style.background = 'rgba(0, 0, 0, 0.98)';
                this.navMenu.style.padding = '2rem';
                this.navMenu.style.gap = '1.5rem';
            } else {
                this.navMenu.style.display = 'none';
            }
        }
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageAnimator();
    new ButtonAnimator();
    new TextAnimator();
    new SmoothScroll();
    new MobileMenu();
    new ServicesCarousel();
    new ContactForm();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// Add CSS for resize optimization
const resizeStyle = document.createElement('style');
resizeStyle.textContent = `
    .resize-animation-stopper * {
        animation: none !important;
        transition: none !important;
    }
`;
document.head.appendChild(resizeStyle);

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.messageDiv = document.getElementById('formMessage');
        
        if (!this.form) return;
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input animations
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            cell: document.getElementById('cell').value,
            message: document.getElementById('message').value
        };

        // Validate
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
            this.form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                this.hideMessage();
            }, 5000);
        }, 1500);

        // Actual implementation would be:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     this.showMessage('success', 'Message sent successfully!');
        //     this.form.reset();
        // })
        // .catch(error => {
        //     this.showMessage('error', 'Failed to send message. Please try again.');
        // })
        // .finally(() => {
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        // });
    }

    validateForm(data) {
        // Check if all fields are filled
        if (!data.name.trim() || !data.cell.trim() || !data.message.trim()) {
            this.showMessage('error', 'Please fill in all fields.');
            return false;
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.cell)) {
            this.showMessage('error', 'Please enter a valid cell number.');
            return false;
        }

        // Validate name (at least 2 characters)
        if (data.name.trim().length < 2) {
            this.showMessage('error', 'Please enter a valid name.');
            return false;
        }

        // Validate message (at least 10 characters)
        if (data.message.trim().length < 10) {
            this.showMessage('error', 'Please enter a message with at least 10 characters.');
            return false;
        }

        return true;
    }

    showMessage(type, message) {
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.textContent = message;
        this.messageDiv.style.display = 'block';
        
        // Animate in
        setTimeout(() => {
            this.messageDiv.style.opacity = '1';
            this.messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    hideMessage() {
        this.messageDiv.style.opacity = '0';
        this.messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            this.messageDiv.style.display = 'none';
        }, 300);
    }
}

// Services Carousel - Infinite Loop with Auto-scroll
class ServicesCarousel {
    constructor() {
        this.track = document.getElementById('image-track');
        if (!this.track) return;

        this.data = {
            mouseDownAt: 0,
            prevPosition: 0,
            position: 0,
            startDragPosition: 0,
            velocity: 0
        };
        
        this.autoScrollInterval = null;
        this.isUserInteracting = false;
        this.originalCards = [];
        this.isMobile = window.innerWidth <= 768;
        
        // Adjust speed based on device
        this.autoScrollSpeed = this.isMobile ? 0.3 : 0.5;
        
        this.init();
        this.cloneCards();
        this.startAutoScroll();
        this.setupResizeHandler();
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.autoScrollSpeed = this.isMobile ? 0.3 : 0.5;
                
                // Recalculate set width
                if (this.originalCards.length > 0) {
                    const cardWidth = this.originalCards[0].offsetWidth;
                    const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
                    this.setWidth = (cardWidth + gap) * this.originalCards.length;
                }
            }, 250);
        });
    }

    cloneCards() {
        // Store original cards
        this.originalCards = Array.from(this.track.querySelectorAll('.service-card'));
        
        // Clone cards multiple times for seamless loop
        const cloneCount = this.isMobile ? 4 : 3; // More clones on mobile for smoother experience
        
        for (let i = 0; i < cloneCount; i++) {
            this.originalCards.forEach(card => {
                const cloneBefore = card.cloneNode(true);
                const cloneAfter = card.cloneNode(true);
                this.track.insertBefore(cloneBefore, this.track.firstChild);
                this.track.appendChild(cloneAfter);
            });
        }
        
        // Calculate the width of one set of original cards
        const cardWidth = this.originalCards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
        this.setWidth = (cardWidth + gap) * this.originalCards.length;
        
        // Start from middle position
        this.data.position = -this.setWidth * cloneCount;
        this.track.style.transform = `translate(${this.data.position}px, -50%)`;
    }

    init() {
        // Mouse events
        window.addEventListener('mousedown', (e) => {
            if (this.track.contains(e.target)) {
                this.handleOnDown(e);
                this.stopAutoScroll();
                this.isUserInteracting = true;
            }
        });
        
        window.addEventListener('mouseup', () => {
            if (this.isUserInteracting) {
                this.handleOnUp();
                this.isUserInteracting = false;
                setTimeout(() => {
                    if (!this.isUserInteracting) {
                        this.startAutoScroll();
                    }
                }, this.isMobile ? 1500 : 2000);
            }
        });
        
        window.addEventListener('mousemove', (e) => this.handleOnMove(e));

        // Touch events for mobile with improved responsiveness
        window.addEventListener('touchstart', (e) => {
            if (this.track.contains(e.target)) {
                this.handleOnDown(e.touches[0]);
                this.stopAutoScroll();
                this.isUserInteracting = true;
                e.preventDefault(); // Prevent scrolling on touch
            }
        }, { passive: false });
        
        window.addEventListener('touchend', () => {
            if (this.isUserInteracting) {
                this.handleOnUp();
                this.isUserInteracting = false;
                setTimeout(() => {
                    if (!this.isUserInteracting) {
                        this.startAutoScroll();
                    }
                }, 1500);
            }
        });
        
        window.addEventListener('touchmove', (e) => {
            if (this.isUserInteracting) {
                this.handleOnMove(e.touches[0]);
                e.preventDefault(); // Prevent page scroll while dragging
            }
        }, { passive: false });

        // Pause on hover (desktop only)
        if (!this.isMobile) {
            this.track.addEventListener('mouseenter', () => {
                if (!this.isUserInteracting) {
                    this.stopAutoScroll();
                }
            });

            this.track.addEventListener('mouseleave', () => {
                if (!this.isUserInteracting) {
                    setTimeout(() => {
                        if (!this.isUserInteracting) {
                            this.startAutoScroll();
                        }
                    }, 1000);
                }
            });
        }
    }

    startAutoScroll() {
        this.stopAutoScroll();
        
        this.autoScrollInterval = setInterval(() => {
            this.data.position -= this.autoScrollSpeed;
            
            // Check if we need to loop
            this.checkLoop();
            
            // Update the track position
            this.track.style.transform = `translate(${this.data.position}px, -50%)`;
            this.data.prevPosition = this.data.position;
        }, 16); // ~60fps
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    checkLoop() {
        const cloneCount = this.isMobile ? 4 : 3;
        // If scrolled past the end, reset to beginning of loop
        if (this.data.position <= -this.setWidth * (cloneCount + 1)) {
            this.data.position += this.setWidth;
        }
        // If scrolled before the beginning, reset to end of loop
        else if (this.data.position >= -this.setWidth * (cloneCount - 1)) {
            this.data.position -= this.setWidth;
        }
    }

    handleOnDown(e) {
        this.data.mouseDownAt = e.clientX;
        this.data.startDragPosition = this.data.position;
        this.track.style.cursor = 'grabbing';
    }

    handleOnUp() {
        this.data.mouseDownAt = 0;
        this.data.prevPosition = this.data.position;
        this.track.style.cursor = 'grab';
    }

    handleOnMove(e) {
        if (this.data.mouseDownAt === 0) return;

        const mouseDelta = e.clientX - this.data.mouseDownAt;
        
        // Add slight resistance on mobile for better feel
        const resistance = this.isMobile ? 0.8 : 1;
        this.data.position = this.data.startDragPosition + (mouseDelta * resistance);
        
        // Check for loop during drag
        this.checkLoop();
        
        // Update position with smooth transition
        this.track.style.transition = 'none';
        this.track.style.transform = `translate(${this.data.position}px, -50%)`;
    }
}