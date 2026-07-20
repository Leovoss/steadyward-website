/* Steadyward site behaviour. Loaded with defer, so the DOM is ready. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // count-up numbers
  var countEls = document.querySelectorAll('.countup');
  if (countEls.length) {
    var countUp = function (el) {
      var to = parseFloat(el.getAttribute('data-countup'));
      var suf = el.getAttribute('data-suffix') || '';
      if (isNaN(to)) return;
      if (reduce) { el.textContent = to + suf; return; }
      var dur = 1100, t0 = null;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(step); else el.textContent = to + suf;
      };
      requestAnimationFrame(step);
    };
    var cObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { cObs.observe(el); });
  }

  // ROI calculator
  var ftd = document.getElementById('ftd');
  var cac = document.getElementById('cac');
  var uplift = document.getElementById('uplift');
  if (ftd && cac && uplift) {
    var EARLY_CHURN = 0.40; // assumed share of first deposits that blow up before covering CAC
    var upliftVal = document.getElementById('upliftVal');
    var savedEl = document.getElementById('saved');
    var recoveredEl = document.getElementById('recovered');
    var lostEl = document.getElementById('lost');
    var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    var calc = function () {
      var n = Math.max(0, parseFloat(ftd.value) || 0);
      var c = Math.max(0, parseFloat(cac.value) || 0);
      var u = (parseFloat(uplift.value) || 0) / 100;
      if (upliftVal) upliftVal.textContent = Math.round(u * 100) + '%';
      var savedPerMonth = n * EARLY_CHURN * u;
      var lostPerYear = n * EARLY_CHURN * c * 12;
      var recoveredPerYear = lostPerYear * u;
      if (savedEl) savedEl.textContent = Math.round(savedPerMonth).toLocaleString('en-US');
      if (lostEl) lostEl.textContent = money.format(Math.round(lostPerYear));
      if (recoveredEl) recoveredEl.textContent = money.format(Math.round(recoveredPerYear));
    };
    [ftd, cac, uplift].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }

  // mobile nav
  var navToggle = document.getElementById('nav-toggle');
  var navPanel = document.getElementById('mobile-nav');
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var nowHidden = navPanel.classList.toggle('hidden');
      navToggle.setAttribute('aria-expanded', String(!nowHidden));
    });
    navPanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navPanel.classList.add('hidden'); navToggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // interactive console demo
  var cons = document.getElementById('sh-console');
  if (cons) {
    var tabs = cons.querySelectorAll('.sh-tab');
    var panels = cons.querySelectorAll('.sh-panel');
    var activate = function (name) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === name)); });
      panels.forEach(function (pn) { pn.classList.toggle('hidden', pn.getAttribute('data-panel') !== name); });
    };
    tabs.forEach(function (t) { t.addEventListener('click', function () { activate(t.getAttribute('data-tab')); }); });
    cons.querySelectorAll('[data-tab-link]').forEach(function (b) { b.addEventListener('click', function () { activate(b.getAttribute('data-tab-link')); }); });
    cons.querySelectorAll('.sh-row').forEach(function (row) {
      row.setAttribute('tabindex', '0');
      var toggleRow = function () {
        var open = row.getAttribute('aria-expanded') === 'true';
        row.setAttribute('aria-expanded', String(!open));
        var d = row.nextElementSibling;
        if (d && d.classList.contains('sh-detail')) d.classList.toggle('hidden', open);
      };
      row.addEventListener('click', toggleRow);
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRow(); }
      });
    });
    var chips = cons.querySelectorAll('.sh-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        var f = chip.getAttribute('data-filter');
        cons.querySelectorAll('.sh-row').forEach(function (row) {
          var show = (f === 'all' || row.getAttribute('data-pattern') === f);
          row.classList.toggle('hidden', !show);
          row.setAttribute('aria-expanded', 'false');
          var d = row.nextElementSibling;
          if (d && d.classList.contains('sh-detail')) d.classList.add('hidden');
        });
      });
    });
  }
  // export CSV button in the account view (section 04)
  var shExport = document.getElementById('sh-export');
  if (shExport) {
    shExport.addEventListener('click', function () {
      var rows = [
        ['ticket','symbol','type','lots','open_time','close_time','sl_set','profit_usd'],
        ['••2324','XAUUSD','BUY','5.00','2026-05-28 21:02','2026-05-28 21:26','no','+1240'],
        ['••2381','WTICASH','BUY','10.00','2026-05-29 10:11','2026-05-29 10:12','no','-410'],
        ['••2402','WTICASH','BUY','20.00','2026-05-29 10:14','2026-05-29 11:03','no','+3960'],
        ['••2544','XAUUSD','SELL','5.00','2026-06-01 09:40','2026-06-01 10:22','no','+2210'],
        ['••2561','XRPUSD','BUY','3.00','2026-06-01 14:05','2026-06-01 14:06','no','-483'],
        ['••2570','WTICASH','BUY','20.00','2026-06-02 11:30','2026-06-02 12:40','no','+5120']
      ];
      var csv = rows.map(function (r) { return r.join(','); }).join('\n');
      csv += '\n# Steadyward sample export. Illustrative data, not client records.';
      var blob = new Blob([csv], { type: 'text/csv' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'steadyward_sample_export.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  // hide-on-scroll-down / show-on-scroll-up header
  var siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    var lastY = window.pageYOffset || 0;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || 0;
      if (y > lastY && y > 140) siteHeader.classList.add('sh-hide');
      else siteHeader.classList.remove('sh-hide');
      lastY = y;
    }, { passive: true });
  }
})();
