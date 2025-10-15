/* Presentation JS
   - Start button shows the site and hides the intro
   - Keyboard navigation: ArrowRight, ArrowLeft, Escape
   - Prev/Next buttons and clickable dots
*/

(function () {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const startBtn = document.getElementById('startBtn');
  const slidesEl = document.getElementById('slides');
  const slides = Array.from(slidesEl.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsEl = document.getElementById('dots');

  let current = 0;

  // Build dots based on number of slides
  function buildDots() {
    dotsEl.innerHTML = '';
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.setAttribute('data-index', i);
      btn.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(btn);
    });
  }

  function updateSlides() {
    slides.forEach((s, i) => {
      const active = i === current;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', String(!active));
    });
    Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('active', i === current));
    // keep focus inside the active slide for screen readers
    slides[current].focus && slides[current].focus();
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    updateSlides();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Start button reveals the site
  startBtn.addEventListener('click', () => {
    // hide intro visually then remove from accessibility tree
    intro.classList.add('hidden');
    setTimeout(() => { intro.style.display = 'none'; }, 500);
    site.classList.add('ready');
    site.setAttribute('aria-hidden', 'false');
    // focus active slide for keyboard use
    slides[current].focus && slides[current].focus();
  });

  // Prev/Next buttons
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    // ignore keys when typing in inputs/textareas (none in this simple demo)
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') {
      // show intro again
      intro.style.display = '';
      // small delay to allow CSS transition
      setTimeout(() => intro.classList.remove('hidden'), 10);
      site.classList.remove('ready');
      site.setAttribute('aria-hidden', 'true');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // make slides focusable for accessibility (already set in HTML as tabindex=0)
  // initialize
  buildDots();
  updateSlides();

  // Optional: enable auto-play if desired (commented out)
  // let autoplay = setInterval(next, 7000);
  // slidesEl.addEventListener('mouseenter', () => clearInterval(autoplay));
})();
