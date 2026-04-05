// Mobile nav toggle
document.getElementById('menu-toggle').addEventListener('click', function () {
  document.getElementById('nav-links').classList.toggle('open');
});

// Simple fade transition between pages
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const overlay = document.getElementById('page-transition');
    overlay.classList.add('fading');
    setTimeout(() => { window.location.href = href; }, 220);
  });
});

// Fade overlay out on arrival
window.addEventListener('pageshow', () => {
  const overlay = document.getElementById('page-transition');
  if (overlay) overlay.classList.remove('fading');
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
