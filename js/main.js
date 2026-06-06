/* Lokal Im Fokus – main.js */

(function () {
  'use strict';

  // --- Nav: Hero-Modus wechseln beim Scrollen ---
  var nav = document.getElementById('nav');
  var navCta = document.getElementById('navCta');

  if (nav) {
    var heroHeight = window.innerHeight * 0.6;

    function updateNav() {
      var scrolled = window.scrollY > heroHeight;
      nav.classList.toggle('nav--hero', !scrolled);
      nav.classList.toggle('nav--scrolled', scrolled);
      if (navCta) navCta.style.display = scrolled ? 'inline-flex' : 'none';
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', function () {
      heroHeight = window.innerHeight * 0.6;
      updateNav();
    }, { passive: true });
    updateNav();
  }

  // --- Mobile Hamburger-Menü ---
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Menü schließen bei Klick auf einen Link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Menü schließen bei Klick außerhalb
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Smooth Scroll für Anker-Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      var navOffset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
        10
      );
      var top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // --- Intersection Observer: Elemente beim Scrollen einblenden ---
  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent = [
      '.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }',
      '.fade-in.visible { opacity: 1; transform: translateY(0); }'
    ].join('\n');
    document.head.appendChild(style);

    var targets = document.querySelectorAll('.step, .usp-card, .leistung-card');
    targets.forEach(function (el) { el.classList.add('fade-in'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  }
})();
