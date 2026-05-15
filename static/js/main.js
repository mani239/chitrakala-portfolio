// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const pageShell = document.querySelector('.page-shell');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

// Initialize theme from localStorage or system preference
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  let theme = 'dark';

  if (savedTheme) {
    theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme = 'light';
  }

  setTheme(theme);
}

// Set theme and update UI
function setTheme(theme) {
  pageShell.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update theme toggle button
  const icon = themeToggle.querySelector('.theme-icon');
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', theme === 'light');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const currentTheme = pageShell.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Mobile navigation toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Listen for system theme changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const handleThemeChange = (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'light' : 'dark');
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleThemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleThemeChange);
  }
}

// ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

// ===== STAGGERED REVEALS FOR GROUPS =====
function applyStaggeredReveal() {
  document.querySelectorAll('.reveal-stagger').forEach((group) => {
    const children = Array.from(group.querySelectorAll('.reveal'));
    children.forEach((child, i) => {
      // small stagger in ms
      const delay = i * 75;
      child.style.transitionDelay = `${delay}ms`;
    });
  });
}

// ===== COUNT-UP METRICS =====
function animateCount(el, target) {
  const duration = 1200;
  const start = performance.now();
  const startValue = 0;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(startValue + (target - startValue) * progress);
    el.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function applyCountUp() {
  const countTargets = document.querySelectorAll('[data-count]');
  if (!countTargets.length) return;

  const countObserver = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const targetEl = entry.target.querySelector('.stat-value, .metric-value') || entry.target;
      const targetValue = parseInt(entry.target.dataset.count, 10);
      if (!Number.isNaN(targetValue)) {
        targetEl.textContent = '0';
        animateCount(targetEl, targetValue);
      }
      observerInstance.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  countTargets.forEach((target) => countObserver.observe(target));
}

// ===== PARALLAX / SUBTLE SCROLL MOTION =====
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let _tick = false;
function onScrollTick() {
  const scrolled = window.scrollY || window.pageYOffset;
  document.querySelectorAll('.parallax').forEach((el) => {
    const depth = parseFloat(el.dataset.depth) || 0.18;
    // move on Y only, keep transforms GPU-accelerated
    el.style.transform = `translate3d(0, ${Math.round(scrolled * depth)}px, 0)`;
  });
  _tick = false;
}

if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    if (!_tick) {
      _tick = true;
      requestAnimationFrame(onScrollTick);
    }
  }, { passive: true });
}

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
} else {
  // Fallback for browsers without IntersectionObserver
  document.querySelectorAll('img[data-src]').forEach((img) => {
    img.src = img.dataset.src;
  });
}

// ===== SMOOTH SCROLL BEHAVIOR =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update URL without page jump
      window.history.pushState(null, null, href);
    }
  });
});

// ===== PERFORMANCE: REDUCE ANIMATIONS ON SLOW DEVICES =====
if (navigator.deviceMemory && navigator.deviceMemory < 4) {
  document.documentElement.style.setProperty('--transition-duration', '0.1s');
}

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
document.addEventListener('keydown', (e) => {
  // ESC to close any modals or focus on main content
  if (e.key === 'Escape') {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.focus();
  }
});

// ===== CONTACT FORM TRACKING (optional - for future form implementations) =====
function trackEvent(eventName, eventDetails = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventDetails);
  }
  console.log(`Event: ${eventName}`, eventDetails);
}

// Track CTA clicks
document.querySelectorAll('[href="#contact"], .primary-cta, .secondary-cta').forEach((el) => {
  el.addEventListener('click', function () {
    trackEvent('cta_click', {
      element: this.textContent,
      url: this.href,
    });
  });
});

// Track external link clicks
document.querySelectorAll('a[target="_blank"]').forEach((el) => {
  el.addEventListener('click', function () {
    trackEvent('external_link_click', {
      url: this.href,
      target: this.textContent,
    });
  });
});

// ===== PAGE VISIBILITY (pause animations when tab is hidden) =====
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
  } else {
    document.documentElement.style.removeProperty('--animation-duration');
  }
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  applyStaggeredReveal();
  applyCountUp();
  console.log('Portfolio site initialized');
});

// Auto-apply parallax to hero elements for subtle motion
if (!prefersReducedMotion) {
  document.addEventListener('DOMContentLoaded', () => {
    const autoParallax = document.querySelectorAll('.hero-orb, .hero-media-card, .hero-media-image');
    autoParallax.forEach((el, idx) => {
      el.classList.add('parallax');
      if (!el.dataset.depth) {
        // orbs and images get small depth, hero media slightly stronger
        el.dataset.depth = idx === autoParallax.length - 1 ? '0.12' : '0.06';
      }
    });
  });
}

// ===== SERVICE WORKER (optional - for PWA capabilities) =====
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/static/sw.js').catch(() => {
      // Service worker registration failed, that's okay
    });
  });
}