/* Sidebar injector + active-route highlighter
   Single source of truth for site nav.
   Each page declares: <aside class="sidebar" data-sidebar="root"|"subfolder"></aside>
*/
(function() {
  var aside = document.querySelector('aside.sidebar[data-sidebar]');
  if (!aside) return;

  var depth = aside.getAttribute('data-sidebar');
  var p = depth === 'subfolder' ? '../' : '';

  // Curriculum collapse state — persist
  var curriculumOpen = false;
  try {
    curriculumOpen = localStorage.getItem('pg-sidebar-curriculum-open') === '1';
  } catch (e) { /* private mode etc */ }

  var html = ''
    + '<div class="sidebar-logo">'
    +   '<img src="' + p + 'assets/images/dhwani-logo.png?v=2" alt="Dhwani RIS">'
    +   '<div class="sidebar-title">AI Playground</div>'
    +   '<div class="sidebar-sub">Product &amp; Operations</div>'
    + '</div>'

    + '<div class="sidebar-section">'
    +   '<a class="sidebar-link" href="' + p + 'index.html"><span class="link-icon">~</span> Home</a>'
    +   '<a class="sidebar-link" href="' + p + 'playground.html"><span class="link-icon">&#9650;</span> The Playground <span class="badge-new">Live</span></a>'
    +   '<a class="sidebar-link" href="' + p + 'program/log.html"><span class="link-icon">&#8226;</span> The Log <span class="badge-new">New</span></a>'
    + '</div>'

    + '<details class="sidebar-section sidebar-collapsible"' + (curriculumOpen ? ' open' : '') + '>'
    +   '<summary class="sidebar-collapsible-trigger">'
    +     '<span class="link-icon">S</span>'
    +     '<span class="sidebar-collapsible-label">All Sessions</span>'
    +     '<span class="sidebar-collapsible-hint">S0&ndash;S6</span>'
    +     '<span class="chev">&#9656;</span>'
    +   '</summary>'
    +   '<div class="sidebar-collapsible-children">'
    +     '<a class="sidebar-link" href="' + p + 'program/curriculum.html"><span class="link-icon">&#9866;</span> All Sessions</a>'
    +     '<a class="sidebar-link" href="' + p + 'program/recordings.html"><span class="link-icon">&#9654;</span> Recordings</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-0.html"><span class="link-icon">0</span> Introduction</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-1.html"><span class="link-icon">1</span> Vibe Coding</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-2.html"><span class="link-icon">2</span> GitHub Knowledge</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-3.html"><span class="link-icon">3</span> Hands On</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-4.html"><span class="link-icon">4</span> CLI &amp; Hooks</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-5.html"><span class="link-icon">5</span> Open Build</a>'
    +     '<a class="sidebar-link" href="' + p + 'sessions/session-6.html"><span class="link-icon">6</span> Chaos &amp; Craft</a>'
    +   '</div>'
    + '</details>'

    + '<div class="sidebar-section">'
    +   '<div class="sidebar-section-title">Program</div>'
    +   '<a class="sidebar-link" href="' + p + 'program/how-we-play.html"><span class="link-icon">&#9679;</span> How We Play</a>'
    +   '<a class="sidebar-link" href="' + p + 'program/courses.html"><span class="link-icon">C</span> Courses</a>'
    + '</div>'

    + '<div class="sidebar-section">'
    +   '<div class="sidebar-section-title">Frameworks</div>'
    +   '<a class="sidebar-link" href="' + p + 'frameworks/builder-protocol.html"><span class="link-icon">B</span> The Builder Protocol</a>'
    + '</div>'

    + '<div class="sidebar-section">'
    +   '<div class="sidebar-section-title">Resources</div>'
    +   '<a class="sidebar-link" href="' + p + 'readings.html"><span class="link-icon">R</span> Readings</a>'
    +   '<a class="sidebar-link" href="' + p + 'tools.html"><span class="link-icon">T</span> Tools</a>'
    +   '<a class="sidebar-link" href="' + p + 'prompts.html"><span class="link-icon">P</span> Prompts</a>'
    + '</div>'

    + '<div class="sidebar-footer">'
    +   '<a href="https://dhwaniris.com">dhwaniris.com</a>'
    +   '<small>Built by Prody &mdash; an agent managed by Nihaan, Product Team @ DRIS</small>'
    + '</div>';

  aside.innerHTML = html;

  // Auto-active highlight — match link href to current path tail
  var here = (location.pathname.split('/').filter(Boolean).slice(-2).join('/')) || 'index.html';
  // Normalise
  var hereTail = location.pathname.replace(/.*\//, '') || 'index.html';
  var hereDir = location.pathname.replace(/[^\/]+$/, '');
  aside.querySelectorAll('a.sidebar-link').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    // Resolve relative paths against current location
    var resolved = new URL(href, location.href).pathname;
    if (resolved === location.pathname) {
      a.classList.add('active');
      // If the active link is inside the collapsible, force it open
      var details = a.closest('details.sidebar-collapsible');
      if (details && !details.open) {
        details.open = true;
        try { localStorage.setItem('pg-sidebar-curriculum-open', '1'); } catch (e) {}
      }
    }
  });

  // Persist collapse state on user interaction
  var details = aside.querySelector('details.sidebar-collapsible');
  if (details) {
    details.addEventListener('toggle', function() {
      try { localStorage.setItem('pg-sidebar-curriculum-open', details.open ? '1' : '0'); } catch (e) {}
    });
  }
})();
