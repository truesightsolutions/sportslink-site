/* SportsLink marketing site — mock data + behaviours.
   No framework, no build, no network. Every name below is fictional, and
   every face is an authored SVG illustration, not a photograph. */

(() => {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ═══ seeded randomness ═════════════════════════════════════════
     Every generated face, crest and record is derived from a name, so the
     page renders identically on every load and for every visitor. */

  function rng(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h ^= h >>> 13;
      return (h >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];
  const between = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));

  /* ═══ authored illustration ═════════════════════════════════════ */

  const SKIN = ['#7A4A22', '#8D5524', '#A9683C', '#B87B4B', '#C68642', '#E0AC69'];
  const HAIR = ['#14100D', '#231812', '#2E1F17', '#3D281B'];
  const TOP  = ['#1D4ED8', '#C62828', '#E4701E', '#6B3FA0', '#0F8A85', '#1B7A3A', '#B3268C', '#152A5E'];
  const TINT = ['#1D241F', '#232B25', '#1A211C', '#262F28'];

  /* A flat head-and-shoulders illustration. `w` picks the feminine hair
     silhouette. All geometry derives from the head radius, so the square
     avatar crop and the taller card crop stay in proportion to each other. */
  function face(seed, w, tall) {
    const r = rng(seed);
    const skin = pick(r, SKIN), hair = pick(r, HAIR), top = pick(r, TOP), tint = pick(r, TINT);
    const shade = c => c.replace(/^#(..)(..)(..)$/, (_, a, b, d) =>
      '#' + [a, b, d].map(x => Math.max(0, parseInt(x, 16) - 26).toString(16).padStart(2, '0')).join(''));
    const bun = w && r() > 0.5;

    const H = tall ? 132 : 100;   // canvas height; width is always 100
    const hr = tall ? 17 : 22;    // head radius drives everything else
    const cy = tall ? 38 : 44;    // head centre
    const n = (v) => +v.toFixed(1);

    const neckW = hr * 0.34, neckTop = cy + hr * 0.6, neckBot = cy + hr * 1.6;
    const shTop = cy + hr * 1.45;                       // where the shoulders start
    const shIn = 50 - hr * 1.3, shOut = 50 - hr * 2.4;  // shoulder control points
    const hairBot = cy + hr * 3.2;                      // long-hair hem

    return `<svg viewBox="0 0 100 ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="100" height="${H}" fill="${tint}"/>
      ${w ? `<path d="M${n(50 - hr * 1.18)} ${n(cy + hr * 0.1)}
             C${n(50 - hr * 1.18)} ${n(cy + hr * 1.8)} ${n(50 - hr * 1.05)} ${n(hairBot - hr * 0.5)} ${n(50 - hr * 0.95)} ${n(hairBot)}
             L${n(50 + hr * 0.95)} ${n(hairBot)}
             C${n(50 + hr * 1.05)} ${n(hairBot - hr * 0.5)} ${n(50 + hr * 1.18)} ${n(cy + hr * 1.8)} ${n(50 + hr * 1.18)} ${n(cy + hr * 0.1)} Z"
             fill="${hair}"/>` : ''}
      <path d="M${n(50 - neckW)} ${n(neckTop)} h${n(neckW * 2)} v${n(neckBot - neckTop)} h-${n(neckW * 2)} Z" fill="${shade(skin)}"/>
      <path d="M${n(shOut)} ${H} C${n(shOut)} ${n(shTop + hr * 0.7)} ${n(shIn)} ${n(shTop)} 50 ${n(shTop)}
               C${n(100 - shIn)} ${n(shTop)} ${n(100 - shOut)} ${n(shTop + hr * 0.7)} ${n(100 - shOut)} ${H} Z" fill="${top}"/>
      <circle cx="50" cy="${cy}" r="${hr}" fill="${skin}"/>
      ${bun ? `<circle cx="50" cy="${n(cy - hr * 1.32)}" r="${n(hr * 0.42)}" fill="${hair}"/>` : ''}
      <path d="M${n(50 - hr * 1.02)} ${n(cy + hr * 0.1)}
               C${n(50 - hr * 1.02)} ${n(cy - hr * 0.95)} ${n(50 - hr * 0.6)} ${n(cy - hr * 1.2)} 50 ${n(cy - hr * 1.2)}
               C${n(50 + hr * 0.6)} ${n(cy - hr * 1.2)} ${n(50 + hr * 1.02)} ${n(cy - hr * 0.95)} ${n(50 + hr * 1.02)} ${n(cy + hr * 0.1)}
               C${n(50 + hr * 1.02)} ${n(cy - hr * 0.42)} ${n(50 + hr * 0.6)} ${n(cy - hr * 0.6)} 50 ${n(cy - hr * 0.6)}
               C${n(50 - hr * 0.6)} ${n(cy - hr * 0.6)} ${n(50 - hr * 1.02)} ${n(cy - hr * 0.42)} ${n(50 - hr * 1.02)} ${n(cy + hr * 0.1)} Z"
            fill="${hair}"/>
      <circle cx="${n(50 - hr * 0.36)}" cy="${n(cy + hr * 0.05)}" r="${n(hr * 0.105)}" fill="#14100D"/>
      <circle cx="${n(50 + hr * 0.36)}" cy="${n(cy + hr * 0.05)}" r="${n(hr * 0.105)}" fill="#14100D"/>
      <path d="M${n(50 - hr * 0.27)} ${n(cy + hr * 0.45)} Q50 ${n(cy + hr * 0.64)} ${n(50 + hr * 0.27)} ${n(cy + hr * 0.45)}"
            stroke="#14100D" stroke-width="${n(hr * 0.09)}" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  /* A team crest: shield, chevron in the away kit, initials over the home kit. */
  function crest(name, home, away) {
    const ini = name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
    const light = ['#F3F6EF', '#EBD11A', '#D8C69B', '#B9C0B6'].includes(home);
    return `<svg viewBox="0 0 100 110" class="crest" aria-hidden="true">
      <path d="M50 3 L93 17 V58 C93 85 73 101 50 107 C27 101 7 85 7 58 V17 Z" fill="${home}"/>
      <path d="M50 3 L93 17 V30 L50 44 L7 30 V17 Z" fill="${away}"/>
      <path d="M50 3 L93 17 V58 C93 85 73 101 50 107 C27 101 7 85 7 58 V17 Z"
            fill="none" stroke="rgba(243,246,239,.32)" stroke-width="3"/>
      <text x="50" y="80" text-anchor="middle" font-family="Rajdhani, sans-serif"
            font-weight="700" font-size="30" fill="${light ? '#0E1310' : '#F3F6EF'}">${ini}</text>
    </svg>`;
  }

  /* ═══ catalog ═══════════════════════════════════════════════════ */

  const WIN = 3, DRAW = 1, LOSS = 0, PARTICIPATION = 1;
  const PTS = r => r.mp * PARTICIPATION + r.w * WIN + r.d * DRAW + r.l * LOSS;

  const SPORTS = [
    { name: 'Tennis', mode: 'Sets', formats: 'Singles · Doubles · Mixed Doubles', structure: 'Best of 3 or 5 sets · 6 games, win by 2', rule: 'Majority of sets' },
    { name: 'Badminton', mode: 'Sets', formats: 'Singles · Doubles · Mixed Doubles', structure: 'Best of 3 sets · 21 points, cap 30', rule: 'Majority of sets' },
    { name: 'Squash', mode: 'Sets', formats: 'Singles · Doubles · Mixed Doubles', structure: 'Best of 3 or 5 games · 11 points, win by 2', rule: 'Games won' },
    { name: 'Table Tennis', mode: 'Sets', formats: 'Singles · Doubles · Mixed Doubles', structure: 'Best of 3 or 5 · 21 points', rule: 'Majority of games' },
    { name: 'Pickleball', mode: 'Sets', formats: 'Singles · Doubles · Mixed Doubles', structure: 'Best of 3 games · 11 points, win by 2', rule: 'Majority of games' },
    { name: 'Volleyball', mode: 'Sets', formats: '5v5', structure: 'Best of 5 sets · 25 points, decider to 15', rule: 'Majority of sets' },
    { name: 'Football', mode: 'Single score', formats: '5v5 · 7v7 · 11v11', structure: 'Two halves · 3-1-0 points', rule: 'Higher goals wins' },
    { name: 'Basketball', mode: 'Single score', formats: '5v5', structure: 'Four quarters · 3-0 points', rule: 'Higher score wins' },
    { name: 'Rugby', mode: 'Single score', formats: '7s · 15v15', structure: 'Two halves · 3-1-0 points', rule: 'Higher score wins' },
    { name: 'Cricket', mode: 'Cricket', formats: '6v6 · 11v11', structure: 'One innings each · 3-0 points', rule: 'Chasing side needs +1 run' }
  ];

  /* Only Football can be drawn, so every other table runs W/L only. */
  const DRAWABLE = new Set(['Football']);
  const SOLO_SPORTS = ['Tennis', 'Badminton', 'Squash', 'Table Tennis'];
  const TEAM_SPORTS = ['Football', 'Cricket'];
  const BOARD_SPORTS = [...SOLO_SPORTS, ...TEAM_SPORTS];

  /* ═══ name pools (fictional) ════════════════════════════════════ */

  const M = ['Arjun', 'Vikram', 'Kabir', 'Ishaan', 'Rohan', 'Aditya', 'Nikhil', 'Omkar', 'Rahul', 'Karthik',
    'Siddharth', 'Arnav', 'Vivek', 'Aakash', 'Dhruv', 'Manav', 'Pranav', 'Harsh', 'Yash', 'Aniket',
    'Tanmay', 'Rishabh', 'Sameer', 'Varun'];
  const F = ['Rhea', 'Ananya', 'Meera', 'Sanya', 'Tara', 'Zoya', 'Priya', 'Divya', 'Nandini', 'Shreya',
    'Aisha', 'Kavya', 'Ira', 'Riya', 'Neha', 'Sneha', 'Anjali', 'Pooja', 'Ishita', 'Trisha',
    'Mitali', 'Radhika', 'Aarohi', 'Simran'];

  const CITY = {
    Delhi: {
      last: ['Mehra', 'Kapoor', 'Singh', 'Sharma', 'Malhotra', 'Chopra', 'Bhatia', 'Gill', 'Khanna', 'Ahuja',
        'Sethi', 'Grover', 'Bakshi', 'Sood', 'Walia', 'Chadha'],
      venues: ['Siri Fort Sports Complex', 'Thyagraj Stadium', 'Nehru Park Courts', 'Saket Sports Centre', 'Dwarka Sports Hub'],
      locality: ['Hauz Khas', 'Qutub', 'Saket', 'Yamuna', 'Vasant', 'Rohini', 'Dwarka', 'Karol Bagh', 'Lodhi', 'Chanakya', 'Pitampura', 'Mayur']
    },
    Mumbai: {
      last: ['Joshi', 'Desai', 'Rane', 'Shetty', 'Patil', 'Merchant', 'Nair', 'Iyer', 'Kamat', 'Sawant',
        'Naik', 'Bhosale', 'Chavan', 'Dalvi', 'Salvi', 'Wagle'],
      venues: ['MCA Recreation Centre, BKC', 'Shivaji Park', 'Juhu Gymkhana', 'Matoshree Sports Complex', 'Andheri Sports Arena'],
      locality: ['Bandra', 'Worli', 'Andheri', 'Dadar', 'Colaba', 'Powai', 'Chembur', 'Vashi', 'Sion', 'Mahim', 'Vile Parle', 'Thane']
    },
    Bengaluru: {
      last: ['Reddy', 'Rao', 'Menon', 'Pillai', 'Gowda', 'Kulkarni', 'Bhat', 'Fernandes', 'Shenoy', 'Hegde',
        'Prasad', 'Murthy', 'Achar', 'Kamath', 'Nayak', 'Rai'],
      venues: ['Kanteerava Stadium', 'Play Arena, Sarjapur', 'Cubbon Park Courts', 'Koramangala Indoor Stadium', 'Whitefield Sports Park'],
      locality: ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'Cubbon', 'HSR', 'Malleshwaram', 'Hebbal', 'Yelahanka', 'BTM', 'Rajajinagar', 'Sarjapur']
    }
  };
  const CITIES = Object.keys(CITY);
  const NOUN = ['Hawks', 'Rangers', 'Smashers', 'Strikers', 'Bandits', 'Waves', 'Arrows', 'Dribblers',
    'Kings', 'Ignite', 'Warriors', 'Jets', 'Falcons', 'Titans', 'Chargers', 'Vipers',
    'Rovers', 'Blasters', 'Spartans', 'Cyclones'];
  const KITS = ['#151A16', '#F3F6EF', '#3A403B', '#B9C0B6', '#C62828', '#7A1F2B', '#E4701E', '#C99510',
    '#EBD11A', '#23FD0A', '#1B7A3A', '#0F8A85', '#4AA8E0', '#1D4ED8', '#152A5E', '#6B3FA0',
    '#B3268C', '#E27CA6', '#6B4B2A', '#D8C69B'];

  /* ═══ generated standings ═══════════════════════════════════════
     22 competitors per (sport, city) division, built once at load. */

  const ROWS_PER_DIVISION = 22;

  function buildDivision(sport, city) {
    const c = CITY[city];
    const r = rng(sport + city);
    const team = TEAM_SPORTS.includes(sport);
    const drawable = DRAWABLE.has(sport);
    const used = new Set();
    const out = [];

    while (out.length < ROWS_PER_DIVISION) {
      let name;
      if (team) {
        name = `${pick(r, c.locality)} ${pick(r, NOUN)}`;
      } else {
        name = `${pick(r, r() > 0.5 ? F : M)} ${pick(r, c.last)}`;
      }
      if (used.has(name)) continue;
      used.add(name);

      const nr = rng(name + sport + city);
      const mp = between(nr, 12, 26);
      const w = between(nr, 2, mp - 2);
      const d = drawable ? between(nr, 0, Math.max(0, mp - w - 1)) : 0;
      const row = {
        name, city, sport, team, venue: pick(nr, c.venues),
        female: team ? null : nr() > 0.5,
        mp, w, d, l: mp - w - d,
        home: pick(nr, KITS), away: pick(nr, KITS)
      };
      if (row.home === row.away) row.away = KITS[(KITS.indexOf(row.home) + 7) % KITS.length];
      out.push(row);
    }
    return out;
  }

  const DIVISIONS = {};
  for (const s of BOARD_SPORTS) for (const c of CITIES) DIVISIONS[s + '|' + c] = buildDivision(s, c);

  /* One named competitor is "you", so the highlighted row has an owner. */
  const YOU = DIVISIONS['Tennis|Delhi'][7];
  YOU.you = true;
  YOU.name = 'Arjun Mehra';
  YOU.female = false;

  /* ═══ the swipe deck ════════════════════════════════════════════ */

  const DECK = [
    { name: 'Sanya Desai', female: true, sport: 'Tennis · Singles', rating: 1642, followers: '1.2k', mp: 19, w: 15, d: 0, l: 4 },
    { name: 'Karthik Reddy', female: false, sport: 'Badminton · Singles', rating: 1518, followers: '840', mp: 18, w: 12, d: 0, l: 6 },
    { name: 'Nandini Pillai', female: true, sport: 'Squash · Singles', rating: 1587, followers: '612', mp: 16, w: 12, d: 0, l: 4 },
    { name: 'Rahul Nair', female: false, sport: 'Football · 7v7', rating: 1703, followers: '3.4k', mp: 22, w: 15, d: 3, l: 4 },
    { name: 'Shreya Kulkarni', female: true, sport: 'Badminton · Doubles', rating: 1671, followers: '1.9k', mp: 20, w: 16, d: 0, l: 4 }
  ];

  /* ═══ 1. scroll reveal ══════════════════════════════════════════ */

  function reveal() {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));

    const loop = $('.loop');
    if (loop) {
      const lio = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        loop.classList.add('in');
        lio.disconnect();
      }, { threshold: 0.25 });
      lio.observe(loop);
    }
  }

  /* ═══ 2. counters ═══════════════════════════════════════════════ */

  function counters() {
    const els = $$('[data-count]');
    if (REDUCED) { els.forEach(el => el.textContent = el.dataset.count); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target, +e.target.dataset.count);
      }
    }, { threshold: 0.6 });
    els.forEach(el => io.observe(el));

    function run(el, to) {
      const start = performance.now(), dur = 900;
      (function frame(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(frame);
      })(start);
    }
  }

  /* ═══ 3. swipe deck ═════════════════════════════════════════════ */

  const COMMIT = 100;   // px past which a drag counts as a decision
  const STAMP_AT = 60;  // px at which the ACCEPT/REJECT stamps appear

  function deck() {
    const wrap = $('#deck');
    if (!wrap) return;
    let order = [], card = null, drag = null;

    const build = (p) => {
      const el = document.createElement('div');
      el.className = 'dcard';
      el.innerHTML = `
        <div class="portrait">${face(p.name, p.female, true)}</div>
        <div class="wash"></div>
        <div class="top">
          <span class="sportpill">${p.sport}</span>
          <span class="followpill"><svg data-lucide="users" width="13" height="13"></svg>${p.followers}</span>
        </div>
        <span class="stamp accept">ACCEPT</span>
        <span class="stamp reject">REJECT</span>
        <div class="scrim">
          <div class="dname">${p.name}</div>
          <div class="drate">Rated ${p.rating}</div>
          <div class="wdl">
            <div><b>${p.mp}</b><span>Played</span></div>
            <div><b>${p.w}</b><span>Won</span></div>
            <div><b>${p.d}</b><span>Drawn</span></div>
            <div><b>${p.l}</b><span>Lost</span></div>
          </div>
        </div>`;
      return el;
    };

    function next() {
      if (card) { card.remove(); card = null; }
      if (!order.length) { wrap.classList.add('empty'); return; }
      wrap.classList.remove('empty');
      card = build(order.shift());
      wrap.appendChild(card);
      window.lucide && lucide.createIcons({ nameAttr: 'data-lucide' });
      card.addEventListener('pointerdown', down);
    }

    function paint(dx, dy) {
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.06}deg)`;
      const t = Math.min(Math.abs(dx) / COMMIT, 1);
      const wash = $('.wash', card);
      wash.style.background = dx > 0 ? 'var(--ok)' : 'var(--bad)';
      wash.style.opacity = Math.abs(dx) > 8 ? t * 0.28 : 0;
      const on = Math.max(0, (Math.abs(dx) - STAMP_AT) / (COMMIT - STAMP_AT));
      $('.stamp.accept', card).style.opacity = dx > 0 ? Math.min(on, 1) : 0;
      $('.stamp.reject', card).style.opacity = dx < 0 ? Math.min(on, 1) : 0;
    }

    function down(e) {
      if (!card) return;
      drag = { x: e.clientX, y: e.clientY };
      card.classList.remove('settling');
      card.setPointerCapture(e.pointerId);
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerup', up);
      card.addEventListener('pointercancel', up);
    }
    function move(e) { if (drag) paint(e.clientX - drag.x, e.clientY - drag.y); }
    function up(e) {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      drag = null;
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', up);
      if (Math.abs(dx) >= COMMIT) return fling(dx > 0 ? 1 : -1);
      card.classList.add('settling');
      paint(0, 0);
    }
    function fling(dir) {
      if (!card) return;
      const gone = card;
      card = null;
      gone.classList.add('gone');
      gone.style.transform = `translate(${dir * 600}px, 40px) rotate(${dir * 24}deg)`;
      gone.style.opacity = '0';
      // Drop the flung card once it is off-screen, or they pile up in the DOM.
      setTimeout(() => { gone.remove(); next(); }, REDUCED ? 0 : 260);
    }
    function reset() { order = DECK.slice(); next(); }

    $('#deckyes').addEventListener('click', () => fling(1));
    $('#deckno').addEventListener('click', () => fling(-1));
    $('#deckcounter').addEventListener('click', () => fling(-1));
    $('#deckreset').addEventListener('click', reset);
    reset();
  }

  /* ═══ 4. blind-entry scroller ═══════════════════════════════════ */

  function scorecard() {
    const track = $('.blindtrack'), box = $('#blindbox'), opp = $('#oppgrid');
    if (!track || !box) return;
    const boxes = $$('.box', opp);
    let queued = false;

    function apply() {
      queued = false;
      const r = track.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = span <= 0 ? 0 : Math.min(Math.max(-r.top / span, 0), 1);
      const state = Math.min(Math.floor(p * 4), 3);
      if (box.dataset.state !== String(state)) box.dataset.state = state;
      // The opponent's numbers stay hidden until the match is confirmed.
      boxes.forEach(b => b.classList.toggle('hidden', state < 3));
    }
    addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    }, { passive: true });
    addEventListener('resize', apply, { passive: true });
    apply();
  }

  /* ═══ 5. leaderboard ════════════════════════════════════════════ */

  function board() {
    const sportsEl = $('#boardsports'), citiesEl = $('#boardcities'), rowsEl = $('#boardrows');
    if (!rowsEl) return;
    let sport = 'Tennis', city = 'Delhi';

    const chips = (host, values, get, set) => {
      host.innerHTML = '';
      values.forEach(v => {
        const b = document.createElement('button');
        b.className = 'chip';
        b.type = 'button';
        b.textContent = v;
        b.setAttribute('aria-pressed', String(get() === v));
        b.addEventListener('click', () => { set(v); render(); });
        host.appendChild(b);
      });
    };

    function render() {
      chips(sportsEl, BOARD_SPORTS, () => sport, v => sport = v);
      chips(citiesEl, CITIES, () => city, v => city = v);

      const rows = DIVISIONS[sport + '|' + city]
        .map(r => ({ ...r, pts: PTS(r) }))
        // points desc, then win difference, then wins
        .sort((a, b) =>
          b.pts - a.pts ||
          (b.w + 0.5 * b.d - b.l) - (a.w + 0.5 * a.d - a.l) ||
          b.w - a.w);

      // Standard competition ranking: ties share a place, the next place skips.
      let rank = 0, prev = null;
      rows.forEach((r, i) => {
        const key = [r.pts, r.w + 0.5 * r.d - r.l, r.w].join('|');
        if (key !== prev) { rank = i + 1; prev = key; }
        r.rank = rank;
      });

      const team = TEAM_SPORTS.includes(sport);
      $('.bhead span:nth-child(3)').textContent = team ? 'Team' : 'Player';
      rowsEl.scrollTop = 0;
      rowsEl.innerHTML = rows.map(r => `
        <div class="brow${r.rank === 1 ? ' first' : ''}${r.you ? ' you' : ''}">
          <span class="rk">${r.rank}</span>
          <span class="av${team ? ' sq' : ''}">${team ? crest(r.name, r.home, r.away) : face(r.name, r.female)}</span>
          <span class="nm">${r.name}<small>${r.venue}</small></span>
          <span class="num">${r.mp}</span>
          <span class="num">${r.w}</span>
          <span class="num">${r.l}</span>
          <span class="num pts">${r.pts}</span>
        </div>`).join('');
      $('#boardcount').textContent =
        `${rows.length} ${team ? 'teams' : 'players'} · ${sport} · ${city} — scroll the table for the full division`;
    }
    render();
  }

  /* ═══ 6. theme — dark by default, light is opt-in ═══════════════ */

  function theme() {
    const btn = $('#themebtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const light = document.documentElement.dataset.theme === 'light';
      if (light) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'light';
      try { localStorage.setItem('sl-theme', light ? 'dark' : 'light'); } catch (e) { /* private mode */ }
    });
  }

  /* ═══ 7. mobile drawer ══════════════════════════════════════════ */

  function drawer() {
    const d = $('#drawer'), scrim = $('#scrim'), open = $('#burger'), close = $('#dclose');
    if (!d) return;
    const set = on => {
      d.classList.toggle('open', on);
      scrim.classList.toggle('open', on);
      open.setAttribute('aria-expanded', String(on));
      document.body.style.overflow = on ? 'hidden' : '';
      if (on) close.focus(); else open.focus();
    };
    open.addEventListener('click', () => set(true));
    close.addEventListener('click', () => set(false));
    scrim.addEventListener('click', () => set(false));
    // Any destination closes it, and so does Escape.
    $$('a', d).forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && d.classList.contains('open')) set(false); });
  }

  /* ═══ static render + boot ══════════════════════════════════════ */

  function sports() {
    const host = $('#sportgrid');
    if (!host) return;
    host.innerHTML = SPORTS.map((s, i) => `
      <div class="sporttile" data-reveal style="--i:${i}">
        <h3>${s.name}</h3>
        <span class="mode">${s.mode}</span>
        <div class="fmt">${s.formats}</div>
        <div class="str">${s.structure} · ${s.rule}.</div>
      </div>`).join('');
  }

  /* Fill every element that asks for an illustration by name. */
  function illustrate() {
    $$('[data-face]').forEach(el => { el.innerHTML = face(el.dataset.face, el.dataset.f === '1', el.dataset.tall === '1'); });
    $$('[data-crest]').forEach(el => { el.innerHTML = crest(el.dataset.crest, el.dataset.home, el.dataset.away); });
  }

  function header() {
    const hdr = $('#hdr');
    if (!hdr) return;
    addEventListener('scroll', () => hdr.classList.toggle('stuck', scrollY > 40), { passive: true });
  }

  sports();        // must run before reveal() so its tiles are observed
  illustrate();
  window.lucide && lucide.createIcons({ nameAttr: 'data-lucide' });
  reveal();
  counters();
  deck();
  scorecard();
  board();
  theme();
  drawer();
  header();

  window.__sl = { PTS, DIVISIONS, face, crest };
})();
