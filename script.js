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
      setNote('Bitte fülle alle Felder aus.', 'error');
      return;
    }
    const subject = encodeURIComponent(`Projektanfrage von ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${msg}`);
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setNote('Öffne E-Mail-Programm...', 'ok');
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
        <div class="label">mobiler Besuche brechen ab, wenn das Laden laenger als 3 Sekunden dauert.</div>
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
  } catch {}

  // Testimonials: scroll-snap focus + dots
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');
  const btnPrev = document.getElementById('t-prev');
  const btnNext = document.getElementById('t-next');
  if (track && dotsWrap && btnPrev && btnNext) {
    const slides = Array.from(track.querySelectorAll('.slide'));
    // On mobile, start at the first slide; on larger screens center-start at 2nd if available
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    const initialIndex = isMobile ? 0 : (slides.length > 1 ? 1 : 0);
    let index = initialIndex;

    const createDots = () => {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'dot' + (i === initialIndex ? ' active' : '');
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
      });
    };
    createDots();
    const dots = Array.from(dotsWrap.children);

    const setActive = (i) => {
      slides.forEach((s, si) => s.classList.toggle('is-active', si === i));
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
    };

    // Centering helpers
    const centerPad = () => Math.max(0, (track.clientWidth - (slides[0]?.clientWidth || 0)) / 2);
    const positionOf = (i) => {
      const s = slides[i];
      if (!s) return 0;
      const left = s.offsetLeft;
      return left - (track.clientWidth - s.clientWidth) / 2; // align center of slide to center of track
    };
    let isProgrammaticScroll = false;
    let programmaticTimer = 0;
    const scheduleRelease = () => {
      clearTimeout(programmaticTimer);
      programmaticTimer = window.setTimeout(() => {
        isProgrammaticScroll = false;
        setActive(index);
      }, 360);
    };
    const go = (i, smooth = true) => {
      index = (i + slides.length) % slides.length;
      setActive(index);
      if (!smooth) {
        track.scrollTo({ left: positionOf(index), behavior: 'auto' });
        clearTimeout(programmaticTimer);
        isProgrammaticScroll = false;
        return;
      }
      isProgrammaticScroll = true;
      track.scrollTo({ left: positionOf(index), behavior: 'smooth' });
      scheduleRelease();
    };
    const updateIndexByScroll = () => {
      if (isProgrammaticScroll) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0; let bestDist = Infinity;
      slides.forEach((s, i) => {
        const sCenter = s.offsetLeft + s.clientWidth / 2;
        const dist = Math.abs(sCenter - center);
        if (dist < bestDist) { best = i; bestDist = dist; }
      });
      if (best !== index) { index = best; setActive(index); }
    };

    // Initialize padding so first/last can be centered cleanly
    const resize = () => {
      const pad = centerPad();
      track.style.paddingLeft = pad + 'px';
      track.style.paddingRight = pad + 'px';
      go(index, false);
    };
    window.addEventListener('resize', resize);
    resize();
    // start at slide 2 if vorhanden
    if (initialIndex) go(initialIndex, false);

    // Controls
    btnPrev.addEventListener('click', () => go(index - 1));
    btnNext.addEventListener('click', () => go(index + 1));
    track.addEventListener('scroll', () => {
      updateIndexByScroll();
    }, { passive: true });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    // Static star ratings from data attribute
    const setStars = (wrap, value) => {
      wrap.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < value));
    };
    slides.forEach(slide => {
      const rating = Math.min(5, Math.max(0, Number(slide.getAttribute('data-rating') || 0)));
      const wrap = slide.querySelector('.stars');
      if (wrap) {
        wrap.querySelectorAll('.star').forEach((s, i) => {
          s.textContent = '';
          s.classList.toggle('active', i < rating);
        });
      }
    });
  }

  // Projects horizontal wheel -> horizontal scroll only
  const projects = document.getElementById('projects-track');
  const pPrev = document.getElementById('p-prev');
  const pNext = document.getElementById('p-next');
  if (projects) {
    // wheel -> horizontal
    projects.addEventListener('wheel', (e) => {
      // convert vertical wheel to horizontal while hovering projects
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        projects.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    const items = Array.from(projects.querySelectorAll('.project'));
    let pIndex = 0;
    let usePad = false;
    const padProjects = () => {
      const w = items[0]?.clientWidth || projects.clientWidth;
      const style = getComputedStyle(projects);
      const gap = parseFloat(style.gap || style.columnGap || '0') || 0;
      const visible = Math.max(1, Math.floor((projects.clientWidth + gap) / (w + gap)));
      // Wenn genug Karten vorhanden sind, um den View auszufüllen, kein Padding links/rechts
      usePad = items.length < visible;
      const pad = usePad ? Math.max(0, (projects.clientWidth - w) / 2) : 0;
      projects.style.paddingLeft = pad + 'px';
      projects.style.paddingRight = pad + 'px';
    };
    window.addEventListener('resize', padProjects);
    padProjects();

    const pGo = (i, smooth = true) => {
      pIndex = Math.max(0, Math.min(items.length - 1, i));
      const s = items[pIndex];
      if (!s) return;
      let left = s.offsetLeft - (projects.clientWidth - s.clientWidth) / 2;
      if (!usePad) left = s.offsetLeft; // bei vollem View flush links starten
      const maxLeft = projects.scrollWidth - projects.clientWidth;
      left = Math.max(0, Math.min(maxLeft, left));
      projects.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    };
    pPrev?.addEventListener('click', () => pGo(pIndex - 1));
    pNext?.addEventListener('click', () => pGo(pIndex + 1));
    // start: wenn Padding aktiv (zu wenige Karten) -> zentriere erste, sonst flush links
    if (usePad) pGo(0, false); else projects.scrollLeft = 0;
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
      el.style.position = 'relative';
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 2 - 1; // -1 .. 1
        const py = (y / rect.height) * 2 - 1;
        const rx = (-py * 10).toFixed(2);
        const ry = (px * 14).toFixed(2);
        el.style.setProperty('--rx', rx + 'deg');
        el.style.setProperty('--ry', ry + 'deg');
        el.style.setProperty('--mx', (x / rect.width * 100).toFixed(2) + '%');
        el.style.setProperty('--my', (y / rect.height * 100).toFixed(2) + '%');
      };
      const reset = () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      };
      el.addEventListener('mousemove', onMove);
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

  // Pointer for process steps glow
  document.querySelectorAll('#process .step').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
    });
  });

  // Count-up animation for stats
  const statValues = document.querySelectorAll('.stat .value[data-count]');
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
});
