// Scroll-driven interactions: section reveal, staggered children, drawn
// rules, parallax, pull-quote scroll-fill, and the horizontal photo strip.
// Ported from the design handoff prototype. Disabled under prefers-reduced-motion.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = 'cubic-bezier(.22,.61,.36,1)';

  // Section reveal
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  reveals.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
    el.style.transition = 'opacity .8s ' + ease + ', transform .8s ' + ease;
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(function (el) { io.observe(el); });

  if (reduced) return;

  // Staggered children
  var staggers = Array.prototype.slice.call(document.querySelectorAll('[data-stagger]'));
  staggers.forEach(function (c) {
    Array.prototype.forEach.call(c.children, function (ch, i) {
      ch.style.opacity = '0';
      ch.style.transform = 'translateY(16px)';
      ch.style.transition = 'opacity .55s ' + ease + ', transform .55s ' + ease;
      ch.style.transitionDelay = (i * 80) + 'ms';
    });
  });
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Array.prototype.forEach.call(e.target.children, function (ch) {
        ch.style.opacity = '1';
        ch.style.transform = 'none';
      });
      io2.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  staggers.forEach(function (c) { io2.observe(c); });

  // Drawn rules above day cards
  var lines = Array.prototype.slice.call(document.querySelectorAll('[data-drawline]'));
  lines.forEach(function (l) { l.style.transition = 'transform 1.1s ' + ease; });
  var io3 = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.transform = 'scaleX(1)';
      io3.unobserve(e.target);
    });
  }, { threshold: 0.9 });
  lines.forEach(function (l) { io3.observe(l); });

  var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  px.forEach(function (el) { el.style.willChange = 'transform'; });

  var fills = Array.prototype.slice.call(document.querySelectorAll('[data-fill]'));
  fills.forEach(function (q) {
    q.style.webkitBackgroundClip = 'text';
    q.style.backgroundClip = 'text';
    q.style.color = 'transparent';
    q.style.backgroundImage = 'linear-gradient(180deg, #14110D 0%, #B9B2A6 0%)';
  });

  var strip = document.querySelector('[data-hstrip]');
  var stripRow = strip ? strip.firstElementChild : null;
  if (stripRow) stripRow.style.willChange = 'transform';

  var progress = document.querySelector('[data-progress]');

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;

    px.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      var off = (r.top + r.height / 2 - vh / 2) * speed;
      el.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
    });

    if (progress) {
      var max = document.documentElement.scrollHeight - vh;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0).toFixed(4) + ')';
    }

    fills.forEach(function (q) {
      var r = q.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.55)));
      var pct = (p * 100).toFixed(1) + '%';
      q.style.backgroundImage = 'linear-gradient(180deg, #14110D ' + pct + ', #B9B2A6 ' + pct + ')';
    });

    if (stripRow) {
      var sr = strip.getBoundingClientRect();
      var sp = Math.min(1, Math.max(0, (vh - sr.top) / (vh + sr.height)));
      var smax = stripRow.scrollWidth - strip.clientWidth;
      if (smax > 0) stripRow.style.transform = 'translateX(' + (-sp * smax).toFixed(1) + 'px)';
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
