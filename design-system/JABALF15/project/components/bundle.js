/* @ds-bundle: {"format":4,"namespace":"JABALF15","components":[]} */
/* JABALF15 — behaviour for the reference binder. One classic script, no dependencies.
   It is the script of «مرجع إنذار الحريق المعرّب» with every part guarded, so a page that
   carries only some of the components still runs. Numbers in brackets are the items of the
   accessibility review each line answers. Markup contracts are in each component's README. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var api = {};

  /* [8] when the view jumps, focus goes with it */
  function focusTarget(el) {
    if (!el) return;
    if (el.matches && el.matches('.sec, .sub, .sheet, .plate')) el = el.querySelector('h2, h3, .plate-title') || el;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }
  /* [14] bring the selected tab into view by scrolling the rail itself; the page never scrolls sideways */
  function centerInRail(t) {
    var w = t.parentElement; if (!w || w.scrollWidth <= w.clientWidth) return;
    var r = t.getBoundingClientRect(), wr = w.getBoundingClientRect();
    w.scrollLeft += (r.left + r.width / 2) - (wr.left + wr.width / 2);
  }
  /* [13] a table wider than its frame becomes a named, focusable scroll region; otherwise it stays out of the tab order */
  function markScrollers() {
    $$('.tw').forEach(function (w) {
      if (w.scrollWidth > w.clientWidth + 1) {
        if (!w.hasAttribute('tabindex')) {
          var s = w.closest('.sec, .sub, .card'), h = s && s.querySelector('h2, h3');
          w.setAttribute('tabindex', '0'); w.setAttribute('role', 'group');
          w.setAttribute('aria-label', 'جدول يُمرَّر أفقيًا' + (h ? ': ' + h.textContent.trim() : ''));
        }
      } else if (w.getAttribute('role') === 'group') {
        w.removeAttribute('tabindex'); w.removeAttribute('role'); w.removeAttribute('aria-label');
      }
    });
  }

  var tabs = [], panels = [], zoom = null, zsheet = null, ztitle = null, lastFocus = null;
  var q = null, fcat = null, ftype = null, fkind = null, fmemo = null, count = null, docs = [], cache = null, nums = {};

  /* ---------- tabs ---------- */
  function show(id, opt) {
    opt = opt || {};
    if (!document.getElementById('p-' + id)) return;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on) centerInRail(t);
    });
    panels.forEach(function (p) { p.hidden = p.id !== 'p-' + id; });
    markScrollers();
    if (opt.top) {
      var rail = $('.rail');
      if (rail) {
        var y = rail.getBoundingClientRect().top + window.pageYOffset;
        if (window.pageYOffset > y) window.scrollTo(0, y);
      }
    }
    if (opt.hash !== false) { try { history.replaceState(null, '', '#' + id); } catch (e) {} }
  }
  function goToId(id, opt) {
    if (!id) return false;
    if (document.getElementById('p-' + id)) { show(id, opt || { top: true }); return true; }
    var el = document.getElementById(id);
    if (!el) return false;
    var p = el.closest ? el.closest('.panel') : null;
    if (p) show(p.id.slice(2), { hash: false });
    setTimeout(function () { el.scrollIntoView(); if (!opt || opt.focus !== false) focusTarget(el); }, 0);
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    return true;
  }
  function fromHash() { goToId((location.hash || '').slice(1), { hash: false, focus: false }); }

  /* ---------- zoom overlay ---------- */
  /* [10] while the dialog is open, everything beside it is inert */
  function setInert(on) {
    Array.prototype.forEach.call(zoom.parentNode.children, function (el) {
      if (el !== zoom && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') el.inert = on;
    });
  }
  /* [15] smallest sheet width that brings the smallest label of this figure to 11px (capped at 1600px) */
  function sheetWidthFor(svg) {
    var min = Infinity, vb = svg.viewBox && svg.viewBox.baseVal;
    var seen = function (t) { var f = parseFloat(t.getAttribute('font-size')); if (f && f < min) min = f; };
    $$('text', svg).forEach(seen);
    $$('use', svg).forEach(function (u) { var g = document.getElementById((u.getAttribute('href') || '').slice(1)); if (g) $$('text', g).forEach(seen); });
    if (!vb || !isFinite(min)) return '';
    var need = Math.ceil(11 / min * vb.width) + 20;
    return need > 900 ? Math.min(need, 1600) + 'px' : '';
  }
  function openZoom(plate) {
    if (!zoom || !zsheet) return;
    var svg = $('.figsvg', plate); if (!svg) return;
    var c = svg.cloneNode(true);
    $$('[id]', c).forEach(function (n) { n.removeAttribute('id'); });
    if (plate.classList.contains('is-orig')) $$('.ov', c).forEach(function (n) { n.style.display = 'none'; });
    zsheet.innerHTML = ''; zsheet.appendChild(c);
    zsheet.style.minWidth = sheetWidthFor(svg);
    if (ztitle) ztitle.textContent = ($('.plate-title', plate) || {}).textContent || '';
    lastFocus = document.activeElement;
    zoom.hidden = false; document.body.style.overflow = 'hidden'; setInert(true);
    var b = $('button', zoom); if (b) b.focus();
  }
  function closeZoom() {
    if (!zoom || zoom.hidden) return;
    zoom.hidden = true; zsheet.innerHTML = ''; document.body.style.overflow = ''; setInert(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- copy template text ---------- */
  function copySheet(btn) {
    var body = $('#' + btn.getAttribute('data-copy') + ' .sheet-body'); if (!body) return;
    var text = body.innerText.replace(/\n{3,}/g, '\n\n').trim();
    var done = function () { var o = btn.textContent; btn.textContent = 'نُسخ'; setTimeout(function () { btn.textContent = o; }, 1600); };
    var fallback = function () {
      var r = document.createRange(); r.selectNodeContents(body);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      var o = btn.textContent; btn.textContent = 'النص محدَّد، انسخه'; setTimeout(function () { btn.textContent = o; }, 2600);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  /* ---------- index filter ---------- */
  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/[®™]/g, '').replace(/\s+/g, ' ').trim();
  }
  function filter() {
    if (!q) return;
    if (!cache) cache = docs.map(function (d) { return norm(d.textContent); });
    var raw = norm(q.value), g = fcat ? fcat.value : '', ty = ftype ? ftype.value : '', k = fkind ? fkind.value : '', mm = !!(fmemo && fmemo.checked), shown = 0;
    var m = raw.match(/^(?:nfpa)?\s*(\d+)\s*([a-z]{0,2})$/), numMode = false, wantNum = '', wantSuf = '';
    if (m && nums[m[1]]) { numMode = true; wantNum = m[1]; wantSuf = m[2] || ''; }
    var words = raw ? raw.split(' ') : [];
    docs.forEach(function (d, i) {
      var ok = true;
      if (g && d.getAttribute('data-g') !== g) ok = false;
      if (ok && ty && (d.getAttribute('data-t') || '').indexOf(ty) < 0) ok = false;
      if (ok && k && d.getAttribute('data-k') !== k) ok = false;
      if (ok && mm && !d.hasAttribute('data-m')) ok = false;
      if (ok && raw) {
        if (numMode) {
          ok = d.getAttribute('data-n') === wantNum;
          if (ok && wantSuf) ok = (d.getAttribute('data-c') || '').indexOf(wantNum + wantSuf) === 0;
        } else {
          for (var j = 0; j < words.length; j++) { if (cache[i].indexOf(words[j]) < 0) { ok = false; break; } }
        }
      }
      d.hidden = !ok; if (ok) shown++;
    });
    if (count) count.innerHTML = 'يُعرض <b>' + shown + '</b> من <b>' + docs.length + '</b> وثيقة' + (numMode ? ' — كل ما يحمل الرقم ' + wantNum : '');
  }
  function openStd(code) {
    if (!q) return;
    show('codes', {});
    if (fcat) fcat.value = ''; if (ftype) ftype.value = ''; if (fkind) fkind.value = ''; if (fmemo) fmemo.checked = false;
    q.value = code; filter();
    setTimeout(function () { var l = $('#cd-list') || $('#docs'); if (l) { l.scrollIntoView(); focusTarget(l); } }, 0);
  }

  /* ---------- one delegated click handler ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var hl = t.closest('a[href^="#"]');
    if (hl) { if (goToId(hl.getAttribute('href').slice(1))) ev.preventDefault(); return; }
    var go = t.closest('[data-go]');
    if (go) { var gid = go.getAttribute('data-go'); show(gid, { top: true }); focusTarget(document.getElementById('t-' + gid)); return; }
    var std = t.closest('.std');
    if (std) { if (std.hasAttribute('data-std')) openStd(std.getAttribute('data-std')); return; }
    var seg = t.closest('.seg button');
    if (seg) {
      var host = seg.closest('.plate') || seg.closest('.seg');
      var orig = seg.getAttribute('data-mode') === 'orig';
      host.classList.toggle('is-orig', orig);
      $$('.seg button', host).forEach(function (b) { b.setAttribute('aria-pressed', b === seg ? 'true' : 'false'); });
      return;
    }
    var z = t.closest('.zbtn') || t.closest('.paper');
    if (z) { var pl = z.closest('.plate'); if (pl && !pl.classList.contains('crop')) openZoom(pl); return; }
    var cp = t.closest('.copy');
    if (cp) { copySheet(cp); return; }
    var qa = t.closest('[data-quiz-all]');
    if (qa) {
      /* self-test: one button opens every answer in its group, then closes them */
      var scope = qa.closest('[data-quiz]') || document, open = qa.getAttribute('aria-pressed') === 'true';
      $$('details.quiz', scope).forEach(function (d) { d.open = !open; });
      qa.setAttribute('aria-pressed', open ? 'false' : 'true');
      qa.textContent = open ? 'فتح كل الإجابات' : 'إغلاق كل الإجابات';
      return;
    }
    if (t.closest('.top')) { window.scrollTo(0, 0); }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeZoom(); });

  /* print: paper is white, so the page prints in the light theme with every answer open, then returns */
  var printState = null;
  window.addEventListener('beforeprint', function () {
    var html = document.documentElement, quiz = $$('details.quiz');
    printState = { theme: html.getAttribute('data-theme'), open: quiz.map(function (d) { return d.open; }) };
    html.setAttribute('data-theme', 'light');
    quiz.forEach(function (d) { d.open = true; });
  });
  window.addEventListener('afterprint', function () {
    if (!printState) return;
    var html = document.documentElement;
    if (printState.theme === null) html.removeAttribute('data-theme'); else html.setAttribute('data-theme', printState.theme);
    $$('details.quiz').forEach(function (d, i) { d.open = !!printState.open[i]; });
    printState = null;
  });

  function boot() {
    var html = document.documentElement;
    if (!html.hasAttribute('lang')) html.lang = 'ar';
    if (!html.hasAttribute('dir')) html.dir = 'rtl';

    tabs = $$('.tab'); panels = $$('.panel');
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.getAttribute('data-tab'), { top: true }); });
      t.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowLeft' ? 1 : ev.key === 'ArrowRight' ? -1 : 0;   // RTL: left = next
        if (getComputedStyle(t).direction === 'ltr') d = -d;
        var n = ev.key === 'Home' ? tabs[0] : ev.key === 'End' ? tabs[tabs.length - 1] : d ? tabs[(i + d + tabs.length) % tabs.length] : null;
        if (!n) return;
        ev.preventDefault();
        n.focus(); show(n.getAttribute('data-tab'), { top: true });
      });
    });
    if (tabs.length) { window.addEventListener('hashchange', fromHash); fromHash(); }

    var topBtn = $('.top');
    if (topBtn) {
      var onScroll = function () { topBtn.hidden = window.pageYOffset < 700; };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
    window.addEventListener('resize', markScrollers);

    /* tables: label each cell so rows can stack on narrow screens */
    $$('.tw table').forEach(function (t) {
      if (t.classList.contains('keep')) return;
      var heads = $$('thead th', t).map(function (th) { return th.textContent.trim(); });
      $$('tbody tr', t).forEach(function (tr) {
        $$('th, td', tr).forEach(function (td, i) { if (heads[i]) td.setAttribute('data-label', heads[i]); });
      });
      t.classList.add('tstack');
    });
    markScrollers();
    window.addEventListener('load', markScrollers);

    zoom = $('#zoom'); zsheet = zoom && $('.zsheet', zoom); ztitle = zoom && $('.ztitle', zoom);
    if (zoom) zoom.addEventListener('click', function (ev) { if (ev.target.closest('button') || ev.target === zoom || ev.target.classList.contains('zbody')) closeZoom(); });

    docs = $$('#docs .doc'); q = $('#q'); fcat = $('#fcat'); ftype = $('#ftype'); fkind = $('#fkind'); fmemo = $('#fmemo'); count = $('#count');
    docs.forEach(function (d) { nums[d.getAttribute('data-n')] = 1; });
    if (q) {
      var tmr = null;
      q.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(filter, 120); });
      [fcat, ftype, fkind, fmemo].forEach(function (s) { if (s) s.addEventListener('change', filter); });
      filter();
    }

    /* glossary filter */
    var gq = $('#gq'), terms = $$('.term'), gcache = null, gcount = $('#gcount'), groups = $$('.ggroup');
    if (gq) {
      var gfilter = function () {
        if (!gcache) gcache = terms.map(function (t) { return norm(t.textContent); });
        var raw = norm(gq.value), words = raw ? raw.split(' ') : [], shown = 0;
        terms.forEach(function (t, i) {
          var ok = true;
          for (var j = 0; j < words.length; j++) { if (gcache[i].indexOf(words[j]) < 0) { ok = false; break; } }
          t.hidden = !ok; if (ok) shown++;
        });
        groups.forEach(function (g) { g.hidden = !$$('.term', g).some(function (t) { return !t.hidden; }); });
        if (gcount) gcount.innerHTML = 'يُعرض <b>' + shown + '</b> من <b>' + terms.length + '</b> مصطلحًا';
      };
      gq.addEventListener('input', gfilter); gfilter();
    }
  }

  api.boot = boot; api.show = show; api.goToId = goToId; api.openZoom = openZoom; api.closeZoom = closeZoom;
  api.focusTarget = focusTarget; api.markScrollers = markScrollers;
  window.JABALF15 = api;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
