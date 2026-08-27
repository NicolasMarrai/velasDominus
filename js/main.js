// ============================================================
// Velas Dominus — interações do site
// ============================================================
(function () {
  'use strict';

  // Número extraído do cartaz de divulgação (DDD 12, "12 99209 3000") — confirmar com o cliente
  const WHATSAPP_NUMBER = '5512992093000';

  document.querySelectorAll('.js-whatsapp-link').forEach((link) => {
    const msg = link.dataset.waMsg || '';
    link.href =
      'https://wa.me/' + WHATSAPP_NUMBER + (msg ? '?text=' + encodeURIComponent(msg) : '');
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header: encolhe/ganha fundo ao rolar ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Revelar seções/cartões ao rolar ---------- */
  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Fagulhas ambiente no hero ---------- */
  const sparkField = document.getElementById('heroSparkles');
  if (sparkField) {
    const SPARK_COUNT = 14;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const size = 2 + Math.random() * 3;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = 40 + Math.random() * 55 + '%';
      s.style.animationDuration = 4 + Math.random() * 5 + 's';
      s.style.animationDelay = Math.random() * 6 + 's';
      sparkField.appendChild(s);
    }
  }

  /* ---------- Vela da seção Sobre: acende um glow narrativo atrás do texto ---------- */
  const aboutCandle = document.getElementById('aboutCandle');
  const aboutTop = document.getElementById('aboutTop');
  const aboutInvite = document.getElementById('aboutInvite');
  const ABOUT_CANDLE_KEY = 'velaDominusAboutLit';
  const ABOUT_INVITE_UNLIT = 'Acenda a vela e desperte a magia';
  const ABOUT_INVITE_LIT = 'A magia despertou';

  if (aboutCandle && aboutTop && aboutInvite) {
    const setLit = (lit) => {
      aboutCandle.classList.toggle('is-lit', lit);
      aboutTop.classList.toggle('is-lit', lit);
      aboutCandle.setAttribute('aria-pressed', String(lit));
      aboutCandle.setAttribute('aria-label', lit ? 'Apagar a vela' : 'Acender a vela');
      aboutInvite.textContent = lit ? ABOUT_INVITE_LIT : ABOUT_INVITE_UNLIT;
    };

    if (localStorage.getItem(ABOUT_CANDLE_KEY) === '1') {
      setLit(true);
    }

    aboutCandle.addEventListener('click', () => {
      const lit = !aboutCandle.classList.contains('is-lit');
      setLit(lit);
      localStorage.setItem(ABOUT_CANDLE_KEY, lit ? '1' : '0');
    });
  }
})();
