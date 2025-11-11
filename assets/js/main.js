'use strict';
// ==========================================
// INITIALIZATION (concise grouping)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  [initNavbar, initHeroAnimations, initSearch, initExperienceFilters, initCounters, initBackToTop, initForms, initCarousels, initScrollAnimations, initTooltips, initDataDrivenPages, initModalFromQuery].forEach(fn => fn());
}
);
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
  }
  );
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!['#', '#loginModal', '#signupModal', '#becomeHostModal', '#bookingModal'].includes(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo( {
            top: target.offsetTop - 80,
            behavior: 'smooth'
          }
          );
          if (navbarCollapse.classList.contains('show')) navbarToggler.click();
        }
      }
    }
    );
  }
  );
}
// ==========================================
// HERO ANIMATIONS & SCROLL INDICATOR
// ==========================================
function initHeroAnimations() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => input.setAttribute('min', today));
  document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.getElementById('experiences')?.scrollIntoView( {
      behavior: 'smooth'
    }
    );
  }
  );
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
        document.getElementById('experiences').scrollIntoView( {
          behavior: 'smooth'
        }
        );
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('success', `Found experiences${location ? ' in ' + location : ''}!`);
      }
      , 1500);
    }
    );
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
        card.dataset.category = inferred;
        // may be empty if unknown
      }
    }
    );
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
  }
  );
  // Show message if no results (guard against missing grid container)
  const grid = document.getElementById('experiencesGrid') || document.querySelector('#experiences .row.g-4');
  let msg = document.getElementById('noResultsMessage');
  if (visible === 0) {
    if (!msg && grid) {
      msg = document.createElement('div');
      msg.id = 'noResultsMessage';
      msg.className = 'col-12 text-center py-5';
      msg.innerHTML = `<i class="bi bi-search" style="font-size: 4rem;
      color: #9ca3af;
      "></i>
      <h4 class="mt-3">No experiences found</h4>
      <p class="text-muted">Try adjusting your search filters</p>
      <button class="btn btn-primary mt-3" onclick="resetFilters()">Reset Filters</button>`;
      grid.appendChild(msg);
    }
  }
  else if (msg) {
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
      }
      );
    }
    );
  }
  );
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
      }
      else {
        c.textContent = target + '+';
      }
    };
    upd();
  };
  const obs = new IntersectionObserver(es => es.forEach(entry => {
    if (entry.isIntersecting) {
      animate(entry.target);
      obs.unobserve(entry.target);
    }
  }
  ), {
    threshold:0.5
  }
  );
  counters.forEach(c => obs.observe(c));
}
// ==========================================
// BACK TO TOP
// ==========================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300));
    btn.addEventListener('click', () => window.scrollTo( {
      top: 0, behavior: 'smooth'
    }
    ));
  }
}
// ==========================================
// FORM HANDLERS (merged into less repetitive blocks)
// ==========================================
function initForms() {
  [ {
    form:'loginForm', btnText:'Login', cb:()=> {
      showNotification('success','Welcome back! You are now logged in.');
    }
  }
  , {
    form:'signupForm', btnText:'Sign Up', cb:()=> {
      showNotification('success','Account created successfully! Welcome aboard!');
    }
  }
  , {
    form:'becomeHostForm', btnText:'Submit Application', cb:()=> {
      showNotification('success','Application submitted! We will review and contact you soon.');
    }
  }
  , {
    form:'bookingForm', btnText:'Proceed to Payment', cb:()=> {
      showNotification('success','Booking confirmed! Check your email for details.');
    }
  }
  , {
    form:'contactForm', btnText:'Send', cb:()=> {
      showNotification('success','Message sent! We will get back to you soon.');
    }
  }
  ,
  ].forEach(( {
    form, cb
  }
  ) => {
    const f = document.getElementById(form);
    if (!f) return;
    f.addEventListener('submit', function(e) {
      e.preventDefault();
      if(form==='signupForm') {
        const p = document.getElementById('signupPassword').value;
        const pc = document.getElementById('signupPasswordConfirm').value;
        if(p!==pc) {
          showNotification('error','Passwords do not match!');
          return;
        }
      }
      const btn = f.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.innerHTML = '<span class="loading"></span> ' + origText+'...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        if(['loginForm','signupForm','becomeHostForm','bookingForm'].includes(form)) {
          const modal = bootstrap.Modal.getInstance(document.getElementById(form.replace('Form','Modal')));
          modal?.hide();
        }
        cb();
        f.reset();
      }
      , form==='bookingForm'?2000:1500);
    }
    );
    if(form==='bookingForm') {
      const guestsInput = document.getElementById('bookingGuests');
      guestsInput?.addEventListener('change',function () {
        const guests = parseInt(this.value);
        const price = 49;
        const totalInput = f.querySelector('input[readonly]');
        if (totalInput) totalInput.value = `$${guests * price}.00`;
      }
      );
    }
  }
  );
}
// ==========================================
// CAROUSELS
// ==========================================
function initCarousels() {
  const el = document.getElementById('testimonialsCarousel');
  if (el) new bootstrap.Carousel(el, {
    interval: 5000, wrap: true, keyboard: true
  }
  );
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
        }
        , 100 * i);
        obs.unobserve(entry.target);
      }
    }
    );
  }
  , {
    threshold: 0.1, rootMargin: '0px 0px -50px 0px'
  }
  );
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
  n.style.cssText = `position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideInRight 0.3s;
  box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);
  `;
  let icon = '';
  switch(type) {
    case 'success':icon='<i class="bi bi-check-circle-fill me-2"></i>';
    break;
    case 'error':icon='<i class="bi bi-x-circle-fill me-2"></i>';
    break;
    case 'info':icon='<i class="bi bi-info-circle-fill me-2"></i>';
    break;
    default:icon='<i class="bi bi-bell-fill me-2"></i>';
  }
  n.innerHTML = `<div class="d-flex align-items-center">${icon}<span>${message}</span><button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation='slideOutRight 0.3s';
    setTimeout(()=>n.remove(),300);
  }
  , 5000);
}
// Add CSS for notification animations (collapse to one-time setup)
if (!window._notifStyles) {
  const style = document.createElement('style');
  style.textContent = `@keyframes slideInRight {
    from {
      transform:translateX(400px);
      opacity:0;
    }
    to {
      transform:translateX(0);
      opacity:1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform:translateX(0);
      opacity:1;
    }
    to {
      transform:translateX(400px);
      opacity:0;
    }
  }
  .notification-toast {
    border-radius:0.5rem;
    border:none;
  }
  `;
  document.head.appendChild(style);
  window._notifStyles=1;
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
  }
  ).format(amount);
}
// Format date
function formatDate(dateString) {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric'
  };
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
    }
    );
  }
  );
  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// ERROR HANDLING
// ==========================================
window.addEventListener('error', function(e) {
  console.error('An error occurred:', e.error);
  // In production, you might want to log this to an error tracking service
}
);
// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c Egyptian Experiences ', 'background: linear-gradient(135deg, #2563eb, #10b981); color: white; font-size: 20px; padding: 10px; font-weight: bold;');
console.log(
  '%c Developed with ❤️ for tourists and hosts ',
  'color: #2563eb; font-size: 14px;'
);
window.resetFilters = resetFilters;
window.showNotification = showNotification;
function initModalFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const modalParam = params.get('modal');
  if (!modalParam) return;
  const map = {
    login:'loginModal', signup:'signupModal', host:'becomeHostModal'
  };
  const id = map[modalParam];
  if (!id) return;
  const el = document.getElementById(id);
  if (el && window.bootstrap?.Modal) {
    const m = new bootstrap.Modal(el);
    m.show();
  }
}
// ==========================================
// DATA-DRIVEN PAGES (stays/property/booking)
// ==========================================
function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}
// Local fallback data for file:// usage where fetch is blocked by the browser
const LOCAL_LISTINGS_FALLBACK = [
  {
    "id": "cairo-apartment",
    "title": "Modern Apartment with View",
    "location": "Cairo, Egypt",
    "beds": 2,
    "baths": 1,
    "guests": 3,
    "price": 189,
    "rating": 4.9,
    "images": ["assets/photos/cairo.png", "assets/photos/luxor.png", "assets/photos/aswan.png"],
    "amenities": ["WiFi", "Kitchen", "Air conditioning", "Parking"],
    "summary": "Bright modern apartment overlooking the Nile and the city skyline."
  },
  {
    "id": "alexandria-studio",
    "title": "Cozy Studio by the Sea",
    "location": "Alexandria, Egypt",
    "beds": 1,
    "baths": 1,
    "guests": 2,
    "price": 125,
    "rating": 4.7,
    "images": ["assets/photos/alexandria.png", "assets/photos/dahab.png"],
    "amenities": ["WiFi", "Kitchen", "Balcony"],
    "summary": "Charming studio steps from the Mediterranean with a sunny balcony."
  },
  {
    "id": "luxor-loft",
    "title": "Elegant Loft in Luxor",
    "location": "Luxor, Egypt",
    "beds": 3,
    "baths": 2,
    "guests": 5,
    "price": 275,
    "rating": 4.8,
    "images": ["assets/photos/luxor.png", "assets/photos/Hot Air Balloon over Luxor.png"],
    "amenities": ["WiFi", "AC"],
    "summary": "Stylish loft minutes from ancient temples with rooftop views."
  },
  {
    "id": "aswan-nile-flat",
    "title": "Nile View Flat",
    "location": "Aswan, Egypt",
    "beds": 2,
    "baths": 1,
    "guests": 4,
    "price": 165,
    "rating": 4.6,
    "images": ["assets/photos/aswan.png"],
    "amenities": ["WiFi", "Balcony"],
    "summary": "Relaxing flat with sweeping Nile views and nearby felucca rides."
  },
  {
    "id": "dahab-penthouse",
    "title": "Luxury Penthouse with Terrace",
    "location": "Dahab, Egypt",
    "beds": 4,
    "baths": 3,
    "guests": 7,
    "price": 450,
    "rating": 5.0,
    "images": ["assets/photos/dahab.png", "assets/photos/Red Sea Diving in Dahab.png"],
    "amenities": ["WiFi", "Pool", "Parking"],
    "summary": "High-end penthouse with panoramic Red Sea terrace and private pool."
  },
  {
    "id": "siwa-bohemian",
    "title": "Artistic Bohemian Space",
    "location": "Siwa Oasis, Egypt",
    "beds": 1,
    "baths": 1,
    "guests": 2,
    "price": 135,
    "rating": 4.5,
    "images": ["assets/photos/siwa.png"],
    "amenities": ["WiFi", "Kitchen"],
    "summary": "Cozy boho home near palm groves and salt lakes—perfect for unplugging."
  }
];
async function fetchListings() {
  try {
    // If opened directly as a file, use the embedded fallback
    if (location.protocol === 'file:') {
      return LOCAL_LISTINGS_FALLBACK;
    }
    const res = await fetch('assets/data/listings.json', {
      cache: 'no-cache'
    }
    );
    if (!res.ok) throw new Error('Failed to load listings');
    return await res.json();
  }
  catch (e) {
    console.error(e);
    showNotification('error', 'Unable to load listings right now. Using offline data.');
    return LOCAL_LISTINGS_FALLBACK;
  }
}
function cardHtml(listing) {
  const img = listing.images?.[0] || 'assets/photos/cairo.png';
  return `
  <div class="col-md-6 col-xl-4">
  <a class="text-decoration-none text-reset" href="property.html?id=${encodeURIComponent(listing.id)}">
  <div class="experience-featured-card h-100">
  <div class="experience-featured-image">
  <img src="${img}" alt="${listing.title}" loading="lazy">
  </div>
  <div class="experience-featured-content">
  <h4 class="experience-featured-title mb-1">${listing.title}</h4>
  <p class="experience-featured-description mb-2 small text-muted">${listing.beds} beds · ${listing.baths} bath · ${listing.amenities?.slice(0,2).join(' · ') || ''}</p>
  <div class="experience-featured-footer">
  <span class="experience-featured-price">${formatCurrency(listing.price)}</span>
  <span class="btn-book-now">View</span>
  </div>
  </div>
  </div>
  </a>
  </div>
  `.trim();
}
async function renderListingsInStays() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  const listings = await fetchListings();
  window._allListings = listings;
  window._currentView = 'grid';
  applyStaysFiltersAndRender();
}
// Render featured experiences on home page using same listings source
async function renderFeaturedOnHome() {
  const grid = document.getElementById('experiencesGridHome');
  if (!grid) return;
  const listings = await fetchListings();
  // Choose top rated 3 as featured for consistency
  const featured = [...listings].sort((a,b)=>b.rating-a.rating).slice(0,3);
  grid.innerHTML = featured.map(cardHtml).join('');
}
function inferPropertyType(listing) {
  if (listing.beds >= 2) return 'entire';
  if (listing.beds === 1) return 'private';
  return 'shared';
}
function getStaysFiltersFromUI() {
  const where = (document.querySelector('input[name="where"]')?.value || '').trim().toLowerCase();
  const typeSelect = (document.querySelector('select[name="type"]')?.value || '').toLowerCase();
  const priceMin = parseInt((document.getElementById('priceMin')?.value || '0').replace(/[^0-9]/g,'')) || 0;
  const priceMax = parseInt((document.getElementById('priceMax')?.value || '100000').replace(/[^0-9]/g,'')) || 100000;
  const priceRange = parseInt(document.getElementById('priceRange')?.value || '0',10);
  const propEntire = document.getElementById('entirePlace')?.checked;
  const propPrivate = document.getElementById('privateRoom')?.checked;
  const propShared = document.getElementById('sharedRoom')?.checked;
  const amenities = ['wifi','kitchen','ac','parking','pool'].filter(id => document.getElementById(id)?.checked);
  let ratingMin = 0;
  if (document.getElementById('fourFive')?.checked) ratingMin = 4.5;
  else if (document.getElementById('four')?.checked) ratingMin = 4.0;
  const sortBy = document.getElementById('sortBy')?.value || 'recommended';
  return {
    where, typeSelect, priceMin, priceMax, priceRange, propEntire, propPrivate, propShared, amenities, ratingMin, sortBy
  };
}
function listingMatchesFilters(listing, f) {
  const titleLoc = `${listing.title} ${listing.location}`.toLowerCase();
  if (f.where && !titleLoc.includes(f.where)) return false;
  if (listing.price < Math.max(f.priceMin, 0)) return false;
  if (listing.price > Math.min(f.priceMax, f.priceRange || Infinity)) return false;
  const t = inferPropertyType(listing);
  if (!((f.propEntire && t==='entire') || (f.propPrivate && t==='private') || (f.propShared && t==='shared') || (!f.propEntire && !f.propPrivate && !f.propShared))) return false;
  if (f.amenities.length) {
    const a = (listing.amenities||[]).map(s=>s.toLowerCase());
    const ok = f.amenities.every(x => a.some(v=>v.includes(x)));
    if (!ok) return false;
  }
  if (listing.rating < f.ratingMin) return false;
  // typeSelect from top bar is abstract categories;
  return true;
}
function sortListings(list, key) {
  if (key === 'price-asc') return list.sort((a,b)=>a.price-b.price);
  if (key === 'price-desc') return list.sort((a,b)=>b.price-a.price);
  if (key === 'rating-desc') return list.sort((a,b)=>b.rating-a.rating);
  return list;
  // recommended: original order
}
function listItemHtml(listing) {
  const img = listing.images?.[0] || 'assets/photos/cairo.png';
  return `
  <a href="property.html?id=${encodeURIComponent(listing.id)}" class="list-group-item list-group-item-action py-3">
  <div class="d-flex w-100 align-items-center">
  <img src="${img}" class="rounded me-3" style="width:92px;
  height:72px;
  object-fit:cover;
  " alt="${listing.title}">
  <div class="flex-grow-1">
  <div class="d-flex justify-content-between">
  <h6 class="mb-1">${listing.title}</h6>
  <small class="text-muted">${formatCurrency(listing.price)} /night</small>
  </div>
  <small class="text-muted">${listing.location} · ${listing.beds} beds · ★ ${listing.baths} bath · ${listing.rating.toFixed(1)}</small>
  </div>
  </div>
  </a>`;
}
function renderListingsToView(list) {
  const grid = document.getElementById('listingsGrid');
  const listEl = document.getElementById('listingsList');
  const mapView = document.getElementById('mapView');
  if (!grid) return;
  const view = window._currentView || 'grid';
  if (view==='grid') {
    grid.style.display='flex';
    listEl.style.display='none';
    mapView.style.display='none';
    grid.innerHTML = list.map(cardHtml).join('');
  }
  else if (view==='list') {
    grid.style.display='none';
    listEl.style.display='block';
    mapView.style.display='none';
    listEl.innerHTML = list.map(listItemHtml).join('');
  }
  else {
    grid.style.display='none';
    listEl.style.display='none';
    mapView.style.display='block';
    mapView.querySelector('h5')?.scrollIntoView( {
      behavior:'smooth',block:'center'
    }
    );
  }
}
function applyStaysFiltersAndRender() {
  const all = window._allListings || [];
  const f = getStaysFiltersFromUI();
  let filtered = all.filter(l => listingMatchesFilters(l,f));
  filtered = sortListings(filtered, f.sortBy);
  renderListingsToView(filtered);
}
// Event bindings for stays page
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('listingsGrid')) return;
  const reapply = debounce(applyStaysFiltersAndRender, 150);
  ['priceMin','priceMax','priceRange','entirePlace','privateRoom','sharedRoom','wifi','kitchen','ac','parking','pool','four','fourFive','any','sortBy']
  .forEach(id => document.getElementById(id)?.addEventListener('input', reapply));
  document.querySelector('form[action="stays.html"]')?.addEventListener('submit', e => {
    e.preventDefault();
    applyStaysFiltersAndRender();
  }
  );
  document.getElementById('clearFilters')?.addEventListener('click', (e)=> {
    e.preventDefault();
    ['priceMin','priceMax'].forEach(id=> {
      const el=document.getElementById(id);
      if(el) el.value='';
    }
    );
    const pr=document.getElementById('priceRange');
    if(pr) pr.value=200;
    ['entirePlace','privateRoom','sharedRoom','wifi','kitchen','ac','parking','pool'].forEach(id=> {
      const el=document.getElementById(id);
      if(el) el.checked=false;
    }
    );
    document.getElementById('any')?.click();
    applyStaysFiltersAndRender();
  }
  );
  // View toggles
  [['viewGrid','grid'],['viewList','list'],['viewMap','map']].forEach(([id,view])=> {
    document.getElementById(id)?.addEventListener('click', ()=> {
      window._currentView = view;
      ['viewGrid','viewList','viewMap'].forEach(btnId=>document.getElementById(btnId)?.classList.remove('active'));
      document.getElementById(id)?.classList.add('active');
      applyStaysFiltersAndRender();
    }
    );
  }
  );
}
);
async function populatePropertyPage() {
  const id = getQueryParam('id');
  const titleEl = document.getElementById('propTitle');
  if (!titleEl) return;
  // not on property page
  const listings = await fetchListings();
  const item = listings.find(l => l.id === id) || listings[0];
  // Title and meta
  titleEl.textContent = item.title;
  document.getElementById('propRating').innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i>${item.rating.toFixed(1)}`;
  document.getElementById('propLocation').innerHTML = `<i class="bi bi-geo-alt me-1"></i>${item.location}`;
  document.getElementById('propHosted').textContent = 'Entire place hosted by Local Superhost';
  document.getElementById('propMeta').textContent = `${item.guests} guests • ${item.beds} bedrooms • ${item.baths} baths`;
  document.getElementById('propSummary').textContent = item.summary || '';
  document.getElementById('propPrice').textContent = formatCurrency(item.price);
  // Dynamic highlights derived from amenities
  const hiWrap = document.getElementById('propHighlights');
  if (hiWrap) {
    const amen = (item.amenities || []).map(a=>a.toLowerCase());
    const map = [ {
      key:'pool', icon:'bi-water', title:'Private pool', desc:'Enjoy a refreshing swim during your stay.'
    }
    , {
      key:'kitchen', icon:'bi-egg-fried', title:'Full kitchen', desc:'Cook meals with essential appliances.'
    }
    , {
      key:'wifi', icon:'bi-wifi', title:'Fast Wi‑Fi', desc:'Reliable internet for work and streaming.'
    }
    , {
      key:'parking', icon:'bi-car-front', title:'Free parking', desc:'On-site parking for your convenience.'
    }
    , {
      key:'balcony', icon:'bi-building', title:'Balcony/terrace', desc:'Outdoor space to relax and enjoy views.'
    }
    , {
      key:'air conditioning', match:'air conditioning', icon:'bi-snow', title:'Air conditioning', desc:'Stay cool and comfortable.'
    }
    , {
      key:'ac', match:'ac', icon:'bi-snow', title:'Air conditioning', desc:'Stay cool and comfortable.'
    }
    ,
    ];
    const chosen = [];
    map.forEach(m => {
      const matchKey = (m.match || m.key).toLowerCase();
      if (amen.some(a => a.includes(matchKey)) && chosen.length < 3) chosen.push(m);
    }
    );
    if (chosen.length < 3) {
      chosen.push( {
        key:'hosted', icon:'bi-emoji-smile', title:'Dedicated host', desc:'Helpful local host for tips and support.'
      }
      );
    }
    hiWrap.innerHTML = chosen.map(m => `
    <li class="d-flex align-items-start mb-3">
    <i class="bi ${m.icon} me-3 mt-1"></i>
    <div>
    <div class="fw-semibold">${m.title}</div>
    <div class="text-muted small">${m.desc}</div>
    </div>
    </li>`).join('');
  }
  // Images
  const imgs = item.images || [];
  const setImg = (id, src) => {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
  };
  setImg('propImgMain', imgs[0]);
  setImg('propImg1', imgs[1] || imgs[0]);
  setImg('propImg2', imgs[2] || imgs[0]);
  setImg('propImg3', imgs[3] || imgs[0]);
  setImg('propImg4', imgs[4] || imgs[0]);
  // Amenities
  const amenWrap = document.getElementById('propAmenities');
  if (amenWrap) {
    const allAmenities = (item.amenities || []);
    let showAll = false;
    const renderAmenities = () => {
      const list = showAll ? allAmenities : allAmenities.slice(0, 8);
      amenWrap.innerHTML = list.map(a => `<div class="col"><i class="bi bi-check2-circle me-2 text-success"></i>${a}</div>`).join('');
      const btn = document.getElementById('showAllAmenities');
      if (btn) btn.textContent = showAll ? 'Show fewer' : 'Show all amenities';
      if (btn) btn.style.display = allAmenities.length > 8 ? 'inline-block' : 'none';
    };
    renderAmenities();
    document.getElementById('showAllAmenities')?.addEventListener('click', () => {
      showAll = !showAll;
      renderAmenities();
    }
    );
  }
  // Reviews + meters (synthetic based on rating, styled with site colors)
  const setMeters = () => {
    const score = item.rating || 4.8;
    const metrics = {
      clean: Math.min(5, +(score - 0.1).toFixed(1)),
      comm: Math.min(5, +(score + 0.1 > 5 ? 5 : score + 0.1).toFixed(1)),
      checkin: Math.min(5, +(score).toFixed(1)),
      acc: Math.min(5, +(score - 0.2).toFixed(1)),
      loc: Math.min(5, +(score - 0.1).toFixed(1)),
      val: Math.min(5, +(score - 0.3).toFixed(1)),
    };
    const pct = v => `${Math.max(0, Math.min(100, (v/5)*100))}%`;
    const byId=(id)=>document.getElementById(id);
    byId('revScore') && (byId('revScore').textContent = score.toFixed(2).replace(/0$/,''));
    const reviewsCount = 120 + (Math.floor(item.price)%40);
    byId('revCount') && (byId('revCount').textContent = `${reviewsCount} reviews`);
    [['mClean','barClean',metrics.clean],['mComm','barComm',metrics.comm],['mCheckin','barCheckin',metrics.checkin],['mAcc','barAcc',metrics.acc],['mLoc','barLoc',metrics.loc],['mVal','barVal',metrics.val]].forEach(([m,b,v])=>{
      if (byId(m)) byId(m).textContent = v.toFixed(1);
      if (byId(b)) byId(b).style.width = pct(v);
    });
    // simple synthetic reviews list
    const list = document.getElementById('reviewsList');
    if (list) {
      const samples = [
        {name:'Michael Chen', when:'March 2024', text:`Fantastic stay near ${item.location}. Views were even better than the photos.`},
        {name:'Emma Rodriguez', when:'February 2024', text:`Perfect for our vacation. Clean, bright, and close to everything.`},
        {name:'David Park', when:'January 2024', text:`Loved the design and location. Great amenities and super responsive host.`},
        {name:'Sophie Williams', when:'December 2023', text:`A dream spot! We’ll definitely return to ${item.location.split(',')[0]}.`},
      ];
      list.innerHTML = samples.map((r,i)=>`
      <div class="col-md-6">
        <div class="d-flex align-items-center mb-2">
          <img src="https://i.pravatar.cc/80?img=${5+i}" class="rounded-circle me-3" width="44" height="44" alt="${r.name}">
          <div>
            <div class="fw-semibold">${r.name}</div>
            <div class="text-muted small">${r.when}</div>
          </div>
        </div>
        <p class="text-muted mb-0">${r.text}</p>
      </div>`).join('');
    }
  };
  setMeters();
  // Where you'll be section
  const placeLoc = document.getElementById('placeLocation');
  if (placeLoc) {
    placeLoc.textContent = item.location;
    const imgEl = document.getElementById('placeMap');
    if (imgEl) imgEl.src = item.images?.[0] || 'assets/photos/cairo.png';
    const aboutEl = document.getElementById('placeAbout');
    if (aboutEl) {
      const city = (item.location || '').split(',')[0] || 'this area';
      aboutEl.textContent = item.summary || `Located in the heart of ${city}, with easy access to local cafes, markets, and landmarks.`;
    }
  }
  // Price calc preview
  const calcLine = document.getElementById('calcLine');
  const calcSubtotal = document.getElementById('calcSubtotal');
  const updatePreview = () => {
    const ci = document.getElementById('checkin').value;
    const co = document.getElementById('checkout').value;
    const guestsSel = document.getElementById('guests');
    const guests = guestsSel ? parseInt((guestsSel.value || '2').replace(/\D/g,''),10)||2 : 2;
    const nights = (ci && co) ? Math.max(1, Math.ceil((new Date(co) - new Date(ci)) / (1000*60*60*24))) : 1;
    const base = item.price * nights * guests;
    const cleaning = 150;
    const service = Math.round(base * 0.2);
    const total = base + cleaning + service;
    calcLine.textContent = `${formatCurrency(item.price)} × ${nights} night${nights>1?'s':''} × ${guests} guest${guests>1?'s':''}`;
    calcSubtotal.textContent = formatCurrency(base);
    document.getElementById('calcCleaning').textContent = formatCurrency(cleaning);
    document.getElementById('calcService').textContent = formatCurrency(service);
    document.getElementById('calcTotal').textContent = formatCurrency(total);
  };
  updatePreview();
  document.getElementById('checkin')?.addEventListener('change', updatePreview);
  document.getElementById('checkout')?.addEventListener('change', updatePreview);
  document.getElementById('guests')?.addEventListener('change', updatePreview);
  // Book Now navigation
  const form = document.getElementById('bookingFormProperty');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const ciInput = document.getElementById('checkin');
    const coInput = document.getElementById('checkout');
    // Keep inputs constrained so Checkout cannot be before Check-in
    const syncDateConstraints = () => {
      const today = new Date().toISOString().split('T')[0];
      // Always prevent selecting past dates
      if (ciInput) ciInput.min = today;
      // Checkout must be on/after check-in (and not before today)
      const ciVal = ciInput?.value || '';
      const minCheckout = ciVal || today;
      if (coInput) coInput.min = minCheckout;
      // Optional: keep check-in not after already chosen checkout
      const coVal = coInput?.value || '';
      if (ciInput) ciInput.max = coVal || '';
      // Auto-correct an invalid checkout picked before check-in
      if (ciVal && coVal && new Date(coVal) <= new Date(ciVal)) {
        // Set checkout to the same day as check-in plus 1 day
        const next = new Date(ciVal);
        next.setDate(next.getDate() + 1);
        const nextStr = next.toISOString().split('T')[0];
        coInput.value = nextStr;
      }
    };
    const validateDatesPresent = () => {
      const ci = ciInput.value;
      const co = coInput.value;
      const ok = ci && co && new Date(co) > new Date(ci);
      if (submitBtn) submitBtn.disabled = !ok;
    };
    syncDateConstraints();
    validateDatesPresent();
    const onDatesChange = () => {
      syncDateConstraints();
      validateDatesPresent();
    };
    ciInput?.addEventListener('change', onDatesChange);
    coInput?.addEventListener('change', onDatesChange);
    ciInput?.addEventListener('input', onDatesChange);
    coInput?.addEventListener('input', onDatesChange);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ci = ciInput.value;
      const co = coInput.value;
      if (!ci || !co || new Date(co) <= new Date(ci)) {
        showNotification('error','Please select valid Check-in and Checkout dates.');
        validateDatesPresent();
        return;
      }
      const guests = (document.getElementById('guests').value || '2').replace(/\D/g,'');
      const url = new URL('booking.html', window.location.origin);
      url.searchParams.set('id', item.id);
      url.searchParams.set('checkin', ci);
      url.searchParams.set('checkout', co);
      url.searchParams.set('guests', guests || '2');
      window.location.href = url.toString();
    }
    );
  }
}
async function populateBookingPage() {
  const sumLine = document.getElementById('sumLine');
  if (!sumLine) return;
  // not on booking page
  const id = getQueryParam('id');
  const listings = await fetchListings();
  const item = listings.find(l => l.id === id) || listings[0];
  const ci = getQueryParam('checkin');
  const co = getQueryParam('checkout');
  const nights = (ci && co) ? Math.max(1, Math.ceil((new Date(co) - new Date(ci)) / (1000*60*60*24))) : 1;
  const guestsInitial = parseInt(getQueryParam('guests') || '2', 10);
  const sumGuests = document.getElementById('sumGuests');
  // Populate property summary section
  const imgs = item.images || [];
  const setText = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  const setImg = (id, src) => {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
  };
  setImg('sumThumb', imgs[0]);
  setText('sumTitle', item.title);
  setText('sumLocation', `<i class="bi bi-geo-alt me-1"></i>${item.location}`);
  setText('sumMeta',
  `<span><i class="bi bi-door-open me-1"></i>${item.beds} Beds</span>
  <span><i class="bi bi-droplet me-1"></i>${item.baths} Baths</span>
  <span><i class="bi bi-people me-1"></i>${item.guests} Guests</span>
  <span><i class="bi bi-star-fill text-warning me-1"></i>${item.rating.toFixed(1)}</span>`);
  setText('sumCheckin', ci ? formatDate(ci) : '—');
  setText('sumCheckout', co ? formatDate(co) : '—');
  setText('sumGuestsText', `${guestsInitial} guest${guestsInitial>1?'s':''}`);
  if (sumGuests) {
    // populate options if empty
    if (!sumGuests.options.length) {
      for (let g=1;
      g<=10;
      g++) {
        const opt = document.createElement('option');
        opt.value = String(g);
        opt.textContent = `${g} guest${g>1?'s':''}`;
        sumGuests.appendChild(opt);
      }
    }
    sumGuests.value = String(guestsInitial);
  }
  const updateTotals = () => {
    const guests = sumGuests ? parseInt(sumGuests.value,10) : guestsInitial;
    const base = item.price * nights * guests;
    const cleaning = 150;
    const service = Math.round(base * 0.2);
    // scalable service fee
    const total = base + cleaning + service;
    document.getElementById('sumLine').textContent = `${formatCurrency(item.price)} × ${nights} night${nights>1?'s':''} × ${guests} guest${guests>1?'s':''}`;
    document.getElementById('sumBase').textContent = formatCurrency(base);
    document.getElementById('sumCleaning').textContent = formatCurrency(cleaning);
    document.getElementById('sumService').textContent = formatCurrency(service);
    document.getElementById('sumTotal').textContent = formatCurrency(total);
    setText('sumGuestsText', `${guests} guest${guests>1?'s':''}`);
  };
  updateTotals();
  sumGuests?.addEventListener('change', updateTotals);
  const back = document.getElementById('backToListing');
  if (back) back.href = `property.html?id=${encodeURIComponent(item.id)}`;
  document.getElementById('confirmBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('success', 'Your booking has been confirmed!');
  }
  );
}
function initDataDrivenPages() {
  // Render stays grid if present
  renderListingsInStays();
  // Render featured on home if present
  renderFeaturedOnHome();
  // Populate property details if present
  populatePropertyPage();
  // Populate booking summary if present
  populateBookingPage();
}
