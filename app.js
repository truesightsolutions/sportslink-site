/* SportsLink marketing site — small behaviours only. No framework, no build. */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ═══ scroll reveal ═════════════════════════════════════════════ */

  function reveal() {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));
  }

  /* ═══ theme — dark by default, light is opt-in ═══════════════════ */

  function theme() {
    const btn = $('#themebtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const light = document.documentElement.dataset.theme === 'light';
      if (light) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'light';
      try { localStorage.setItem('sl-theme', light ? 'dark' : 'light'); } catch (e) { /* private mode */ }
    });
  }

  /* ═══ mobile drawer ═════════════════════════════════════════════ */

  function drawer() {
    const d = $('#drawer'), scrim = $('#scrim'), open = $('#burger'), close = $('#dclose');
    if (!d) return;
    const set = on => {
      d.classList.toggle('open', on);
      scrim.classList.toggle('open', on);
      open.setAttribute('aria-expanded', String(on));
      document.body.style.overflow = on ? 'hidden' : '';
      if (on) close.focus(); else open.focus();
    };
    open.addEventListener('click', () => set(true));
    close.addEventListener('click', () => set(false));
    scrim.addEventListener('click', () => set(false));
    // Any destination closes it, and so does Escape.
    $$('a', d).forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && d.classList.contains('open')) set(false); });
  }

  function header() {
    const hdr = $('#hdr');
    if (!hdr) return;
    addEventListener('scroll', () => hdr.classList.toggle('stuck', scrollY > 40), { passive: true });
  }

  window.lucide && lucide.createIcons({ nameAttr: 'data-lucide' });
  reveal();
  theme();
  drawer();
  header();
})();
