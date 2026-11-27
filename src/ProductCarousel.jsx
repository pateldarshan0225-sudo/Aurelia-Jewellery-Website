import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import './ProductCarousel.css';
import { useDocumentVisible, useElementVisible } from './utils/useVisibility';

export default function ProductCarousel({ items, renderCard }) {
  const count = items.length;
  const [active, setActive] = useState(() => Math.floor(count / 2));
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const carouselRef = useRef(null);
  const visible = useElementVisible(carouselRef);
  const documentVisible = useDocumentVisible();
  const startX = useRef(null);
  const dragged = useRef(false);
  const move = useCallback((delta) => setActive(i => (i + delta + count) % count), [count]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || focused || dragging || reduced || !visible || !documentVisible || count < 2) return;
    const timer = window.setInterval(() => move(1), 4000);
    return () => window.clearInterval(timer);
  }, [paused, focused, dragging, reduced, visible, documentVisible, count, move]);

  const distance = (index) => {
    let d = (index - active + count) % count;
    if (d > count / 2) d -= count;
    return d;
  };
  const finishDrag = (event) => {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > 45) { dragged.current = true; move(delta < 0 ? 1 : -1); }
    startX.current = null;
    setDragging(false);
  };
  if (!count) return null;
  return <section ref={carouselRef} className="lux-carousel" aria-label="Featured jewellery carousel" aria-roledescription="carousel"
    onFocus={() => setFocused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
    onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } }}>
    <div className="lux-carousel-stage" onPointerDown={e => { if (e.button !== 0) return; startX.current = e.clientX; dragged.current = false; setDragging(true); }}
      onPointerUp={finishDrag} onPointerLeave={e => { if (e.pointerType === "mouse" && startX.current !== null) finishDrag(e); }} onPointerCancel={() => { startX.current = null; setDragging(false); }}
      onClickCapture={e => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}>
      <div className="lux-carousel-glow" aria-hidden="true" />
      {items.map((item, index) => {
        const offset = distance(index);
        const visible = Math.abs(offset) <= 3;
        return <div key={item.id} className={`lux-carousel-slide ${offset === 0 ? 'is-center' : ''} ${visible ? 'is-near' : 'is-far'}`}
          style={{'--offset': offset, '--depth': Math.abs(offset)}} aria-hidden={offset !== 0} inert={offset !== 0 ? '' : undefined}
          onClickCapture={e => { if (offset !== 0) { e.preventDefault(); e.stopPropagation(); if (!dragged.current) setActive(index); } }}>
          {renderCard(item)}
        </div>;
      })}
      {items.map((item, index) => { const offset = distance(index); return offset !== 0 && Math.abs(offset) <= 3 ? <button key={`select-${item.id}`} type="button" className="lux-carousel-select" style={{'--offset':offset}} onClick={() => setActive(index)} aria-label={`Show ${item.name}`} tabIndex={-1}/> : null; })}
    </div>
    <div className="lux-carousel-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous jewellery"><ArrowLeft size={18}/></button>
      <span className="lux-carousel-count" aria-live={paused || focused ? 'polite' : 'off'}>{String(active + 1).padStart(2, '0')} <span>/</span> {String(count).padStart(2, '0')}</span>
      <button type="button" onClick={() => move(1)} aria-label="Next jewellery"><ArrowRight size={18}/></button>
      <button type="button" className="lux-carousel-pause" onClick={() => setPaused(p => !p)} aria-label={paused || reduced ? 'Play slideshow' : 'Pause slideshow'} aria-pressed={paused || reduced} disabled={reduced} title={reduced ? 'Autoplay is disabled by reduced motion preference' : undefined}>{paused || reduced ? <Play size={14}/> : <Pause size={14}/>}</button>
    </div>
  </section>;
}
