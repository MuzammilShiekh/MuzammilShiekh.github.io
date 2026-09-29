// Decorative effects only; content and links work without JavaScript.
(() => {
  const allowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const cards = [...document.querySelectorAll('.profile-note, .project, .skills > div')];
  let frame = 0;
  let pending = null;
  const reset = card => {
    card.classList.remove('pointer-active');
    for (const property of ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y']) card.style.removeProperty(property);
  };
  const clear = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    pending = null;
    cards.forEach(reset);
  };
  cards.forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!allowed.matches || event.pointerType === 'touch') return;
      pending = { card, x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!pending || !allowed.matches) return;
        const { card, x, y } = pending;
        pending = null;
        const rect = card.getBoundingClientRect();
        const horizontal = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        const vertical = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
        card.style.setProperty('--pointer-x', `${horizontal * 100}%`);
        card.style.setProperty('--pointer-y', `${vertical * 100}%`);
        card.style.setProperty('--tilt-x', `${(0.5 - vertical) * 2}deg`);
        card.style.setProperty('--tilt-y', `${(horizontal - 0.5) * 2}deg`);
        card.classList.add('pointer-active');
      });
    }, { passive: true });
    const leave = () => {
      if (pending?.card === card) {
        cancelAnimationFrame(frame);
        frame = 0;
        pending = null;
      }
      reset(card);
    };
    card.addEventListener('pointerleave', leave);
    card.addEventListener('pointercancel', leave);
  });
  allowed.addEventListener('change', clear);
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
})();
