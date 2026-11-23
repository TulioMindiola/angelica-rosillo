/* Dra. Angélica Rosillo */
(function () {
  const d = document, root = d.documentElement, $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const rm = root.classList.contains('rm');
  const WA = '573133720301';
  const waLink = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

  /* ---------- mapa del rostro (lo que se puede tocar) ---------- */
  const Z = JSON.parse($('#zdata').textContent);
  const hots = $('[data-hots]'), chips = $('[data-chips]'), zoneBox = $('[data-zone]'), add = $('[data-add]'), send = $('[data-send]');
  const kept = new Set(), stageEl = $('[data-stage]');
  let cur = 'entrecejo';
  const el = {};
  Z.forEach((z) => {
    const h = d.createElement('button');
    h.type = 'button'; h.className = 'hot'; h.style.left = z.x + '%'; h.style.top = z.y + '%';
    h.setAttribute('aria-label', z.n); h.innerHTML = `<span aria-hidden="true">${z.n}</span>`;
    const c = d.createElement('button');
    c.type = 'button'; c.className = 'chip'; c.textContent = z.n;
    hots.append(h); chips.append(c);
    el[z.id] = { h, c, g: $(`.zl[data-z="${z.id}"]`), z };
    [h, c].forEach((b) => {
      b.addEventListener('click', () => pick(z.id, true));
      b.addEventListener('pointerenter', () => el[z.id].g.classList.add('is-hover'));
      b.addEventListener('pointerleave', () => el[z.id].g.classList.remove('is-hover'));
    });
  });
  const art = (n) => ({ frente: 'la frente', entrecejo: 'el entrecejo', patas: 'las patas de gallo', ojeras: 'las ojeras', pomulos: 'los pómulos', nariz: 'la nariz', surcos: 'los surcos', labios: 'los labios', mandibula: 'la mandíbula', papada: 'la papada y el cuello', piel: 'la piel', cabello: 'el cabello' }[n]);
  function paint() {
    Z.forEach(({ id }) => {
      const o = el[id], on = id === cur, k = kept.has(id);
      [o.h, o.c].forEach((b) => { b.classList.toggle('is-on', on); b.classList.toggle('is-kept', k); });
      o.c.setAttribute('aria-pressed', on);
      o.g.classList.toggle('is-on', on); o.g.classList.toggle('is-kept', k);
    });
    const k = kept.has(cur);
    add.classList.toggle('is-on', k);
    add.textContent = k ? 'Quitar ' + el[cur].z.n.toLowerCase() : 'Agregar ' + el[cur].z.n.toLowerCase();
    const names = [...kept].map(art);
    send.textContent = kept.size ? `Enviar ${kept.size} ${kept.size > 1 ? 'zonas' : 'zona'} por WhatsApp` : 'Pedir valoración';
    const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' y ' + names.at(-1) : names[0];
    send.href = waLink(kept.size ? `Hola Dra. Angélica, quiero una valoración. Me interesa tratar ${list}.` : 'Hola Dra. Angélica, quiero agendar una valoración.');
  }
  function card(z) {
    const one = z.im.startsWith('img:');
    const pics = one
      ? `<div class="zone__pics one" style="--pos:${z.pos}"><div><img src="assets/img/${z.im.slice(4)}.webp" alt="${z.t}"></div></div>`
      : `<div class="zone__pics" style="--pos:${z.pos}"><div><img src="assets/img/ba-${z.im}-a.webp" alt="Antes"><span>antes</span></div><div><img src="assets/img/ba-${z.im}-b.webp" alt="Después"><span>después</span></div></div>`;
    return `${pics}<div><h3 class="zone__n">${z.t}</h3><p class="zone__d">${z.d}</p><p class="zone__f">${z.f}</p></div>`;
  }
  function pick(id, anim) {
    if (anim) stageEl.classList.add('live');
    cur = id; zoneBox.innerHTML = card(el[id].z); paint();
    if (anim && !rm && window.gsap) {
      gsap.from(zoneBox.querySelectorAll('.zone__pics>div'), { clipPath: 'inset(0 0 100% 0)', duration: .7, stagger: .08, ease: 'power3.out' });
      gsap.from(zoneBox.lastElementChild.children, { y: 14, opacity: 0, duration: .5, stagger: .06, ease: 'power2.out' });
    }
  }
  add.addEventListener('click', () => { kept.has(cur) ? kept.delete(cur) : kept.add(cur); paint(); });
  pick(cur);

  /* ---------- comparadores ---------- */
  $$('[data-ba]').forEach((f) => {
    const box = $('.ba__f', f), inp = $('input', f);
    const set = (v) => { box.style.setProperty('--x', v + '%'); box.classList.toggle('hide-a', v < 18); box.classList.toggle('hide-b', v > 82); };
    inp.addEventListener('input', () => { f.__t && f.__t.kill(); set(+inp.value); });
    f.__set = (v) => { inp.value = v; set(v); };
    set(50);
  });

  /* ---------- barra y WhatsApp flotante ---------- */
  const bar = $('[data-bar]'), wa = $('[data-float]'), stage = $('[data-stage]');
  let last = 0;
  const onScroll = () => {
    const y = scrollY, end = stage.offsetTop + stage.offsetHeight - innerHeight;
    const pin = root.classList.contains('pin');
    bar.classList.toggle('is-solid', pin ? y > end + 12 : y > 40);
    bar.classList.toggle('is-off', y > end + innerHeight && y > last + 2);
    wa.classList.toggle('is-off', y < (pin ? end + innerHeight * .4 : innerHeight * .7));
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- menú ---------- */
  const mb = $('[data-menu]'), menu = (o) => { root.classList.toggle('menu-open', o); mb.setAttribute('aria-expanded', o); d.body.style.overflow = o ? 'hidden' : ''; };
  mb.addEventListener('click', () => menu(!root.classList.contains('menu-open')));
  $$('.bar__nav a').forEach((a) => a.addEventListener('click', () => menu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') menu(false); });

  /* ---------- videos: solo cuando se ven ---------- */
  const vio = new IntersectionObserver((es) => es.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting && !rm) v.play().catch(() => {}); else v.pause();
  }), { rootMargin: '10% 0px' });
  $$('video[data-play]').forEach((v) => vio.observe(v));

  /* ---------- banda de la cita ---------- */
  const band = $('[data-band]');
  const ps = $$('.band__p', band);
  const on = (p) => ps.forEach((q) => q.classList.toggle('is-on', q === p));
  ps.forEach((p) => { p.addEventListener('pointerenter', () => on(p)); p.addEventListener('focus', () => on(p)); });

  if (rm || !window.gsap) { $$('[data-in]').forEach((e) => e.classList.add('in')); if (!window.gsap) return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (rm) return;

  /* ---------- líneas sobre el retrato: se dibujan, se borran y vuelven ---------- */
  const paths = $$('.face__lines path');
  paths.forEach((p) => { const L = Math.ceil(p.getTotalLength()) + 2; p.style.strokeDasharray = L + ' ' + L; p.__L = L; p.style.strokeDashoffset = L; });
  const L = (_, p) => p.__L;

  const words = $$('.h1 .ln>span');
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.face__img', { scale: 1.06, duration: 2.2, transformOrigin: '50% 60%', ease: 'power2.out' }, 0)
    .fromTo(paths, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.5, stagger: { amount: .9, from: 'random' }, ease: 'power2.inOut' }, .1)
    .fromTo(words, { y: 0, yPercent: 112 }, { y: 0, yPercent: 0, duration: .75, stagger: .07 }, .05)
    .from('.hero__txt > *', { y: 22, opacity: 0, duration: .7, stagger: .08 }, .35)
    .to(paths, { strokeDashoffset: (i, p) => -p.__L, duration: 1.3, stagger: { amount: .9, from: 'random' }, ease: 'power2.inOut' }, 2.3);
  if (root.classList.contains('pin')) intro.from('.corner', { yPercent: 102, duration: .8, stagger: .1 }, .4);

  /* el cursor vuelve a trazar las líneas cercanas y se borran solas */
  const face = $('[data-face]');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let pts = null;
    const prep = () => { pts = paths.map((p) => [0, .25, .5, .75, 1].map((t) => { const q = p.getPointAtLength((p.__L - 2) * t); return [q.x, q.y]; })); };
    face.addEventListener('pointermove', (e) => {
      if (intro.isActive() || stage.__map > .25) return;
      if (!pts) prep();
      const r = face.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 1011, y = (e.clientY - r.top) / r.height * 1011;
      paths.forEach((p, i) => {
        if (p.__busy) return;
        if (pts[i].some(([a, b]) => (a - x) ** 2 + (b - y) ** 2 < 8100)) {
          p.__busy = true;
          gsap.timeline({ onComplete: () => { p.__busy = false; } })
            .fromTo(p, { strokeDashoffset: p.__L }, { strokeDashoffset: 0, duration: .7, ease: 'power2.out' })
            .to(p, { strokeDashoffset: -p.__L, duration: .9, ease: 'power2.in' }, '+=.5');
        }
      });
    });
  }

  const mm = gsap.matchMedia();

  /* ---------- portada -> mapa ---------- */
  mm.add('(min-width:1080px) and (min-aspect-ratio:29/20)', () => {
    if (!root.classList.contains('pin')) return;
    const hotsEl = $('[data-hots]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true, onUpdate: (s) => { stage.__map = s.progress; if (s.progress > .02 && intro.isActive()) intro.progress(1); } } });
    tl.to('.h1--a', { x: () => -innerWidth * .5, duration: .3, ease: 'power2.in' }, 0)
      .to('.hero__txt', { x: () => -innerWidth * .4, duration: .3, ease: 'power2.in' }, .03)
      .to('.h1--b', { x: () => innerWidth * .5, duration: .3, ease: 'power2.in' }, 0)
      .to('.corner--l', { xPercent: -105, duration: .28, ease: 'power2.in' }, .05)
      .to('.corner--r', { xPercent: 105, duration: .28, ease: 'power2.in' }, .05)
      .to('.face', { x: () => -(innerWidth / 2 - innerHeight * .56), duration: .42, ease: 'power2.inOut' }, .12)
      .fromTo('.panel', { xPercent: 101 }, { xPercent: 0, duration: .42, ease: 'power2.out' }, .18)
      .fromTo(paths, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: .4, stagger: { amount: .12, from: 'random' }, ease: 'none', immediateRender: false }, .22)
      .fromTo([hotsEl, '.face__zones'], { autoAlpha: 0 }, { autoAlpha: 1, duration: .1 }, .56)
      .fromTo('.hot', { scale: 0 }, { scale: 1, duration: .16, stagger: .008, ease: 'back.out(2)' }, .58)
      .to({}, { duration: .2 });
    gsap.set('.panel', { xPercent: 101 });
    return () => gsap.set('.face,.panel,.h1--a,.h1--b,.hero__txt,.corner,.hot,[data-hots],.face__zones', { clearProps: 'all' });
  });
  mm.add('not all and (min-width:1080px) and (min-aspect-ratio:29/20)', () => {
    gsap.from('.hot', { scale: 0, duration: .5, stagger: .05, ease: 'back.out(2)', delay: 2.9 });
    gsap.to(paths, { strokeDashoffset: 0, opacity: .8, duration: 1.2, stagger: { amount: .6 }, ease: 'power2.inOut', scrollTrigger: { trigger: '.panel', start: 'top 80%' }, overwrite: false, onStart: () => gsap.set(paths, { strokeDashoffset: L }) });
  });
  let pinned = root.classList.contains('pin');
  addEventListener('resize', () => { window.__pin(); const n = root.classList.contains('pin'); if (n !== pinned) { pinned = n; location.reload(); } });

  /* ---------- entradas por partes ---------- */
  const enter = (els, o = {}) => els.forEach((e) => gsap.fromTo(e, { y: 30, opacity: .25 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: o.d ? o.d(e) : 0, scrollTrigger: { trigger: e, start: 'top 90%' }, onStart: () => e.classList.add('in') }));
  $$('[data-in]').forEach((b) => { if (b.matches('.sec__head,.verbs__head')) { b.classList.add('in'); enter([...b.children], { d: (e) => [...b.children].indexOf(e) * .1 }); } else enter([b]); });
  enter($$('.ba figcaption,.band__p,.care__bar>div,.revs blockquote,.faq details,.place__card>*,.foot__cols>div,.revs__l>*'), { d: (e) => ([...e.parentElement.children].indexOf(e) % 4) * .07 });

  /* comparadores: se abren y se recorren solos una vez */
  $$('[data-ba]').forEach((f, i) => {
    const o = { v: 100 };
    f.__set(88);
    gsap.fromTo($('.ba__f', f), { clipPath: 'inset(12% 0 12% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: f, start: 'top 85%' } });
    f.__t = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 68%' } }).fromTo(o, { v: 88 }, { v: 14, duration: 1.5, ease: 'power2.inOut', onUpdate: () => f.__set(o.v), delay: (i % 3) * .12 }).to(o, { v: 50, duration: 1, ease: 'power2.inOut', onUpdate: () => f.__set(o.v) });
  });

  /* verbos: se apilan, el de abajo se aleja */
  mm.add('(min-width:1000px)', () => {
    const vs = $$('[data-verb]');
    vs.forEach((v, i) => {
      gsap.from($$('.verb__list li', v), { x: 50, opacity: 0, duration: .8, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: v, start: 'top 55%' } });
      gsap.fromTo($('.verb__h span', v), { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: v, start: 'top 62%' } });
      gsap.fromTo($$('.verb__media>*', v), { scale: 1.22 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'top top', scrub: .4 } });
      const nx = vs[i + 1];
      if (nx) gsap.to($('.verb__txt', v), { y: -70, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: nx, start: 'top 96%', end: 'top 50%', scrub: true } });
    });
  });
  mm.add('(max-width:999px)', () => {
    $$('[data-verb]').forEach((v) => {
      gsap.from($$('.verb__list li', v), { x: 30, opacity: .25, duration: .7, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: $('.verb__list', v), start: 'top 88%' } });
      gsap.fromTo($$('.verb__media>*', v), { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom bottom', scrub: .4 } });
    });
  });

  /* cinta: avanza sola y acelera con el scroll */
  const tapes = $$('[data-tape]').map((r, i) => {
    const w = r.firstElementChild.offsetWidth; const dir = i % 2 ? 1 : -1;
    const t = dir < 0 ? gsap.fromTo(r, { x: 0 }, { x: -w, duration: 34, ease: 'none', repeat: -1 }) : gsap.fromTo(r, { x: -w }, { x: 0, duration: 34, ease: 'none', repeat: -1 });
    return t;
  });
  ScrollTrigger.create({ trigger: '.tape', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { const v = Math.min(5, 1 + Math.abs(s.getVelocity()) / 500); tapes.forEach((t) => { gsap.to(t, { timeScale: v, duration: .2, overwrite: true }); gsap.to(t, { timeScale: 1, duration: 1.4, delay: .25, overwrite: false }); }); }, onToggle: (s) => tapes.forEach((t) => t.paused(!s.isActive)) });

  /* retratos que derivan */
  $$('[data-drift]').forEach((im) => gsap.fromTo(im, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: .5 } }));

  /* la frase de los tres pilares se enciende palabra por palabra */
  const q = $('[data-words]');
  q.innerHTML = q.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
  gsap.fromTo($$('.w', q), { color: '#A9808C' }, { color: '#ffffff', stagger: .1, ease: 'none', scrollTrigger: { trigger: q, start: 'top 82%', end: 'bottom 48%', scrub: .4 } });

  /* 5,0 que sube */
  const n = $('[data-count]'), co = { v: 0 };
  gsap.to(co, { v: 5, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 85%' }, onUpdate: () => { n.textContent = co.v.toFixed(1).replace('.', ','); } });
  mm.add('(min-width:1000px)', () => { gsap.fromTo('.revs__col:last-child', { y: 90 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.revs', start: 'top bottom', end: 'bottom top', scrub: .5 } }); });

  /* horas de cuidado */
  gsap.fromTo('.care__bar>div', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, stagger: .25, ease: 'power3.inOut', scrollTrigger: { trigger: '.care__bar', start: 'top 88%' } });

  /* la firma cierra la página */
  gsap.fromTo('.foot__firma', { clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% -2% -20% 0)', duration: 2.4, ease: 'power1.inOut', scrollTrigger: { trigger: '[data-sign]', start: 'top 72%' } });
  gsap.fromTo('.foot__ar', { yPercent: 14, scale: .94 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-sign]', start: 'top bottom', end: 'bottom bottom', scrub: .5 } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
