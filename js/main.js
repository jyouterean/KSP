/* ============================================
   株式会社KSP コーポレートサイト
   Main JavaScript
   ============================================ */

/* ---------- Configuration ---------- */
const CONFIG = {
  loading: {
    delay: 400,
    removeDelay: 600,
    fallbackTimeout: 3000
  },
  header: {
    scrollThreshold: 50,
    hideThreshold: 300,
    scrollDelta: 5
  },
  scroll: {
    backToTopThreshold: 600,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -60px 0px'
  },
  counter: {
    duration: 2000,
    observerThreshold: 0.5
  },
  magnetic: {
    strength: 0.15
  },
  tilt: {
    maxAngle: 5,
    liftY: -6
  },
  transition: {
    duration: 400
  }
};

/* ---------- Safe Init Wrapper ---------- */
function safeInit(name, fn) {
  try {
    fn();
  } catch (e) {
    console.warn('[KSP] ' + name + ' initialization failed:', e.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  safeInit('LoadingScreen', initLoadingScreen);
  safeInit('Header', initHeader);
  safeInit('Hamburger', initHamburger);
  safeInit('ScrollAnimations', initScrollAnimations);
  safeInit('SmoothScroll', initSmoothScroll);
  safeInit('CurrentNav', initCurrentNav);
  safeInit('BackToTop', initBackToTop);
  safeInit('CounterAnimation', initCounterAnimation);
  safeInit('ContactForm', initContactForm);
  safeInit('MagneticButtons', initMagneticButtons);
  safeInit('PageTransition', initPageTransition);
  safeInit('CardTilt', initCardTilt);
  safeInit('FAQAccordion', initFAQAccordion);
  safeInit('Parallax', initParallax);
});

/* ---------- Loading Screen ---------- */
function initLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (!loadingScreen) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    loadingScreen.classList.add('loaded');
    setTimeout(() => loadingScreen.remove(), CONFIG.loading.removeDelay);
    return;
  }

  // Wait for both page load AND animation to complete
  const animationDuration = 1400; // bar fill (1.2s) + buffer
  let pageLoaded = false;
  let animationDone = false;

  function tryHide() {
    if (pageLoaded && animationDone) {
      loadingScreen.classList.add('loaded');
      setTimeout(() => loadingScreen.remove(), CONFIG.loading.removeDelay);
    }
  }

  window.addEventListener('load', () => {
    pageLoaded = true;
    tryHide();
  });

  setTimeout(() => {
    animationDone = true;
    tryHide();
  }, animationDuration);

  // Fallback: force hide after timeout
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('loaded')) {
      loadingScreen.classList.add('loaded');
      setTimeout(() => loadingScreen.remove(), CONFIG.loading.removeDelay);
    }
  }, CONFIG.loading.fallbackTimeout);
}

/* ---------- Header Scroll Behavior ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;
  const isTransparent = header.dataset.transparent === 'true';

  function updateHeader() {
    const currentScroll = window.scrollY;

    if (currentScroll > CONFIG.header.scrollThreshold) {
      header.classList.add('header--scrolled');
      if (isTransparent) {
        header.classList.remove('header--transparent');
      }
    } else {
      header.classList.remove('header--scrolled');
      if (isTransparent) {
        header.classList.add('header--transparent');
      }
    }

    if (currentScroll > CONFIG.header.hideThreshold) {
      if (currentScroll > lastScroll && currentScroll - lastScroll > CONFIG.header.scrollDelta) {
        header.classList.add('header--hidden');
      } else if (lastScroll > currentScroll && lastScroll - currentScroll > CONFIG.header.scrollDelta) {
        header.classList.remove('header--hidden');
      }
    } else {
      header.classList.remove('header--hidden');
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateHeader();
}

/* ---------- Hamburger Menu ---------- */
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  const body = document.body;
  let scrollPosition = 0;
  const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  let cachedFocusableEls = null;

  function openMenu() {
    scrollPosition = window.scrollY;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    body.classList.add('nav-open');
    body.style.top = `-${scrollPosition}px`;
    cachedFocusableEls = [hamburger, ...mobileNav.querySelectorAll(focusableSelector)];
    const firstLink = mobileNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    body.classList.remove('nav-open');
    body.style.top = '';
    window.scrollTo(0, scrollPosition);
    cachedFocusableEls = null;
    hamburger.focus();
  }

  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (!mobileNav.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusableEls = cachedFocusableEls || [hamburger, ...mobileNav.querySelectorAll(focusableSelector)];
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
}

/* ---------- Scroll Animations (IntersectionObserver) ---------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.style.willChange = 'auto';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: CONFIG.scroll.observerThreshold,
      rootMargin: CONFIG.scroll.observerRootMargin
    }
  );

  animatedElements.forEach(el => observer.observe(el));
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- Current Page Navigation Highlight ---------- */
function initCurrentNav() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.header__nav-link, .footer__nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.split('/').pop() || 'index.html';

    if (linkFile === currentFile) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ---------- Back to Top Button ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > CONFIG.scroll.backToTopThreshold) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Counter Animation ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-item__number[data-count]');
  if (!counters.length) return;

  const circumference = 2 * Math.PI * 45; // r=45

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCount(el, target);

          // Animate ring progress if present
          const ringWrapper = el.closest('.stat-item__ring-value');
          if (ringWrapper) {
            const ring = ringWrapper.closest('.stat-item__ring-wrapper');
            const progressCircle = ring?.querySelector('.stat-item__ring-progress');
            if (progressCircle) {
              const progressPercent = parseInt(progressCircle.dataset.progress, 10) || 100;
              const offset = circumference - (circumference * progressPercent / 100);
              progressCircle.style.strokeDashoffset = offset;
            }
          }

          observer.unobserve(el);
        }
      });
    },
    { threshold: CONFIG.counter.observerThreshold }
  );

  counters.forEach(el => observer.observe(el));

  function animateCount(element, target) {
    const duration = CONFIG.counter.duration;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);
      element.textContent = current.toLocaleString('ja-JP');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('ja-JP');
      }
    }
    requestAnimationFrame(update);
  }
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('[required]');
  const successEl = document.querySelector('.form-success');
  const resetBtn = successEl?.querySelector('.form-success__reset');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    fields.forEach(field => {
      const error = field.closest('.form-field').querySelector('.form-field__error');
      if (!field.value.trim()) {
        isValid = false;
        field.closest('.form-field').classList.add('form-field--error');
        if (error) error.textContent = 'この項目は必須です';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        isValid = false;
        field.closest('.form-field').classList.add('form-field--error');
        if (error) error.textContent = '正しいメールアドレスを入力してください';
      } else {
        field.closest('.form-field').classList.remove('form-field--error');
        if (error) error.textContent = '';
      }
    });

    if (isValid) {
      const name = form.querySelector('#contact-name').value;
      const company = form.querySelector('#contact-company').value;
      const email = form.querySelector('#contact-email').value;
      const phone = form.querySelector('#contact-phone').value;
      const message = form.querySelector('#contact-message').value;

      const subject = encodeURIComponent('【お問い合わせ】' + name + '様');
      const body = encodeURIComponent(
        'お名前: ' + name + '\n' +
        '会社名: ' + (company || 'なし') + '\n' +
        'メール: ' + email + '\n' +
        '電話番号: ' + (phone || 'なし') + '\n\n' +
        'お問い合わせ内容:\n' + message
      );

      if (successEl) {
        form.hidden = true;
        successEl.hidden = false;
      }

      window.location.href = 'mailto:info@ksp-delivery.co.jp?subject=' + subject + '&body=' + body;
    }
  });

  if (resetBtn && successEl) {
    resetBtn.addEventListener('click', () => {
      successEl.hidden = true;
      form.hidden = false;
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  fields.forEach(field => {
    field.addEventListener('input', () => {
      const wrapper = field.closest('.form-field');
      const error = wrapper.querySelector('.form-field__error');
      wrapper.classList.remove('form-field--error');
      if (error) error.textContent = '';
    });
  });
}

/* ---------- Magnetic Buttons ---------- */
function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const buttons = document.querySelectorAll('.btn--primary, .btn--outline');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * CONFIG.magnetic.strength}px, ${y * CONFIG.magnetic.strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ---------- Page Transition (Lazy Init) ---------- */
function initPageTransition() {
  let transition = null;

  function ensureTransition() {
    if (!transition) {
      transition = document.createElement('div');
      transition.className = 'page-transition';
      document.body.appendChild(transition);
    }
    return transition;
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || link.target === '_blank') return;

    if (href.endsWith('.html') || href === '/' || href === '') {
      e.preventDefault();
      const el = ensureTransition();
      el.style.transformOrigin = 'bottom';
      el.style.transform = 'scaleY(1)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)';
      setTimeout(() => {
        window.location.href = href;
      }, CONFIG.transition.duration);
    }
  });

  window.addEventListener('pageshow', () => {
    if (transition) {
      transition.style.transformOrigin = 'top';
      transition.style.transform = 'scaleY(0)';
    }
  });
}

/* ---------- FAQ Accordion ---------- */
function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      items.forEach(other => {
        const otherQ = other.querySelector('.faq-item__question');
        const otherA = other.querySelector('.faq-item__answer');
        if (otherQ && otherA && other !== item) {
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.setAttribute('aria-hidden', 'true');
          otherA.style.maxHeight = '0';
        }
      });

      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.maxHeight = '0';
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Hero Parallax ---------- */
function initParallax() {
  const bgImage = document.querySelector('.hero__bg-image');
  if (!bgImage) return;

  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
        if (scrollY <= heroHeight) {
          const translateY = scrollY * 0.3;
          bgImage.style.transform = 'translateY(' + translateY + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ---------- Card Tilt Effect ---------- */
function initCardTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * CONFIG.tilt.maxAngle}deg) rotateX(${-y * CONFIG.tilt.maxAngle}deg) translateY(${CONFIG.tilt.liftY}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
