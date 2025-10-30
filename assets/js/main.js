/**
 * EGYPTIAN EXPERIENCES - MAIN JAVASCRIPT
 * Interactive functionality for the tourist platform
 */

'use strict';

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initHeroAnimations();
    initSearch();
    initExperienceFilters();
    initWishlist();
    initCounters();
    initBackToTop();
    initForms();
    initCarousels();
    initScrollAnimations();
    initTooltips();
});

// ==========================================
// NAVBAR FUNCTIONALITY
// ==========================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navbar.contains(event.target);
        if (!isClickInside && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#loginModal' && href !== '#signupModal' && 
                href !== '#becomeHostModal' && href !== '#bookingModal') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            }
        });
    });
}

// ==========================================
// HERO ANIMATIONS
// ==========================================

function initHeroAnimations() {
    // Set minimum date to today for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const experiencesSection = document.getElementById('experiences');
            if (experiencesSection) {
                experiencesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
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
            
            // Show loading state
            const submitBtn = searchForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Searching...';
            submitBtn.disabled = true;
            
            // Simulate search (in real app, this would be an API call)
            setTimeout(() => {
                // Filter experiences
                filterExperiences(location, date, category);
                
                // Scroll to results
                const experiencesSection = document.getElementById('experiences');
                experiencesSection.scrollIntoView({ behavior: 'smooth' });
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show notification
                showNotification('success', `Found experiences${location ? ' in ' + location : ''}!`);
            }, 1500);
        });
    }
}

function filterExperiences(location, date, category) {
    const experienceCards = document.querySelectorAll('.experience-card');
    let visibleCount = 0;
    
    experienceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardLocation = card.querySelector('.card-text.text-muted').textContent.toLowerCase();
        
        let shouldShow = true;
        
        if (location && !cardLocation.includes(location.toLowerCase())) {
            shouldShow = false;
        }
        
        if (category && cardCategory !== category) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    const gridContainer = document.getElementById('experiencesGrid');
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'col-12 text-center py-5';
            noResultsMsg.innerHTML = `
                <i class="bi bi-search" style="font-size: 4rem; color: #9ca3af;"></i>
                <h4 class="mt-3">No experiences found</h4>
                <p class="text-muted">Try adjusting your search filters</p>
                <button class="btn btn-primary mt-3" onclick="resetFilters()">Reset Filters</button>
            `;
            gridContainer.appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function resetFilters() {
    document.getElementById('locationInput').value = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('categorySelect').value = '';
    
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.style.display = 'block';
    });
    
    const noResultsMsg = document.getElementById('noResultsMessage');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
    
    // Reset category filter buttons
    const filterButtons = document.querySelectorAll('.category-filter .btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons[0].classList.add('active');
}

// ==========================================
// EXPERIENCE FILTERS
// ==========================================

function initExperienceFilters() {
    const filterButtons = document.querySelectorAll('.category-filter .btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter experiences
            const filter = this.getAttribute('data-filter');
            const experienceCards = document.querySelectorAll('.experience-card');
            
            experienceCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==========================================
// WISHLIST FUNCTIONALITY
// ==========================================

function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Initialize wishlist state
    wishlistButtons.forEach(button => {
        const experienceId = button.getAttribute('data-id');
        if (wishlist.includes(experienceId)) {
            button.classList.add('active');
        }
    });
    
    // Toggle wishlist
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const experienceId = this.getAttribute('data-id');
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Remove from wishlist
                wishlist = wishlist.filter(id => id !== experienceId);
                this.classList.remove('active');
                showNotification('info', 'Removed from wishlist');
            } else {
                // Add to wishlist
                wishlist.push(experienceId);
                this.classList.add('active');
                showNotification('success', 'Added to wishlist');
            }
            
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Animate button
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// ==========================================
// COUNTER ANIMATIONS
// ==========================================

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================
// FORM HANDLERS
// ==========================================

function initForms() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Show loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
            submitBtn.disabled = true;
            
            // Simulate login (in real app, this would be an API call)
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
                
                // Show success message
                showNotification('success', 'Welcome back! You are now logged in.');
                
                // Reset form
                loginForm.reset();
            }, 1500);
        });
    }
    
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
            
            // Validate passwords match
            if (password !== passwordConfirm) {
                showNotification('error', 'Passwords do not match!');
                return;
            }
            
            // Show loading
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Creating account...';
            submitBtn.disabled = true;
            
            // Simulate signup
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
                modal.hide();
                
                // Show success message
                showNotification('success', 'Account created successfully! Welcome aboard!');
                
                // Reset form
                signupForm.reset();
            }, 1500);
        });
    }
    
    // Become Host Form
    const becomeHostForm = document.getElementById('becomeHostForm');
    if (becomeHostForm) {
        becomeHostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading
            const submitBtn = becomeHostForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('becomeHostModal'));
                modal.hide();
                
                // Show success message
                showNotification('success', 'Application submitted! We will review and contact you soon.');
                
                // Reset form
                becomeHostForm.reset();
            }, 1500);
        });
    }
    
    // Booking Form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;
            
            // Simulate booking
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
                modal.hide();
                
                // Show success message
                showNotification('success', 'Booking confirmed! Check your email for details.');
                
                // Reset form
                bookingForm.reset();
            }, 2000);
        });
        
        // Update total price based on guests
        const guestsInput = document.getElementById('bookingGuests');
        if (guestsInput) {
            guestsInput.addEventListener('change', function() {
                const guests = parseInt(this.value);
                const pricePerPerson = 49; // Default price
                const total = guests * pricePerPerson;
                const totalInput = bookingForm.querySelector('input[readonly]');
                if (totalInput) {
                    totalInput.value = `$${total}.00`;
                }
            });
        }
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('success', 'Message sent! We will get back to you soon.');
                
                // Reset form
                contactForm.reset();
            }, 1500);
        });
    }
}

// ==========================================
// CAROUSEL INITIALIZATION
// ==========================================

function initCarousels() {
    // Auto-play testimonials carousel
    const testimonialsCarousel = document.getElementById('testimonialsCarousel');
    if (testimonialsCarousel) {
        new bootstrap.Carousel(testimonialsCarousel, {
            interval: 5000,
            wrap: true,
            keyboard: true
        });
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .how-it-works-card, .feature-item, .contact-info-card, .place-card, .why-card, .experience-featured-card, .testimonial-card-new, .cta-image-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100 * index);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => observer.observe(element));
}

// ==========================================
// TOOLTIPS INITIALIZATION
// ==========================================

function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    `;
    
    // Set icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="bi bi-check-circle-fill me-2"></i>';
            break;
        case 'error':
            icon = '<i class="bi bi-x-circle-fill me-2"></i>';
            break;
        case 'info':
            icon = '<i class="bi bi-info-circle-fill me-2"></i>';
            break;
        default:
            icon = '<i class="bi bi-bell-fill me-2"></i>';
    }
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            ${icon}
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-toast {
        border-radius: 0.5rem;
        border: none;
    }
`;
document.head.appendChild(style);

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

