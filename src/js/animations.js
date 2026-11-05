// Comprehensive Animation & Micro-interaction Controller
export function initAnimations() {
  initScrollProgressBar();
  initScrollReveal();
  initClickRipples();
  initCardShimmer();
  initContainerScrollAnimation();
}

// 1. Fixed Top Scroll Progress Bar
function initScrollProgressBar() {
  let bar = document.getElementById('scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    bar.className = 'fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-400 z-[9999] transition-all duration-75 pointer-events-none shadow-sm shadow-indigo-500/50';
    bar.style.width = '0%';
    document.body.appendChild(bar);
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

// 2. IntersectionObserver for Scroll-Triggered Element Reveals
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .bento-card, .faq-item');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    if (!el.classList.contains('scroll-reveal')) {
      el.classList.add('scroll-reveal');
    }
    // Add staggered delay to sibling bento cards
    if (!el.style.transitionDelay && (index % 4 !== 0)) {
      el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    }
    observer.observe(el);
  });
}

// 3. Tactile Click Ripple and Micro-Feedback
function initClickRipples() {
  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('button, .nav-tab-btn, .clickable-pill, .bento-card, a[href^="#"]');
    if (!target) return;

    // Create subtle animated ripple wave
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = 'click-ripple-circle';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Ensure target has relative positioning and overflow hidden if appropriate
    const compStyle = window.getComputedStyle(target);
    if (compStyle.position === 'static') {
      target.style.position = 'relative';
    }

    target.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

// 4. Subtle Ambient Shimmer Tracking on Hovered Cards
function initCardShimmer() {
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// 5. Aceternity UI 3D Container Scroll Animation
function initContainerScrollAnimation() {
  const container = document.getElementById('live-app') || document.getElementById('live-app-scroll-container');
  const card = document.getElementById('live-app-card');
  const header = document.getElementById('live-app-header-title');
  if (!container || !card) return;

  let ticking = false;

  function updateScrollTransform() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start rotation when container enters viewport, finish when top reaches 100px
    const startY = windowHeight;
    const endY = 100;
    const current = rect.top;

    let progress = (startY - current) / (startY - endY);
    progress = Math.max(0, Math.min(1, progress));

    const isMobile = window.innerWidth <= 768;
    const maxRotate = isMobile ? 12 : 20;
    const rotate = maxRotate * (1 - progress);
    const scale = isMobile ? (0.88 + 0.12 * progress) : (0.92 + 0.08 * progress);
    const translateY = -40 * progress;

    card.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
    if (header) {
      header.style.transform = `translateY(${translateY}px)`;
      header.style.opacity = `${0.6 + 0.4 * progress}`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollTransform);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateScrollTransform, { passive: true });
  updateScrollTransform();
}

// Trigger smooth entrance animation when changing portal views
export function animateViewEntrance(containerEl) {
  if (!containerEl) return;
  containerEl.classList.remove('animate-view-appear');
  void containerEl.offsetWidth; // Force DOM reflow
  containerEl.classList.add('animate-view-appear');
}

