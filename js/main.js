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

    // conversão principal do site: clique em qualquer botão de WhatsApp
    link.addEventListener('click', () => {
      trackEvent('whatsapp_click', {
        link_location: (link.closest('section') || {}).id || 'header',
      });
    });
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

  // fecha o menu ao tocar fora dele (agora que é um dropdown compacto, não
  // um painel que cobre a tela toda)
  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sparkField && !prefersReducedMotion) {
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
  // Sempre começa apagada a cada visita/recarregamento — o aceso é sempre um gesto do visitante.
  const aboutCandle = document.getElementById('aboutCandle');
  const aboutTop = document.getElementById('aboutTop');
  const aboutInvite = document.getElementById('aboutInvite');
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

    aboutCandle.addEventListener('click', () => {
      setLit(!aboutCandle.classList.contains('is-lit'));
    });
  }

  /* ---------- Vídeos do catálogo: só carregam perto de entrar na tela ---------- */
  const catalogVideos = document.querySelectorAll('.product-video');
  if (catalogVideos.length) {
    const loadAndPlay = (video) => {
      video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });
      video.load();
      // quem prefere menos movimento fica só com o poster (1º frame), sem autoplay
      if (!prefersReducedMotion) {
        video.play().catch(() => {
          /* navegador pode bloquear o play() programático — o autoplay do
             próprio <video> (muted) já cobre a maioria dos casos */
        });
      }
    };

    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadAndPlay(entry.target);
              videoObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '200px 0px' }
      );
      catalogVideos.forEach((video) => videoObserver.observe(video));
    } else {
      catalogVideos.forEach(loadAndPlay);
    }
  }

  /* ---------- Mascote: pode ser arrastada pra qualquer lugar da tela ---------- */
  const mascot = document.querySelector('.mascot-companion');
  if (mascot) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const moveTo = (x, y) => {
      const rect = mascot.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      mascot.style.left = clamp(x, 0, maxX) + 'px';
      mascot.style.top = clamp(y, 0, maxY) + 'px';
      mascot.style.right = 'auto';
    };

    // escuta o movimento/soltura no window (não no elemento) — assim o arraste
    // continua funcionando mesmo depois que a vela sai de baixo do ponteiro,
    // sem depender de setPointerCapture (que pode ser cancelado nessa hora)
    mascot.addEventListener('pointerdown', (e) => {
      dragging = true;
      mascot.classList.add('dragging');
      const rect = mascot.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      moveTo(e.clientX - offsetX, e.clientY - offsetY);
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      mascot.classList.remove('dragging');
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // se a janela encolher (ex: virar o celular), garante que ela não fique presa fora da tela
    window.addEventListener('resize', () => {
      const rect = mascot.getBoundingClientRect();
      moveTo(rect.left, rect.top);
    });
  }

  /* ---------- Analytics (LGPD): só carrega depois do consentimento ---------- */
  // TODO: trocar pelo Measurement ID real do Google Analytics 4 (formato G-XXXXXXXXXX)
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
  const CONSENT_KEY = 'velaDominusCookieConsent';

  function loadGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) return;
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function trackEvent(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (cookieBanner && cookieAccept && cookieDecline) {
    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === 'accepted') {
      loadGoogleAnalytics();
    } else if (consent !== 'declined') {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      cookieBanner.hidden = true;
      loadGoogleAnalytics();
    });

    cookieDecline.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'declined');
      cookieBanner.hidden = true;
    });
  }
})();
