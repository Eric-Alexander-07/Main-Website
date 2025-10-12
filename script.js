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
});

