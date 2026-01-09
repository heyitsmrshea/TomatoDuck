/**
 * Tomato Duck - Enhanced Interactive Scripts
 * All 15 features implemented
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCustomCursor();
    initNavigation();
    initNetworkCanvas();
    initScrollEffects();
    initRevealAnimations();
    initCounterAnimations();
    initGalleryLightbox();
    initPricingCalculator();
    initTestimonialsCarousel();
    initContactForm();
    initCookieNotice();
    initPrivacyModal();
    initLiveStats();
});

/**
 * Loading Screen
 */
function initLoader() {
    const loader = document.getElementById('loader');
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 1800);
    });

    // Fallback: hide loader after 3s even if not fully loaded
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 3000);
}

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    // Only enable on devices with fine pointer (desktop)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.body.classList.add('no-cursor');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Cursor follows immediately
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower with easing
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .team-card, .case-card, .gallery-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    // Scroll effect for nav
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Animated Network Background Canvas
 */
function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animationId;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initNodes();
    }

    function initNodes() {
        nodes = [];
        const nodeCount = Math.floor((canvas.width * canvas.height) / 15000);

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.globalAlpha = 1 - (distance / 150);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        ctx.globalAlpha = 1;
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 107, 53, 0.6)';
            ctx.fill();

            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });

        animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', () => {
        resize();
    });

    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) draw();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });

    observer.observe(canvas);
}

/**
 * Scroll effects
 */
function initScrollEffects() {
    // Already handled in navigation smooth scroll
}

/**
 * Reveal animations on scroll
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.service-card, .team-card, .case-card, .why-feature, .gallery-item, .faq-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Counter animations for stats
 */
function initCounterAnimations() {
    const statValues = document.querySelectorAll('.stat-value[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Gallery Lightbox
 */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lightbox) return;

    const images = [
        { src: 'assets/gallery1.png', alt: 'Massive LAN party with hundreds of gamers' },
        { src: 'assets/gallery2.png', alt: 'Network server rack with organized cables' },
        { src: 'assets/gallery3.png', alt: 'Crew deploying network cables' },
        { src: 'assets/gallery4.png', alt: 'Esports tournament stage with crowd' }
    ];

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateImage() {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn?.addEventListener('click', closeLightbox);
    nextBtn?.addEventListener('click', nextImage);
    prevBtn?.addEventListener('click', prevImage);

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

/**
 * Pricing Calculator
 */
function initPricingCalculator() {
    const attendeeSlider = document.getElementById('attendee-count');
    const daysSlider = document.getElementById('event-days');
    const attendeeValue = document.getElementById('attendee-value');
    const daysValue = document.getElementById('days-value');
    const estimateAmount = document.getElementById('estimate-amount');
    const estimateLow = document.getElementById('estimate-low');
    const estimateHigh = document.getElementById('estimate-high');

    const checkboxes = {
        wired: document.getElementById('svc-wired'),
        wifi: document.getElementById('svc-wifi'),
        byoc: document.getElementById('svc-byoc'),
        esports: document.getElementById('svc-esports'),
        noc: document.getElementById('svc-noc')
    };

    if (!attendeeSlider) return;

    function calculateEstimate() {
        const attendees = parseInt(attendeeSlider.value);
        const days = parseInt(daysSlider.value);

        // Base cost per attendee per day
        let baseRate = 2; // $2 per attendee per day

        // Service multipliers
        let multiplier = 0;
        if (checkboxes.wired?.checked) multiplier += 1;
        if (checkboxes.wifi?.checked) multiplier += 0.8;
        if (checkboxes.byoc?.checked) multiplier += 1.5;
        if (checkboxes.esports?.checked) multiplier += 2;
        if (checkboxes.noc?.checked) multiplier += 0.5;

        multiplier = Math.max(multiplier, 1); // Minimum multiplier of 1

        // Calculate base estimate
        let estimate = attendees * days * baseRate * multiplier;

        // Add setup costs based on size
        if (attendees > 10000) estimate += 15000;
        else if (attendees > 5000) estimate += 10000;
        else if (attendees > 1000) estimate += 5000;
        else estimate += 2000;

        // Add daily NOC costs if selected
        if (checkboxes.noc?.checked) {
            estimate += days * 2000; // $2k per day for NOC
        }

        // Round to nearest 1000
        estimate = Math.round(estimate / 1000) * 1000;

        // Calculate range
        const low = Math.round(estimate * 0.8 / 1000) * 1000;
        const high = Math.round(estimate * 1.2 / 1000) * 1000;

        // Update display
        attendeeValue.textContent = attendees.toLocaleString();
        daysValue.textContent = days;
        estimateAmount.textContent = estimate.toLocaleString();
        estimateLow.textContent = low.toLocaleString();
        estimateHigh.textContent = high.toLocaleString();
    }

    // Attach event listeners
    attendeeSlider?.addEventListener('input', calculateEstimate);
    daysSlider?.addEventListener('input', calculateEstimate);

    Object.values(checkboxes).forEach(checkbox => {
        checkbox?.addEventListener('change', calculateEstimate);
    });

    // Initial calculation
    calculateEstimate();
}

/**
 * Testimonials Carousel
 */
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const cards = document.querySelectorAll('.testimonial-card');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index);
        });

        currentIndex = index;
    }

    function nextTestimonial() {
        showTestimonial((currentIndex + 1) % cards.length);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetAutoplay();
        });
    });

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Pause on hover
    track?.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track?.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('visible');
        });
        document.querySelectorAll('.form-group input').forEach(el => {
            el.classList.remove('error');
        });

        // Validate name
        if (!name.value.trim()) {
            showError('name', 'Name is required');
            isValid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }

        if (!isValid) return;

        // Get submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>Sending...</span>
        `;
        submitBtn.disabled = true;

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Message Sent!</span>
        `;
        submitBtn.style.background = 'var(--color-success)';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + '-error');

        field?.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

/**
 * Cookie Notice
 */
function initCookieNotice() {
    const notice = document.getElementById('cookie-notice');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (!notice) return;

    // Check if already responded
    if (localStorage.getItem('cookieConsent')) {
        notice.remove();
        return;
    }

    // Show notice after delay
    setTimeout(() => {
        notice.classList.add('visible');
    }, 2000);

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        notice.classList.remove('visible');
        setTimeout(() => notice.remove(), 300);
    });

    declineBtn?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        notice.classList.remove('visible');
        setTimeout(() => notice.remove(), 300);
    });
}

/**
 * Privacy Modal
 */
function initPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const openBtn = document.getElementById('privacy-link');
    const closeBtn = document.getElementById('privacy-close');

    if (!modal) return;

    openBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Live Stats Animation (simulated)
 */
function initLiveStats() {
    const connections = document.getElementById('live-connections');
    const bandwidth = document.getElementById('live-bandwidth');
    const latency = document.getElementById('live-latency');

    if (!connections) return;

    function updateStats() {
        // Simulate live fluctuations
        const baseConnections = 12847;
        const baseBandwidth = 18.4;
        const baseLatency = 0.8;

        connections.textContent = (baseConnections + Math.floor(Math.random() * 200 - 100)).toLocaleString();
        bandwidth.textContent = (baseBandwidth + (Math.random() * 2 - 1)).toFixed(1) + ' Gbps';
        latency.textContent = (baseLatency + (Math.random() * 0.2 - 0.1)).toFixed(1) + 'ms';
    }

    // Update every 3 seconds
    setInterval(updateStats, 3000);
}

// Add spinner animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
