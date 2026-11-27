import { useEffect } from 'react';

export default function CollectionMotion() {
  useEffect(() => {
    const section = document.querySelector('.home-categories');
    if (!section) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let cleanupMotion = () => {};

    function setup() {
      cleanupMotion();
      if (motion.matches) return;
      const cards = [...section.querySelectorAll('.category-card')];
      const text = [...section.querySelectorAll('.category-editorial-heading .eyebrow, .category-editorial-heading h2, .category-editorial-copy p, .category-editorial-copy .text-link')];
      let frame = 0;
      let active = false;
      const listeners = [];
      const reveal = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('collection-visible'); reveal.unobserve(entry.target); }
      }), { threshold: 0.08 }) : null;
      if (reveal) {
        [...text, ...cards].forEach((node, index) => {
          const order = index < text.length ? index : index - text.length;
          node.style.setProperty('--collection-delay', `${order * 120}ms`);
          node.classList.add('collection-reveal');
          reveal.observe(node);
        });
      }
      function update() {
        frame = 0;
        if (!active) return;
        const rect = section.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (window.innerHeight / 2 + rect.height / 2)));
        cards.forEach(card => {
          const column = card.matches('.category-earrings, .category-rings') ? .75 : card.matches('.category-bridal, .category-pendant-sets') ? .55 : 1;
          card.style.setProperty('--collection-scroll-y', `${(progress * 5 * column).toFixed(2)}px`);
        });
      }
      function schedule() { if (active && !frame) frame = requestAnimationFrame(update); }
      const visibility = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
        active = entries[0].isIntersecting;
        if (active) schedule();
      }, { rootMargin: '100px 0px' }) : null;
      if (visibility) visibility.observe(section); else { active = true; schedule(); }
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      if (pointer.matches) cards.forEach(card => {
        const move = event => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--collection-mouse-x', `${((event.clientX - rect.left) / rect.width - .5) * 4}px`);
          card.style.setProperty('--collection-mouse-y', `${((event.clientY - rect.top) / rect.height - .5) * 4}px`);
        };
        const leave = () => { card.style.removeProperty('--collection-mouse-x'); card.style.removeProperty('--collection-mouse-y'); };
        card.addEventListener('pointermove', move, { passive: true });
        card.addEventListener('pointerleave', leave);
        listeners.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
      });
      cleanupMotion = () => {
        reveal?.disconnect(); visibility?.disconnect(); cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
        listeners.forEach(dispose => dispose());
        [...text, ...cards].forEach(node => { node.classList.remove('collection-reveal', 'collection-visible'); node.style.removeProperty('--collection-delay'); });
        cards.forEach(card => { card.style.removeProperty('--collection-scroll-y'); card.style.removeProperty('--collection-mouse-x'); card.style.removeProperty('--collection-mouse-y'); });
      };
    }
    setup();
    motion.addEventListener('change', setup);
    return () => { motion.removeEventListener('change', setup); cleanupMotion(); };
  }, []);
  return null;
}
