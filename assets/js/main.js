/**
 * EGYPTIAN EXPERIENCES - MAIN JAVASCRIPT
 * Interactive functionality for the tourist platform
 */

'use strict';

// ==========================================
// INITIALIZATION (concise grouping)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    [initNavbar, initHeroAnimations, initSearch, initExperienceFilters, initCounters, initBackToTop, initForms, initCarousels, initScrollAnimations, initTooltips].forEach(fn => fn());
});

// ==========================================
// NAVBAR FUNCTIONALITY
// ==========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
    document.addEventListener('click', event => {
        if (!navbar.contains(event.target) && navbarCollapse.classList.contains('show')) navbarToggler.click();
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!['#', '#loginModal', '#signupModal', '#becomeHostModal', '#bookingModal'].includes(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    if (navbarCollapse.classList.contains('show')) navbarToggler.click();
                }
            }
        });
    });
}

// ==========================================
// HERO ANIMATIONS & SCROLL INDICATOR
// ==========================================
function initHeroAnimations() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => input.setAttribute('min', today));
    document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
        document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
    });
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const location = document.getElementById('locationInput').value;
            const date = document.getElementById('dateInput').value;
            const category = document.getElementById('categorySelect').value;
            const submitBtn = searchForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Searching...';
            submitBtn.disabled = true;
            setTimeout(() => {
                filterExperiences(location, date, category);
                document.getElementById('experiences').scrollIntoView({ behavior: 'smooth' });
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('success', `Found experiences${location ? ' in ' + location : ''}!`);
            }, 1500);
        });
    }
}

function filterExperiences(location, date, category) {
    let cards = document.querySelectorAll('.experience-card');
    // Fallback to featured cards if generic cards do not exist
    const usingFeatured = cards.length === 0;
    if (usingFeatured) cards = document.querySelectorAll('.experience-featured-card');

    // Helper: get card title/description text safely
    const getText = (el, sel) => el.querySelector(sel)?.textContent?.toLowerCase() || '';

    // Infer categories for featured cards if not present
    if (usingFeatured) {
        cards.forEach(card => {
            if (!card.dataset.category) {
                const title = getText(card, '.experience-featured-title');
                // Simple mapping by keywords
                let inferred = '';
                if (/diving|red sea|dahab/.test(title)) inferred = 'water';
                else if (/balloon|luxor/.test(title)) inferred = 'adventure';
                else if (/bedouin|sinai|desert/.test(title)) inferred = 'desert';
                card.dataset.category = inferred; // may be empty if unknown
            }
        });
    }

    let visible = 0;
    cards.forEach(card => {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        const textBlob = usingFeatured
            ? (getText(card, '.experience-featured-title') + ' ' + getText(card, '.experience-featured-description'))
            : (card.querySelector('.card-text.text-muted')?.textContent?.toLowerCase() || '');

        let matches = true;
        if (location && !textBlob.includes(location.toLowerCase())) matches = false;
        if (category && cardCategory !== category) matches = false;

        card.style.display = matches ? 'block' : 'none';
        if (matches) visible++;
    });

    // Show message if no results (guard against missing grid container)
    const grid = document.getElementById('experiencesGrid') || document.querySelector('#experiences .row.g-4');
    let msg = document.getElementById('noResultsMessage');
    if (visible === 0) {
        if (!msg && grid) {
            msg = document.createElement('div');
            msg.id = 'noResultsMessage';
            msg.className = 'col-12 text-center py-5';
            msg.innerHTML = `<i class="bi bi-search" style="font-size: 4rem; color: #9ca3af;"></i>
                <h4 class="mt-3">No experiences found</h4>
                <p class="text-muted">Try adjusting your search filters</p>
                <button class="btn btn-primary mt-3" onclick="resetFilters()">Reset Filters</button>`;
            grid.appendChild(msg);
        }
    } else if (msg) {
        msg.remove();
    }
}

function resetFilters() {
    ['locationInput', 'dateInput', 'categorySelect'].forEach(id => document.getElementById(id).value = '');
    document.querySelectorAll('.experience-card').forEach(card => card.style.display = 'block');
    document.getElementById('noResultsMessage')?.remove();
    const btns = document.querySelectorAll('.category-filter .btn');
    btns.forEach(btn => btn.classList.remove('active'));
    btns[0]?.classList.add('active');
}

// ==========================================
// EXPERIENCE FILTERS
// ==========================================
function initExperienceFilters() {
    const filterButtons = document.querySelectorAll('.category-filter .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.experience-card').forEach(card => {
                card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? 'block' : 'none';
            });
        });
    });
}

// ==========================================
// COUNTER ANIMATIONS (unchanged, already concise)
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const animate = c => {
        const target = +c.getAttribute('data-target');
        const inc = target / (2000/16);
        let cur = 0;
        const upd = () => {
            cur += inc;
            if (cur < target) {
                c.textContent = Math.floor(cur) + '+';
                requestAnimationFrame(upd);
            } else {
                c.textContent = target + '+';
            }
        };
        upd();
    };
    const obs = new IntersectionObserver(es => es.forEach(entry => {if (entry.isIntersecting) {animate(entry.target);obs.unobserve(entry.target);}}), {threshold:0.5});
    counters.forEach(c => obs.observe(c));
}

// ==========================================
// BACK TO TOP
// ==========================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300));
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth'}));
    }
}

// ==========================================
// FORM HANDLERS (merged into less repetitive blocks)
// ==========================================
function initForms() {
    [
        {form:'loginForm', btnText:'Login', cb:()=>{showNotification('success','Welcome back! You are now logged in.');}},
        {form:'signupForm', btnText:'Sign Up', cb:()=>{showNotification('success','Account created successfully! Welcome aboard!');}},
        {form:'becomeHostForm', btnText:'Submit Application', cb:()=>{showNotification('success','Application submitted! We will review and contact you soon.');}},
        {form:'bookingForm', btnText:'Proceed to Payment', cb:()=>{showNotification('success','Booking confirmed! Check your email for details.');}},
        {form:'contactForm', btnText:'Send', cb:()=>{showNotification('success','Message sent! We will get back to you soon.');}},
    ].forEach(({form, cb}) => {
        const f = document.getElementById(form);
        if (!f) return;
        f.addEventListener('submit', function(e) {
            e.preventDefault();
            if(form==='signupForm'){
                const p = document.getElementById('signupPassword').value;
                const pc = document.getElementById('signupPasswordConfirm').value;
                if(p!==pc) {showNotification('error','Passwords do not match!'); return;}
            }
            const btn = f.querySelector('button[type="submit"]');
            const origText = btn.textContent;
            btn.innerHTML = '<span class="loading"></span> ' + origText+'...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = origText;
                btn.disabled = false;
                if(['loginForm','signupForm','becomeHostForm','bookingForm'].includes(form)){
                  const modal = bootstrap.Modal.getInstance(document.getElementById(form.replace('Form','Modal')));
                  modal?.hide();
                }
                cb();
                f.reset();
            }, form==='bookingForm'?2000:1500);
        });
        if(form==='bookingForm'){
            const guestsInput = document.getElementById('bookingGuests');
            guestsInput?.addEventListener('change',function () {
                const guests = parseInt(this.value);
                const price = 49;
                const totalInput = f.querySelector('input[readonly]');
                if (totalInput) totalInput.value = `$${guests * price}.00`;
            });
        }
    });
}

// ==========================================
// CAROUSELS
// ==========================================
function initCarousels() {
    const el = document.getElementById('testimonialsCarousel');
    if (el) new bootstrap.Carousel(el, {interval: 5000, wrap: true, keyboard: true});
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const els = document.querySelectorAll('.card, .how-it-works-card, .feature-item, .contact-info-card, .place-card, .why-card, .experience-featured-card, .testimonial-card-new, .cta-image-card');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s, transform 0.6s';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100 * i);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => obs.observe(el));
}

// ==========================================
// TOOLTIPS
// ==========================================
function initTooltips() {
    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .map(el => new bootstrap.Tooltip(el));
}

// ==========================================
// NOTIFICATION SYSTEM (minimal, reused)
// ==========================================
function showNotification(type, message) {
    const n = document.createElement('div');
    n.className = `alert alert-${type==='error'?'danger':type} notification-toast`;
    n.style.cssText = `position: fixed;top: 100px;right: 20px;z-index: 9999;min-width: 300px;animation: slideInRight 0.3s;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);`;
    let icon = '';
    switch(type){ case 'success':icon='<i class="bi bi-check-circle-fill me-2"></i>';break;case 'error':icon='<i class="bi bi-x-circle-fill me-2"></i>';break;case 'info':icon='<i class="bi bi-info-circle-fill me-2"></i>';break;default:icon='<i class="bi bi-bell-fill me-2"></i>';}
    n.innerHTML = `<div class="d-flex align-items-center">${icon}<span>${message}</span><button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
    document.body.appendChild(n);
    setTimeout(() => {n.style.animation='slideOutRight 0.3s';setTimeout(()=>n.remove(),300);}, 5000);
}

// Add CSS for notification animations (collapse to one-time setup)
if (!window._notifStyles) {
    const style = document.createElement('style');
    style.textContent = `@keyframes slideInRight{from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}
    @keyframes slideOutRight{from{transform:translateX(0);opacity:1;}to{transform:translateX(400px);opacity:0;}}
    .notification-toast{border-radius:0.5rem;border:none;}`;
    document.head.appendChild(style);window._notifStyles=1;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
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

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// ERROR HANDLING
// ==========================================

window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // In production, you might want to log this to an error tracking service
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c Egyptian Experiences ', 'background: linear-gradient(135deg, #2563eb, #10b981); color: white; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c Developed with ❤️ for tourists and hosts ', 'color: #2563eb; font-size: 14px;');

// ==========================================
// EXPORT FUNCTIONS (if using modules)
// ==========================================

// Expose functions to global scope for inline event handlers
window.resetFilters = resetFilters;
window.showNotification = showNotification;

