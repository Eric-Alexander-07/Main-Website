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

    // Star rating (localStorage)
    const setStars = (wrap, value) => {
      wrap.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < value));
    };
    slides.forEach(slide => {
      const id = slide.getAttribute('data-id');
      const wrap = slide.querySelector('.stars');
      if (!wrap || !id) return;
      const saved = Number(localStorage.getItem(`rating:${id}`) || 0);
      if (saved) setStars(wrap, saved);
      wrap.querySelectorAll('.star').forEach(btn => btn.addEventListener('click', () => {
        const value = Number(btn.getAttribute('data-value')) || 0;
        localStorage.setItem(`rating:${id}`, String(value));
        setStars(wrap, value);
      }));
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const controls = btn.getAttribute('aria-controls');
      const item = btn.closest('.faq-item');
      const panel = controls ? document.getElementById(controls) : null;
      btn.setAttribute('aria-expanded', String(!expanded));
      if (!panel || !item) return;
      const tidy = () => { panel.style.maxHeight = ''; panel.removeEventListener('transitionend', tidy); };
      if (expanded) {
        // close
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panel.style.maxHeight = '0px';
          item.classList.remove('open');
          panel.addEventListener('transitionend', () => { panel.hidden = true; tidy(); }, { once: true });
        });
      } else {
        // open
        panel.hidden = false;
        const h = panel.scrollHeight;
        panel.style.maxHeight = '0px';
        item.classList.add('open');
        requestAnimationFrame(() => { panel.style.maxHeight = h + 'px'; });
        panel.addEventListener('transitionend', tidy, { once: true });
      }
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
        const rx = (-py * 6).toFixed(2);
        const ry = (px * 8).toFixed(2);
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
