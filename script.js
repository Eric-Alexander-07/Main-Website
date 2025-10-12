// Config: change to your real email/phone
const CONTACT_EMAIL = 'kontakt@deine-domain.tld';
const WHATSAPP_NUMBER = '4915123456789'; // e.g. 49 + number without leading 0

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
    let index = 0;

    const resize = () => {
      // ensure slides are full width of container
      const w = track.clientWidth;
      slides.forEach(s => s.style.minWidth = `${w}px`);
      go(index, false);
    };

    // dots
    slides.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    const setActive = (i) => {
      slides.forEach((s, si) => s.classList.toggle('is-active', si === i));
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
    };
    const go = (i, animate = true) => {
      index = (i + slides.length) % slides.length;
      const offset = -index * track.clientWidth;
      track.style.transition = animate ? 'transform .35s ease' : 'none';
      track.style.transform = `translateX(${offset}px)`;
      setActive(index);
    };
    btnPrev.addEventListener('click', () => go(index - 1));
    btnNext.addEventListener('click', () => go(index + 1));
    window.addEventListener('resize', resize);
    resize();

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
      const rating = Number(slide.getAttribute('data-rating') || 0);
      const wrap = slide.querySelector('.stars');
      if (wrap && rating) setStars(wrap, rating);
    });
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
