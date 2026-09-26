(() => {
  const items = [...document.querySelectorAll(
    '.hero-copy, .hero-art, .hero-footer, .section-label, .about-copy, ' +
    '.project, .more-experiences article, .timeline li, .learning-grid article, ' +
    '.contact > *, .footer'
  )];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  function update() {
    frame = 0;
    if (reducedMotion.matches) return;
    const height = window.innerHeight;
    // Read all positions before writing styles to avoid repeated layout work.
    const values = items.map((item) => {
      const rect = item.getBoundingClientRect();
      const fadeDistance = Math.min(120, rect.height * 0.25, height * 0.18);
      const visibleEdge = Math.min(rect.bottom, height - rect.top);
      return Math.max(0, Math.min(1, visibleEdge / Math.max(1, fadeDistance)));
    });
    items.forEach((item, index) => {
      item.style.setProperty('--scroll-opacity', values[index].toFixed(3));
    });
  }

  function schedule() {
    if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(update);
  }

  function configure() {
    cancelAnimationFrame(frame);
    frame = 0;
    items.forEach((item) => {
      item.classList.toggle('scroll-fade', !reducedMotion.matches);
      if (reducedMotion.matches) item.style.removeProperty('--scroll-opacity');
    });
    schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  document.addEventListener('toggle', schedule, true);
  reducedMotion.addEventListener('change', configure);
  if ('ResizeObserver' in window) {
    new ResizeObserver(schedule).observe(document.body);
  }
  configure();
})();
