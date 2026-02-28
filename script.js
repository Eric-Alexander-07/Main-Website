// Config: change to your real email/phone
const CONTACT_EMAIL = 'thericschuck@gmail.com';
const WHATSAPP_NUMBER = '4917634445821'; // e.g. 49 + number without leading 0

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Close menu on nav click (mobile)
  document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Scroll reveal
  const revealables = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  revealables.forEach(el => io.observe(el));

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // WhatsApp link
  const wa = document.getElementById('whatsapp');
  if (wa) wa.href = `https://wa.me/${WHATSAPP_NUMBER}`;

  // Contact form handler (mailto)
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  form?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const msg = (fd.get('message') || '').toString().trim();

    if (!name || !email || !msg) {
      setNote('Bitte fÃ¼lle alle Felder aus.', 'error');
      return;
    }
    const subject = encodeURIComponent(`Projektanfrage von ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${msg}`);
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setNote('Ã–ffne E-Mail-Programm...', 'ok');
    window.location.href = mailto;
  });

  function setNote(text, type) {
    if (!note) return;
    note.textContent = text;
    note.style.color = type === 'error' ? '#ef4444' : '#aab4cf';
  }

  // Build real stats in #stats and hide any placeholders via CSS
  const statsWrap = document.querySelector('#stats .container');
  if (statsWrap) {
    const grid = document.createElement('div');
    grid.className = 'grid three stats-grid';
    grid.innerHTML = `
      <article class="card stat">
        <div class="value" data-count="76">76%</div>
        <div class="label">der Smartphone-Nutzer besuchen nach einer lokalen Suche innerhalb von 24 Stunden ein Geschaeft.</div>
        <div class="sub-value"><span class="chip">28% enden in einem Kauf</span></div>
        <a class="source" href="https://www.thinkwithgoogle.com/marketing-strategies/search/mobile-near-me-searches/" target="_blank" rel="noopener">Quelle: Think with Google</a>
      </article>
      <article class="card stat">
        <div class="value" data-count="53">53%</div>
        <div class="label">mobiler Besucher brechen ab, wenn das Laden länger als 3 Sekunden dauert.</div>
        <a class="source" href="https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-site-load-time-statistics/" target="_blank" rel="noopener">Quelle: Think with Google</a>
      </article>
      <article class="card stat">
        <div class="value text">Design = Vertrauen</div>
        <div class="label">Glaubwuerdigkeit wird stark durch Design/Look beeinflusst (Stanford-Richtlinien).</div>
        <a class="source" href="https://credibility.stanford.edu/guidelines/index.html" target="_blank" rel="noopener">Quelle: Stanford Guidelines</a>
      </article>`;
    statsWrap.appendChild(grid);
  }

  // Lottie in Hero
  try {
    if (window.lottie) {
      const container = document.getElementById('lottie-hero');
      if (container) {
        window.lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          // Placeholder animation; replace with your JSON
          path: 'https://assets10.lottiefiles.com/packages/lf20_47pyyfcq.json'
        });
      }
    }
  } catch { }

  const testimonialSlider = initSlider({
    trackSelector: '#testimonial-track',
    prevSelector: '#t-prev',
    nextSelector: '#t-next',
    breakpoints: [
      { width: 0, perView: 1 },
      { width: 1080, perView: 2 }
    ]
  });
  if (testimonialSlider) {
    const dotsWrap = document.getElementById('testimonial-dots');
    let dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      dots = testimonialSlider.slides.map((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => testimonialSlider.goTo(i));
        dotsWrap.appendChild(dot);
        return dot;
      });
    }
    testimonialSlider.onChange(({ index }) => {
      dots.forEach((dot, di) => dot.classList.toggle('active', di === index));
      testimonialSlider.slides.forEach((slide, si) => slide.classList.toggle('is-active', si === index));
    });
    testimonialSlider.slides.forEach(slide => {
      const rating = Math.min(5, Math.max(0, Number(slide.getAttribute('data-rating') || 0)));
      const stars = slide.querySelector('.stars');
      if (!stars) return;
      stars.querySelectorAll('.star').forEach((s, i) => {
        s.textContent = '';
        s.classList.toggle('active', i < rating);
      });
    });
  }

  // Portfolio horizontal scroll (1 slide per view, driven by vertical scroll)
  const portfolioOuter = document.getElementById('portfolio-scroll');
  const portfolioTrack = document.getElementById('projects-track');
  if (portfolioOuter && portfolioTrack) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slides = Array.from(portfolioTrack.querySelectorAll('.project-slide'));
    if (!slides.length) return;

    const sticky = portfolioOuter.querySelector('.h-scroll-sticky');

    // ── Desktop: sticky + translateX ─────────────────────────────────────────
    const scrollPerSlide = () => window.innerHeight;

    const setOuterHeight = () => {
      if (window.innerWidth < 720 || prefersReduced) { portfolioOuter.style.height = ''; return; }
      portfolioOuter.style.height = (window.innerHeight + (slides.length - 1) * scrollPerSlide()) + 'px';
    };

    const onScroll = () => {
      if (window.innerWidth < 720 || prefersReduced) { portfolioTrack.style.transform = ''; return; }
      const rect = portfolioOuter.getBoundingClientRect();
      const scrollRange = portfolioOuter.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
      portfolioTrack.style.transform = 'translateX(' + (-progress * (slides.length - 1) * window.innerWidth).toFixed(1) + 'px)';
    };

    // ── Mobile: CSS scroll-snap carousel with dots + prev/next ───────────────
    let mobileNav = null;

    const getActiveIdx = () => Math.round(sticky.scrollLeft / window.innerWidth);

    const scrollToSlide = (idx) => {
      sticky.scrollTo({ left: idx * window.innerWidth, behavior: 'smooth' });
    };

    const buildMobileNav = () => {
      if (mobileNav) return;
      mobileNav = document.createElement('div');
      mobileNav.className = 'portfolio-mobile-nav';

      const prevBtn = document.createElement('button');
      prevBtn.className = 'portfolio-btn';
      prevBtn.setAttribute('aria-label', 'Vorheriges Projekt');
      prevBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'portfolio-dots';
      const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'portfolio-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Projekt ' + (i + 1));
        dot.addEventListener('click', () => scrollToSlide(i));
        dotsWrap.appendChild(dot);
        return dot;
      });

      const nextBtn = document.createElement('button');
      nextBtn.className = 'portfolio-btn';
      nextBtn.setAttribute('aria-label', 'Nächstes Projekt');
      nextBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      prevBtn.addEventListener('click', () => scrollToSlide(Math.max(0, getActiveIdx() - 1)));
      nextBtn.addEventListener('click', () => scrollToSlide(Math.min(slides.length - 1, getActiveIdx() + 1)));

      sticky.addEventListener('scroll', () => {
        const idx = getActiveIdx();
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, { passive: true });

      mobileNav.append(prevBtn, dotsWrap, nextBtn);
      portfolioOuter.insertAdjacentElement('afterend', mobileNav);
    };

    const teardownMobileNav = () => {
      if (!mobileNav) return;
      mobileNav.remove();
      mobileNav = null;
    };

    const init = () => {
      setOuterHeight();
      onScroll();
      if (window.innerWidth < 720) buildMobileNav();
      else teardownMobileNav();
    };
    window.addEventListener('load', init);
    window.addEventListener('resize', init);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Pricing cards: animated expand/collapse of features, per-card independent
  const priceCards = Array.from(document.querySelectorAll('.card.price'));
  const scheduleEqualHeights = (() => {
    let rafId = null;
    const raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : (fn) => setTimeout(fn, 16);
    const apply = () => {
      const readyCards = priceCards.filter(card => !card.classList.contains('is-transitioning'));
      readyCards.forEach(card => { card.style.minHeight = ''; });

      const collapsed = readyCards.filter(card => card.classList.contains('collapsed'));
      if (collapsed.length) {
        const target = Math.ceil(Math.max(...collapsed.map(card => card.getBoundingClientRect().height)));
        collapsed.forEach(card => { card.style.minHeight = target + 'px'; });
      }

      const expanded = readyCards.filter(card => !card.classList.contains('collapsed'));
      if (expanded.length > 1) {
        const target = Math.ceil(Math.max(...expanded.map(card => card.getBoundingClientRect().height)));
        expanded.forEach(card => { card.style.minHeight = target + 'px'; });
      }
    };
    const schedule = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = raf(() => {
        rafId = null;
        raf(apply);
      });
    };
    return schedule;
  })();

  priceCards.forEach(card => {
    const list = card.querySelector('.features');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('li'));
    if (items.length <= 3) return; // nothing to collapse

    // Start collapsed
    card.classList.add('collapsed');

    const computeCollapsedHeight = () => {
      const style = getComputedStyle(list);
      const gap = parseFloat(style.rowGap || style.gap || '0') || 0;
      const padTop = parseFloat(style.paddingTop || style.paddingBlockStart || '0') || 0;
      const padBottom = parseFloat(style.paddingBottom || style.paddingBlockEnd || '0') || 0;
      const visibleCount = Math.min(3, items.length);
      let total = padTop + padBottom;
      for (let i = 0; i < visibleCount; i += 1) {
        total += items[i].offsetHeight;
        if (i < visibleCount - 1) total += gap;
      }
      return total;
    };

    // Helper: animate height from current to target
    const animateHeight = (el, targetHeight, done) => {
      const from = el.getBoundingClientRect().height;
      el.style.height = from + 'px';
      // force reflow
      void el.offsetHeight;
      el.style.height = targetHeight + 'px';
      const cleanup = () => {
        el.style.height = '';
        if (typeof done === 'function') done();
      };
      let fallbackId;
      const onEnd = (event) => {
        if (event.target !== el || event.propertyName !== 'height') return;
        el.removeEventListener('transitionend', onEnd);
        if (fallbackId) clearTimeout(fallbackId);
        cleanup();
      };
      el.addEventListener('transitionend', onEnd);
      const style = getComputedStyle(el);
      const parseTime = (value) => {
        const num = parseFloat(value);
        if (Number.isNaN(num)) return 0;
        return value.trim().toLowerCase().endsWith('ms') ? num : num * 1000;
      };
      const duration = (style.transitionDuration || '').split(',')[0] || '0s';
      const delay = (style.transitionDelay || '').split(',')[0] || '0s';
      const total = Math.max(30, parseTime(duration) + parseTime(delay) + 30);
      fallbackId = setTimeout(() => {
        el.removeEventListener('transitionend', onEnd);
        cleanup();
      }, total);
    };

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost toggle-features';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Alle Vorteile anzeigen';
    btn.addEventListener('click', () => {
      const currentlyCollapsed = card.classList.contains('collapsed');
      card.classList.add('is-transitioning');
      if (currentlyCollapsed) {
        // expand: measure target height with all items visible
        const hCollapsed = computeCollapsedHeight();
        card.classList.remove('collapsed');
        const hExpanded = list.scrollHeight;
        // revert DOM state for animation start
        card.classList.add('collapsed');
        list.style.height = hCollapsed + 'px';
        card.style.minHeight = '';
        // next frame: switch to expanded + animate
        requestAnimationFrame(() => {
          card.classList.remove('collapsed');
          animateHeight(list, hExpanded, () => {
            card.classList.remove('is-transitioning');
            scheduleEqualHeights();
          });
        });
        btn.textContent = 'Weniger anzeigen';
        btn.setAttribute('aria-expanded', 'true');
      } else {
        // collapse: measure current and target collapsed height
        const hExpanded = list.getBoundingClientRect().height;
        const hCollapsed = computeCollapsedHeight();
        list.style.height = hExpanded + 'px';
        card.style.minHeight = '';
        requestAnimationFrame(() => {
          card.classList.add('collapsed');
          animateHeight(list, hCollapsed, () => {
            card.style.minHeight = '';
            card.classList.remove('is-transitioning');
            scheduleEqualHeights();
          });
        });
        btn.textContent = 'Alle Vorteile anzeigen';
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    // Insert after the features list but before primary CTA if present
    const actions = card.querySelector('.card-actions');
    if (actions) {
      actions.insertBefore(btn, actions.firstElementChild || null);
    } else {
      const cta = card.querySelector('.btn.btn-primary');
      if (cta && cta.parentElement) {
        cta.parentElement.insertBefore(btn, cta);
      } else {
        list.insertAdjacentElement('afterend', btn);
      }
    }
  });
  if (priceCards.length) {
    requestAnimationFrame(scheduleEqualHeights);
    window.addEventListener('resize', scheduleEqualHeights);
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const item = btn.closest('.faq-item');
      btn.setAttribute('aria-expanded', String(!expanded));
      if (item) item.classList.toggle('open', !expanded);
    });
  });

  // Tilt effect on cards
  const tilts = document.querySelectorAll('.tilt');
  const canHover = window.matchMedia('(hover: hover)').matches;
  if (canHover && tilts.length) {
    tilts.forEach(el => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 2 - 1;
        const py = (y / rect.height) * 2 - 1;
        const rx = (-py * 14).toFixed(2);
        const ry = (px * 18).toFixed(2);
        const dist = Math.min(1, Math.sqrt(px * px + py * py));
        const scale = 1.02 + dist * 0.03;
        el.style.setProperty('--rx', rx + 'deg');
        el.style.setProperty('--ry', ry + 'deg');
        el.style.setProperty('--mx', (x / rect.width * 100).toFixed(2) + '%');
        el.style.setProperty('--my', (y / rect.height * 100).toFixed(2) + '%');
        el.style.setProperty('--tilt-scale', scale.toFixed(3));
      };
      const reset = () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--tilt-scale', '1');
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseenter', onMove);
      el.addEventListener('mouseleave', reset);
    });
  }

  // Pointer highlight for project cards
  document.querySelectorAll('.card.project').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mx', (x / rect.width * 100).toFixed(2) + '%');
      el.style.setProperty('--my', (y / rect.height * 100).toFixed(2) + '%');
    });
  });

  if (canHover) {
    document.querySelectorAll('#stats .stat').forEach(el => {
      const setPos = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mx', (x / rect.width * 100).toFixed(2) + '%');
        el.style.setProperty('--my', (y / rect.height * 100).toFixed(2) + '%');
      };
      const reset = () => {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      };
      el.addEventListener('mousemove', setPos);
      el.addEventListener('mouseenter', setPos);
      el.addEventListener('mouseleave', reset);
    });
  }

  // Pointer for process steps glow
  document.querySelectorAll('#process .step').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
    });
  });

  // Count-up animation for stats
  // Selector deckt .stat .value (Markt-Stats), .lh-num (Lighthouse) und
  // beliebige [data-count]-Elemente in den neuen Highlight-Karten ab.
  const statValues = document.querySelectorAll('[data-count]');
  if (statValues.length) {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io2.unobserve(el);
        const text = el.textContent || '';
        const suffix = text.replace(/[\d.,]/g, '');
        const target = Number(el.getAttribute('data-count')) || 0;
        const start = 0;
        const dur = 900;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const val = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 3)));
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    statValues.forEach(el => io2.observe(el));
  }

  // Process flow: trigger sequential highlight once the section is visible
  const processFlow = document.querySelector('#process .process');
  if (processFlow) {
    const flowObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        processFlow.classList.add('flow-visible');
        obs.unobserve(processFlow);
      });
    }, { threshold: 0.35 });
    flowObserver.observe(processFlow);
  }

  // Projects: trigger coordinated entrance once section enters viewport
  const projectsTrack = document.getElementById('projects-track');
  const portfolioObserveTarget = document.getElementById('portfolio-scroll') || projectsTrack;
  if (projectsTrack && portfolioObserveTarget) {
    const projectsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        projectsTrack.classList.add('flow-visible');
        obs.unobserve(portfolioObserveTarget);
      });
    }, { threshold: 0.05 });
    projectsObserver.observe(portfolioObserveTarget);
  }

  // Stats: enable soft glow animation after entering viewport
  const statsGrid = document.querySelector('#stats .stats-grid');
  if (statsGrid) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statsGrid.classList.add('glow-visible');
        obs.unobserve(statsGrid);
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsGrid);
  }

  // ─── Parallax ─────────────────────────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const heroVisual = document.getElementById('hero-visual');

    // Hero visual: raw-scrollY based (works best for top-of-page element)
    if (heroVisual) {
      window.addEventListener('scroll', () => {
        if (window.innerWidth < 980) { heroVisual.style.transform = ''; return; }
        heroVisual.style.transform = 'translateY(' + (window.scrollY * 0.28).toFixed(1) + 'px)';
      }, { passive: true });
    }

    // Section elements: distance-from-viewport-centre based
    // Elements above centre drift upward; below centre drift downward → natural depth feel
    const pxItems = [
      { sel: '.hero-bg',     factor: 0.18, minW: 0   },
      { sel: '.about-media', factor: 0.06, minW: 720 },
      { sel: '.price-grid',  factor: 0.08, minW: 720 },
    ].map(cfg => ({ ...cfg, el: document.querySelector(cfg.sel) }))
     .filter(cfg => cfg.el);

    if (pxItems.length) {
      const tick = () => {
        const vh2 = window.innerHeight / 2;
        pxItems.forEach(({ el, factor, minW }) => {
          if (window.innerWidth < minW) { el.style.transform = ''; return; }
          const rect = el.getBoundingClientRect();
          const dist = (rect.top + rect.height / 2) - vh2;
          el.style.transform = 'translateY(' + (dist * factor).toFixed(1) + 'px)';
        });
      };
      window.addEventListener('scroll', tick, { passive: true });
      window.addEventListener('resize', tick);
      tick();
    }
  }

  // Portfolio section: twinkling star canvas (desktop only, disabled on reduced-motion)
  const portfolioSticky = document.querySelector('#portfolio-scroll .h-scroll-sticky');
  if (portfolioSticky && !prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.className = 'portfolio-stars';
    portfolioSticky.insertAdjacentElement('afterbegin', canvas);
    const ctx = canvas.getContext('2d');
    let stars = [];

    const resize = () => {
      canvas.width  = portfolioSticky.clientWidth  || window.innerWidth;
      canvas.height = portfolioSticky.clientHeight || window.innerHeight;
      stars = Array.from({ length: 110 }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.0 + 0.3,
        base:  Math.random() * 0.28 + 0.06,
        speed: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    let t = 0;
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.007;
      for (const s of stars) {
        const a = s.base + Math.sin(t * s.speed + s.phase) * s.base * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.fill();
      }
      requestAnimationFrame(drawStars);
    };

    window.addEventListener('load', resize);
    window.addEventListener('resize', resize, { passive: true });
    resize();
    drawStars();
  }

  // Image lightbox overlay: enlarge each image onsite with ESC/outside close support
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  if (lightbox && lightboxImg) {
    let previousOverflow = '';
    const excludedImages = new Set();
    // Skip the navbar logo so it keeps its jump-to-top behaviour
    const navLogo = document.querySelector('.site-header .brand-logo');
    if (navLogo) excludedImages.add(navLogo);
    const lockScroll = () => {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    };
    const unlockScroll = () => {
      if (previousOverflow) {
        document.body.style.overflow = previousOverflow;
      } else {
        document.body.style.removeProperty('overflow');
      }
      previousOverflow = '';
    };
    const closeLightbox = () => {
      if (!lightbox.classList.contains('is-visible')) return;
      lightbox.classList.remove('is-visible');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.removeAttribute('src');
      lightboxImg.alt = '';
      unlockScroll();
    };
    const openLightbox = (img) => {
      const src = img.currentSrc || img.src;
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('is-visible');
      lightbox.setAttribute('aria-hidden', 'false');
      lockScroll();
      lightbox.focus({ preventScroll: true });
    };
    document.querySelectorAll('img').forEach(img => {
      if (img.closest('.lightbox') || excludedImages.has(img)) return;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        event.stopPropagation();
        openLightbox(img);
      });
    });
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }
});

function initSlider({ trackSelector, prevSelector, nextSelector, breakpoints }) {
  const track = typeof trackSelector === 'string' ? document.querySelector(trackSelector) : trackSelector;
  if (!track) return null;
  const slides = Array.from(track.children).filter(el => el.nodeType === 1);
  if (!slides.length) return null;
  const prev = prevSelector ? document.querySelector(prevSelector) : null;
  const next = nextSelector ? document.querySelector(nextSelector) : null;
  const bps = (breakpoints && breakpoints.length ? breakpoints : [{ width: 0, perView: 1 }])
    .slice().sort((a, b) => a.width - b.width);

  let perView = 1;
  let index = 0;
  let maxIndex = Math.max(0, slides.length - perView);
  const listeners = new Set();

  const setPerView = () => {
    const viewport = window.innerWidth || document.documentElement.clientWidth;
    let candidate = bps[0].perView;
    bps.forEach(bp => {
      if (viewport >= bp.width) candidate = bp.perView;
    });
    candidate = Math.max(1, Math.min(candidate, slides.length));
    perView = candidate;
    track.style.setProperty('--slides-per-view', String(perView));
    maxIndex = Math.max(0, slides.length - perView);
  };

  const emit = () => {
    const state = { index, perView, count: slides.length };
    listeners.forEach(fn => fn(state));
  };

  const goTo = (targetIndex, smooth = true) => {
    const clamped = Math.max(0, Math.min(maxIndex, targetIndex));
    index = clamped;
    const slide = slides[clamped];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
    emit();
  };

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  let scrollTimer = 0;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const { scrollLeft } = track;
      let closest = 0;
      let best = Infinity;
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft - scrollLeft);
        if (dist < best) {
          best = dist;
          closest = i;
        }
      });
      if (closest !== index) {
        index = closest;
        emit();
      }
    }, 80);
  }, { passive: true });

  window.addEventListener('resize', () => {
    const previousIndex = index;
    setPerView();
    index = Math.min(previousIndex, maxIndex);
    goTo(index, false);
  });

  setPerView();
  goTo(0, false);

  return {
    track,
    slides,
    goTo,
    onChange(fn) {
      if (typeof fn === 'function') {
        listeners.add(fn);
        fn({ index, perView, count: slides.length });
      }
      return () => listeners.delete(fn);
    }
  };
}
