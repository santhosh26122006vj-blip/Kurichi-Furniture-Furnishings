/* ==========================================================================
   Kurichi Furniture & Furnishings — script.js
   Vanilla JS only. No frameworks, no dependencies.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Navbar: scrolled state ---------- */
  const navbar = document.getElementById('navbar');

  const setNavbarState = () => {
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  setNavbarState();
  window.addEventListener('scroll', setNavbarState, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');

  const closeMenu = () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };

  const toggleMenu = () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', toggleMenu);

    // Close menu after tapping a link
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close menu if resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealSelectors = [
    '.section-head',
    '.about__media', '.about__content',
    '.collection-card',
    '.why__card',
    '.experience__panel',
    '.reviews__summary', '.review-card',
    '.visit__details',
    '.contact__form'
  ];

  const revealEls = document.querySelectorAll(revealSelectors.join(', '));

  revealEls.forEach((el) => el.classList.add('reveal'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- Enquiry form (Web3Forms) ---------- */
  const form = document.getElementById('enquiryForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const originalLabel = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.textContent = '';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          statusEl.textContent = 'Thank you — your enquiry has been sent. We\u2019ll be in touch soon.';
          form.reset();
        } else {
          statusEl.textContent = 'Something went wrong. Please call or WhatsApp us directly.';
        }
      } catch (err) {
        statusEl.textContent = 'Something went wrong. Please call or WhatsApp us directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- Smooth-scroll offset for sticky navbar on hash links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
})();
