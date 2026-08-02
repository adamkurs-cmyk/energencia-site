// Scroll-driven interactions for the Energencia landing page.
// Vanilla JS port of the design handoff's GSAP/ScrollTrigger choreography —
// same visual language, no third-party animation library. Disabled under
// prefers-reduced-motion.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = 'cubic-bezier(.22,.61,.36,1)';

  // ---- Header height custom property (used by sticky hero + day-cards) ----
  var header = document.querySelector('[data-header]');
  function setHeaderHeight() {
    if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  // ---- Ensure background videos actually autoplay on mobile ----
  // A below-the-fold <video autoplay> is unreliable on iOS/mobile Safari —
  // it can stay paused until an explicit play() call fires after the
  // element is actually on screen. This guarantees playback starts (and
  // resumes if the OS paused it) once each video scrolls into view.
  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    var tryPlay = function () { v.play().catch(function () {}); };
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) tryPlay(); });
    }, { threshold: 0.15 });
    vio.observe(v);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) tryPlay();
    });
  });

  // ---- Word-split headlines (data-split) ----
  document.querySelectorAll('[data-split]').forEach(function (h) {
    var words = h.textContent.split(/\s+/).filter(Boolean);
    h.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.style.display = 'inline-block';
      s.style.opacity = '0';
      s.style.transform = 'translateY(50%)';
      s.style.transition = 'opacity .7s ' + ease + ', transform .7s ' + ease;
      s.style.transitionDelay = (i * 60) + 'ms';
      s.textContent = w + (i < words.length - 1 ? ' ' : '');
      h.appendChild(s);
    });
  });
  var splitIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Array.prototype.forEach.call(e.target.children, function (s) {
        s.style.opacity = '1';
        s.style.transform = 'none';
      });
      splitIO.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-split]').forEach(function (h) { splitIO.observe(h); });

  // ---- Fade-up reveals ----
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  reveals.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .9s ' + ease + ', transform .9s ' + ease;
  });
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(function (el) { revealIO.observe(el); });

  // ---- Staggered children ----
  var staggers = Array.prototype.slice.call(document.querySelectorAll('[data-stagger]'));
  staggers.forEach(function (c) {
    Array.prototype.forEach.call(c.children, function (ch, i) {
      ch.style.opacity = '0';
      ch.style.transform = 'translateY(14px)';
      ch.style.transition = 'opacity .7s ' + ease + ', transform .7s ' + ease;
      ch.style.transitionDelay = (i * 90) + 'ms';
    });
  });
  var staggerIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Array.prototype.forEach.call(e.target.children, function (ch) {
        ch.style.opacity = '1';
        ch.style.transform = 'none';
      });
      staggerIO.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  staggers.forEach(function (c) { staggerIO.observe(c); });

  // ---- Card stack tumble (Voices) ----
  document.querySelectorAll('[data-cards]').forEach(function (grid) {
    var cards = Array.prototype.slice.call(grid.children);
    cards.forEach(function (card, i) {
      var base = card.style.transform || '';
      card.dataset.baseTransform = base;
      card.style.transform = base + ' translateY(40px)';
      card.style.opacity = '0';
      card.style.transition = 'opacity .8s ' + ease + ', transform .8s ' + ease;
      card.style.transitionDelay = (i * 130) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cards.forEach(function (card) {
          card.style.opacity = '1';
          card.style.transform = card.dataset.baseTransform;
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    io.observe(grid);
  });

  // ---- Price count-up ----
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var start = null;
        var duration = 1100;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    io.observe(el);
  });

  // ---- Header collapse on scroll past hero ----
  var wordmark = document.querySelector('[data-wordmark]');
  var headnav = document.querySelector('[data-headnav]');
  var heroEnd = document.querySelector('[data-hero-end]');
  if (header && heroEnd) {
    var headerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var scrolledPast = e.boundingClientRect.top <= header.offsetHeight;
        if (scrolledPast) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      });
    }, { threshold: [0, 1], rootMargin: '-' + (header.offsetHeight) + 'px 0px 0px 0px' });
    headerIO.observe(heroEnd);
  }

  if (reduced) return;

  // ---- Marquee (CSS animation; nothing else to wire) ----

  // ---- Drawn rules above day cards ----
  var lines = Array.prototype.slice.call(document.querySelectorAll('[data-drawline]'));
  lines.forEach(function (l) { l.style.transition = 'transform 1.1s ' + ease; });
  var lineIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.transform = 'scaleX(1)';
      lineIO.unobserve(e.target);
    });
  }, { threshold: 0.85 });
  lines.forEach(function (l) { lineIO.observe(l); });

  // ---- Parallax (data-speed) ----
  var speedEls = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
  speedEls.forEach(function (el) { el.style.willChange = 'transform'; });

  // ---- Quote scene: pinned, words light up as you scroll through ----
  var scene = document.querySelector('[data-scene-quote]');
  var sceneWords = null, sceneWrap = null;
  if (scene) {
    var q = scene.querySelector('[data-scene-words]');
    var words = q.textContent.split(/\s+/).filter(Boolean);
    q.textContent = '';
    sceneWords = words.map(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w + (i < words.length - 1 ? ' ' : '');
      s.style.opacity = '0.18';
      s.style.transition = 'opacity .2s linear';
      q.appendChild(s);
      return s;
    });
    // Progress must be measured against the tall outer wrapper (scene itself, 260svh)
    // not the inner position:sticky layer — the sticky layer's own height always
    // equals the viewport, so measuring against it gave a zero scroll range and the
    // words never lit up.
    sceneWrap = scene;
  }

  // ---- Facts curtain: photo panel rises to cover the stat grid ----
  var curtain = document.querySelector('[data-photogrid]');
  var curtainWrap = curtain ? curtain.closest('[data-pinwrap]') : null;

  // ---- Scroll-scrubbed reveal (03 — What you'll learn list + closing note) ----
  var scrubList = document.querySelector('[data-scrublist]');
  var scrubItems = scrubList ? Array.prototype.slice.call(scrubList.children) : [];
  scrubItems.forEach(function (li) {
    li.style.opacity = '0';
    li.style.transform = 'translateY(56px)';
  });
  var scrubTail = document.querySelector('[data-scrubtail]');
  if (scrubTail) {
    scrubTail.style.opacity = '0';
    scrubTail.style.transform = 'translateY(56px)';
  }

  // ---- Header progress bar ----
  var progress = document.querySelector('[data-progress]');

  // ---- Day-card scale-away as the next card stacks over it ----
  var daycards = Array.prototype.slice.call(document.querySelectorAll('[data-daycard]'));

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;

    speedEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      // Skip elements nowhere near the viewport — on first paint (scrollY 0),
      // a far-below-the-fold element would otherwise get a huge one-off
      // translateY baked in before any real scroll event ever recalculates it,
      // visually displacing the image into unrelated sections.
      if (r.bottom < -vh || r.top > vh * 2) return;
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
      var off = (r.top + r.height / 2 - vh / 2) * speed * 0.3;
      el.style.transform = (el.dataset.baseTransform || '') + ' translateY(' + off.toFixed(1) + 'px)';
    });

    if (sceneWrap && sceneWords) {
      var sr = sceneWrap.getBoundingClientRect();
      var srange = sceneWrap.offsetHeight - vh;
      var sp = srange > 0 ? Math.min(1, Math.max(0, -sr.top / srange)) : 0;
      var lit = Math.round(sp * sceneWords.length);
      sceneWords.forEach(function (s, i) { s.style.opacity = i < lit ? '1' : '0.18'; });
    }

    if (curtain && curtainWrap) {
      var cr = curtainWrap.getBoundingClientRect();
      var crange = curtainWrap.offsetHeight - vh;
      var cp = crange > 0 ? Math.min(1, Math.max(0, -cr.top / crange)) : 0;
      curtain.style.transform = 'translateY(' + ((1 - cp) * 100).toFixed(1) + '%)';
    }

    scrubItems.forEach(function (li) {
      var r = li.getBoundingClientRect();
      // A short, fixed-pixel window (not viewport-relative) so each line's fade
      // completes well before the next line (spaced ~70-90px apart) starts —
      // that's what makes them pop in one after another as you scroll, instead
      // of every visible line cross-fading together as one smooth wave.
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / 60));
      li.style.opacity = p.toFixed(3);
      li.style.transform = 'translateY(' + ((1 - p) * 56).toFixed(1) + 'px)';
    });
    if (scrubTail) {
      var tr = scrubTail.getBoundingClientRect();
      var tp = Math.min(1, Math.max(0, (vh * 0.85 - tr.top) / 60));
      scrubTail.style.opacity = tp.toFixed(3);
      scrubTail.style.transform = 'translateY(' + ((1 - tp) * 56).toFixed(1) + 'px)';
    }

    daycards.forEach(function (card, i) {
      var next = daycards[i + 1];
      if (!next) return;
      var nr = next.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.9 - nr.top) / (vh * 0.65)));
      card.style.transform = 'scale(' + (1 - p * 0.06).toFixed(3) + ')';
      card.style.opacity = (1 - p * 0.25).toFixed(3);
    });

    if (progress) {
      var maxScroll = document.documentElement.scrollHeight - vh;
      progress.style.transform = 'scaleX(' + (maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0).toFixed(4) + ')';
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
