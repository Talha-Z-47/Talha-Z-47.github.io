(function () {
  var root = document.documentElement, btn = document.getElementById('theme-toggle');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme: dark by default, choice is remembered
  function apply(v) {
    root.dataset.theme = v;
    if (!btn) return;
    btn.textContent = v === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', v === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  apply(root.dataset.theme === 'light' ? 'light' : 'dark');

  // Typing animation
  var el = document.getElementById('typed');
  if (el) {
    var phrases = [
      'am in my senior year of high school.',
      'aspire to be an astrophysicist.',
      'love physics.',
      'am drawn to variable stars, exoplanets and atmospheric science.',
      'listen to music.',
      'read a book now and then.'
    ];
    if (reduce) { el.textContent = phrases[1]; }
    else {
      var p = 0, c = 0, del = false;
      (function type() {
        var s = phrases[p];
        el.textContent = s.slice(0, del ? --c : ++c);
        var wait = del ? 35 : 70;
        if (!del && c === s.length) { del = true; wait = 1800; }
        else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; wait = 400; }
        setTimeout(type, wait);
      })();
    }
  }

  // Light curve of a pulsating variable star
  var cv = document.getElementById('curve');
  if (cv) {
    var x = cv.getContext('2d');
    var shape = function (ph) {
      ph -= Math.floor(ph);
      return ph < 0.18 ? Math.pow(ph / 0.18, 0.8) : Math.pow(1 - (ph - 0.18) / 0.82, 1.6);
    };
    var draw = function (ts) {
      var d = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== Math.round(w * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); }
      x.setTransform(d, 0, 0, d, 0, 0);
      x.clearRect(0, 0, w, h);
      var s = getComputedStyle(root),
          col = s.getPropertyValue('--accent').trim(),
          mu = s.getPropertyValue('--muted').trim(),
          ln = s.getPropertyValue('--line').trim();
      var off = reduce ? 0 : ts / 7000, top = 30, bot = h - 34;
      var y = function (v) { return bot - 8 - v * (bot - top - 8); };
      var ph = function (i) { return i / w * 2.5 - off; };
      x.strokeStyle = ln; x.lineWidth = 1;
      x.beginPath(); x.moveTo(0, bot); x.lineTo(w, bot); x.stroke();
      x.fillStyle = mu; x.font = '12px Instrument Sans, sans-serif';
      x.fillText('brightness', 12, 20);
      x.fillText('time', w - 40, h - 12);
      x.beginPath();
      for (var i = 0; i <= w; i += 2) { i ? x.lineTo(i, y(shape(ph(i)))) : x.moveTo(i, y(shape(ph(i)))); }
      x.strokeStyle = col; x.lineWidth = 2; x.stroke();
      x.fillStyle = mu;
      for (var j = 6; j < w; j += 11) {
        x.beginPath();
        x.arc(j, y(shape(ph(j))) + Math.sin(j * 91.7) * 5, 1.6, 0, 6.3);
        x.fill();
      }
      x.fillStyle = col; x.beginPath(); x.arc(w - 6, y(shape(ph(w - 6))), 4.5, 0, 6.3); x.fill();
      if (!reduce) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    if (reduce) {
      addEventListener('resize', function () { draw(0); });
      if (btn) btn.addEventListener('click', function () { setTimeout(function () { draw(0); }, 0); });
    }
  }

  if (btn) btn.addEventListener('click', function () {
    var v = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(v);
    try { localStorage.setItem('theme', v); } catch (e) {}
  });
})();
