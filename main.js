document.getElementById('menu-toggle').addEventListener('click', function () {
  document.getElementById('nav-links').classList.toggle('open');
});

// Dark mode toggle (remembers choice using localStorage)
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  if (themeToggle) themeToggle.textContent = '☀️';
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️';
    }
  });
}

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

window.addEventListener('pageshow', () => {
  const overlay = document.getElementById('page-transition');
  if (overlay) overlay.classList.remove('fading');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
