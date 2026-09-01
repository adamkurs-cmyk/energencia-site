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
    if (v.dataset.rate) v.playbackRate = parseFloat(v.dataset.rate);
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

  // ---- Treatments page: sessions switcher (tabs + scroll sentinels) ----
  // State lives here, not in a framework — render() just writes the active
  // session's fields into the one card shell already in the DOM. sSentinels/
  // sessionsWrap/sRender/sActive default here (rather than only inside the
  // `if` below) so update()'s scroll-driven check further down can safely
  // reference them even on pages without a sessions switcher at all.
  var sessionsRoot = document.querySelector('[data-sessions]');
  var sessionsWrap = null, sSentinels = [], sRender = null, sActive = 0;
  if (sessionsRoot) {
    sessionsWrap = sessionsRoot.querySelector('.tp-switcher');
    var SESSIONS = [
      { name: 'Sound Massage', durationLabel: '60/90 min · €60–85',
        description: 'You lie down, fully clothed, face down and then face up, while therapeutic singing bowls are placed on and around your body and played. The massage is the vibration itself, moving through you and carried by the water in your body, softening the nervous system and letting everything settle.',
        tags: ['Lie down', 'Fully clothed', '60 or 90 min', 'Nothing to do'],
        note: 'People often come burned out, overwhelmed or unable to switch off, and leave grounded, clearer, and sleeping better.',
        quote: '“You don’t have to become calmer. Your body already knows how.”',
        priceRows: ['60 min €60', '90 min €85', '3 sessions €165'], cta: 'Book Sound Massage' },
      { name: 'Reiki', durationLabel: '60 min · €50',
        description: 'You lie comfortably on your back while I gently place my hands on, or just above, different parts of your body. The session is quiet and deeply restful. Nothing to achieve. Nothing to perform. Simply space to receive.',
        tags: ['On your back', 'Fully clothed', '60 min', 'Simply rest'],
        note: 'People often come running on empty or emotionally drained, and leave recharged, clearer, and more like themselves.',
        quote: '“Sometimes receiving is harder than giving.”',
        priceRows: ['60 min €50', '3 sessions €135'], cta: 'Book Reiki' },
      { name: 'Kundalini Activation', durationLabel: '60 min · €90',
        description: 'You lie comfortably on a mat while music plays, and I work with your energy throughout. Nothing is guided or forced. Some people experience deep relaxation. Others notice spontaneous movement, emotion, laughter, tears or insight. Every experience is different.',
        tags: ['On a mat', 'Comfortable', '60 min', 'Allow whatever comes'],
        note: 'People often come curious, or carrying something they’re ready to put down, and leave lighter, clearer, and more open.',
        quote: '“Nothing needs to happen. Whatever comes is enough.”',
        priceRows: ['60 min €90'], cta: 'Book Kundalini Activation' }
    ];
    var sTabs = Array.prototype.slice.call(sessionsRoot.querySelectorAll('[data-tab]'));
    var sPhotos = Array.prototype.slice.call(sessionsRoot.querySelectorAll('[data-photo]'));
    sSentinels = Array.prototype.slice.call(sessionsRoot.querySelectorAll('[data-sentinel]'));
    var sCard = sessionsRoot.querySelector('.tp-card-content');

    // Assigned (not declared) — sRender is a `var` above so update() can call
    // it safely on pages without a sessions switcher, where it stays null.
    sRender = function (i) {
      var s = SESSIONS[i];
      sCard.querySelector('[data-field="name"]').textContent = s.name;
      sCard.querySelector('[data-field="durationLabel"]').textContent = s.durationLabel;
      sCard.querySelector('[data-field="description"]').textContent = s.description;
      var tagsEl = sCard.querySelector('[data-field="tags"]');
      tagsEl.innerHTML = '';
      s.tags.forEach(function (t) {
        var span = document.createElement('span');
        span.className = 'tp-tag';
        span.textContent = t;
        tagsEl.appendChild(span);
      });
      sCard.querySelector('[data-field="note"]').textContent = s.note;
      sCard.querySelector('[data-field="quote"]').textContent = s.quote;
      var priceEl = sCard.querySelector('[data-field="priceRows"]');
      priceEl.innerHTML = '';
      s.priceRows.forEach(function (row) {
        var span = document.createElement('span');
        span.textContent = row;
        priceEl.appendChild(span);
      });
      sCard.querySelector('[data-field="cta"]').textContent = s.cta;
      sTabs.forEach(function (t, idx) { t.classList.toggle('is-active', idx === i); });
      sPhotos.forEach(function (p, idx) { p.classList.toggle('is-active', idx === i); });
      sActive = i;
    };

    sTabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        sRender(i);
        // Measure the scroll target only after the click's render has committed —
        // measuring first (or if the card's height could still change) lets the
        // sentinels shift under the scroll, landing one session short of the tab
        // that was actually clicked. The card's fixed 480px height (desktop) plus
        // this post-render rAF are both required to keep the math honest.
        requestAnimationFrame(function () {
          var el = sSentinels[i];
          if (el && window.innerWidth >= 768) {
            var top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
            window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
          }
        });
      });
    });
    // Scroll-driven switching itself is handled continuously inside update()
    // below, alongside the other pin-progress calculations (curtain, scene
    // words) — see the sessionsWrap block. A one-shot IntersectionObserver
    // with a thin rootMargin band left dead zones where scrolling past a
    // sentinel too fast skipped the trigger; measuring progress every frame
    // like the rest of the page's pins does not.
  }

  // ---- Quote scene words + photo curtain: DOM setup happens unconditionally
  // so reduced-motion can drop straight to the finished state below, instead
  // of leaving the words dimmed / the curtain hidden with no scroll-driven
  // update() ever running to bring them in. ----
  var scene = document.querySelector('[data-scene-quote], [data-scene-words]');
  var sceneWords = null, sceneWrap = null;
  if (scene) {
    var q = scene.hasAttribute('data-scene-words') ? scene : scene.querySelector('[data-scene-words]');
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
    // Progress must be measured against the tall outer wrapper (the pinned
    // section itself) not the inner position:sticky layer — the sticky
    // layer's own height always equals the viewport, so measuring against
    // it gave a zero scroll range and the words never lit up.
    sceneWrap = q.closest('[data-pinwrap]') || scene;
  }
  var curtain = document.querySelector('[data-photogrid]');
  var curtainWrap = curtain ? curtain.closest('[data-pinwrap]') : null;

  if (reduced) {
    if (sceneWords) sceneWords.forEach(function (s) { s.style.opacity = '1'; });
    if (curtain) curtain.style.transform = 'translateY(0)';
    return;
  }

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

  // ---- Pinned reveal (03 — What you'll learn): the section pins in place,
  // then each list item + the closing note steps in fully, one after another,
  // before the next one starts — driven by progress through the pin itself
  // (not each item's own position, which stays fixed once pinned).
  var learnPin = document.querySelector('[data-learn-pin]');
  var scrubList = document.querySelector('[data-scrublist]');
  var scrubItems = scrubList ? Array.prototype.slice.call(scrubList.children) : [];
  var scrubTail = document.querySelector('[data-scrubtail]');
  var scrubSteps = scrubItems.concat(scrubTail ? [scrubTail] : []);
  scrubSteps.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(56px)';
  });

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

    // Sessions switcher: which third of the sentinel track is centered in
    // the viewport, recomputed every frame — desktop only (see sRender's
    // own tap-only fallback below 768px, matching the sticky-card layout
    // that only exists at that width).
    if (sessionsWrap && sRender && sSentinels.length && window.innerWidth >= 768) {
      var swr = sessionsWrap.getBoundingClientRect();
      var swrange = sessionsWrap.offsetHeight - vh;
      var swp = swrange > 0 ? Math.min(1, Math.max(0, -swr.top / swrange)) : 0;
      var swIdx = Math.min(sSentinels.length - 1, Math.floor(swp * sSentinels.length));
      if (swIdx !== sActive) sRender(swIdx);
    }

    if (learnPin && scrubSteps.length) {
      var lr = learnPin.getBoundingClientRect();
      var lrange = learnPin.offsetHeight - vh;
      var lp = lrange > 0 ? Math.min(1, Math.max(0, -lr.top / lrange)) : 0;
      var n = scrubSteps.length;
      scrubSteps.forEach(function (el, i) {
        // Each step gets an equal, non-overlapping slice of the pin's scroll
        // range — step i only starts once step i-1 has fully completed.
        var t = Math.min(1, Math.max(0, (lp - i / n) * n));
        el.style.opacity = t.toFixed(3);
        el.style.transform = 'translateY(' + ((1 - t) * 56).toFixed(1) + 'px)';
      });
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
