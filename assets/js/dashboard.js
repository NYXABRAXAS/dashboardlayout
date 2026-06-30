/* ================================================================
   LOS ENTERPRISE DASHBOARD — SHARED JAVASCRIPT
   ================================================================ */

(function () {
  'use strict';

  /* ── Clock ─────────────────────────────────────────────────────── */
  function updateClock() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    var timeStr = h + ':' + m + ':' + s;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateStr = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

    document.querySelectorAll('.js-clock').forEach(function(el){ el.textContent = timeStr; });
    document.querySelectorAll('.js-date').forEach(function(el){ el.textContent = dateStr; });
    document.querySelectorAll('.js-banner-time').forEach(function(el){ el.textContent = timeStr; });
    document.querySelectorAll('.js-banner-date').forEach(function(el){ el.textContent = dateStr; });
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ── Greeting ───────────────────────────────────────────────────── */
  function setGreeting() {
    var h = new Date().getHours();
    var g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    document.querySelectorAll('.js-greeting').forEach(function(el){ el.textContent = g; });
  }
  setGreeting();

  /* ── Sidebar Toggle (mobile) ────────────────────────────────────── */
  var sidebar  = document.getElementById('sidebar');
  var overlay  = document.getElementById('sidebar-overlay');
  var toggler  = document.getElementById('sidebar-toggle');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggler)  toggler.addEventListener('click', openSidebar);
  if (overlay)  overlay.addEventListener('click', closeSidebar);

  /* ── Active Nav Link ────────────────────────────────────────────── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(function(link) {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ── Chart helpers ──────────────────────────────────────────────── */
  window.LOS = window.LOS || {};

  /* Shared chart defaults applied via ApexCharts defaults */
  window.LOS.chartDefaults = {
    fontFamily: "'Inter', -apple-system, sans-serif",
    foreColor:  '#64748b',
    toolbar:    { show: false },
    animations: { speed: 600 }
  };

  /* Currency formatter (INR) */
  window.LOS.fmtINR = function(val) {
    if (!val) return '₹0';
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000)   return '₹' + (val / 100000).toFixed(2) + ' L';
    if (val >= 1000)     return '₹' + (val / 1000).toFixed(1) + ' K';
    return '₹' + val;
  };

  /* SLA gauge renderer */
  window.LOS.renderSLAGauge = function(pct, fillId, pctId) {
    var el = document.getElementById(fillId);
    var pe = document.getElementById(pctId);
    if (!el || !pe) return;
    var circumference = 2 * Math.PI * 44;
    el.setAttribute('stroke-dasharray', circumference);
    var offset = circumference - (pct / 100) * circumference;
    el.setAttribute('stroke-dashoffset', offset);
    el.setAttribute('stroke', pct >= 80 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626');
    pe.textContent = Math.round(pct) + '%';
  };

  /* Animate numbers */
  window.LOS.animateNum = function(el, target, prefix, suffix) {
    if (!el) return;
    prefix = prefix || '';
    suffix = suffix || '';
    var start = 0;
    var duration = 800;
    var startTime = performance.now();
    function tick(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(start + (target - start) * ease);
      el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  /* Stage bar fill helper */
  window.LOS.fillBars = function(items) {
    var max = 1;
    items.forEach(function(it){ if (it.val > max) max = it.val; });
    items.forEach(function(it){
      var el = document.getElementById(it.barId);
      if (el) el.style.width = Math.round((it.val / max) * 100) + '%';
    });
  };

})();
