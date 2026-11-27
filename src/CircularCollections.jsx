import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import './CircularCollections.css';
import { useDocumentVisible } from './utils/useVisibility';

const copy = {
  necklaces: ['Everyday radiance', 'Discover delicate chains, layered necklaces, and timeless silhouettes designed to complement every moment.'],
  earrings: ['A little light, every day', 'From understated studs to statement hoops, discover elegant earrings that bring effortless sophistication to your everyday style.'],
  rings: ['Made to be yours', 'Explore refined stackable bands, contemporary silhouettes, and beautiful solitaire designs made to celebrate your individuality.'],
  bracelets: ['Grace in every detail', 'Discover graceful tennis bracelets, delicate chains, and contemporary cuffs that add a touch of elegance to every occasion.'],
  bridal: ['For a moment like no other', "Celebrate life's most meaningful moments with romantic, refined jewellery designed for unforgettable occasions."],
  'pendant-sets': ['Close to the heart', 'Explore delicate pendants and beautifully coordinated designs that bring a personal touch to your jewellery collection.'],
};
const imageFor = slug => `/images/modern/categories/${slug === 'necklaces' ? 'necklaces-editorial' : slug === 'bridal' ? 'bridal-editorial' : slug}.webp`;

export default function CircularCollections({ categories = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const touchStart = useRef(null);
  const reduced = useReducedMotion();
  const documentVisible = useDocumentVisible();
  const count = categories.length;
  const safeIndex = count ? index % count : 0;
  const active = categories[safeIndex];
  const step = direction => setIndex(current => (current + direction + count) % count);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [count]);
  useEffect(() => {
    if (count < 2 || paused || interacting || !inView || !documentVisible || reduced) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % count), 5000);
    return () => window.clearInterval(timer);
  }, [count, paused, interacting, inView, documentVisible, reduced]);
  if (!active) return null;

  const words = (copy[active.slug]?.[1] || '').split(' ');
  const positions = count > 2 ? [-1, 0, 1] : count === 2 ? [0, 1] : [0];
  const sectionKeyDown = event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  };
  return <section ref={sectionRef} className="circular-collections" aria-label="Our signature collections" onFocusCapture={event => { if (event.target.matches(':focus-visible')) setInteracting(true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }} onKeyDown={sectionKeyDown}>
    <div className="circular-collections-inner">
      <div className="circular-collections-heading"><span className="eyebrow">THE AURÉLIA EDIT</span><h2>Our signature <em>collections.</em></h2></div>
      <div className="circular-collections-layout">
        <div className="circular-collections-stage" aria-label="Jewellery categories" onTouchStart={event => { touchStart.current = event.touches[0].clientX; setInteracting(true); }} onTouchEnd={event => { if (touchStart.current !== null) { const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1); touchStart.current = null; } setInteracting(false); }}>
          {positions.map(position => {
            const item = categories[(safeIndex + position + count) % count];
            return <motion.button key={item.slug} type="button" className={`circular-collections-image circular-collections-image--${position === 0 ? 'active' : position < 0 ? 'previous' : 'next'}`} aria-label={position === 0 ? `${item.label}, current category` : `Show ${item.label}`} aria-current={position === 0 ? 'true' : undefined} onClick={() => position && step(position)} initial={false} animate={{ x: `${position * 49}%`, y: position ? '-5%' : '0%', scale: position ? .85 : 1, rotateY: reduced ? 0 : position * -15, opacity: position ? .78 : 1, zIndex: position === 0 ? 3 : 2 }} transition={{ duration: reduced ? 0 : .8, ease: [0.22, 1, 0.36, 1] }}>
              <img src={imageFor(item.slug)} alt={item.label} draggable="false" loading="lazy"/>
            </motion.button>;
          })}
        </div>
        <div className="circular-collections-content">
          <span className="eyebrow">EXPLORE BY CATEGORY</span>
          <div className="circular-collections-copy" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.slug} initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(3px)' }} transition={{ duration: reduced ? 0 : .32 }}>
                <h3>{active.label}</h3><p className="circular-collections-subtitle">{copy[active.slug]?.[0]}</p>
                <p className="circular-collections-description">{words.map((word, i) => <motion.span key={`${word}-${i}`} initial={reduced ? false : { opacity: 0, y: 5, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reduced ? 0 : .32, delay: reduced ? 0 : Math.min(i * .018, .36) }}>{word}{' '}</motion.span>)}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Link className="circular-collections-link" to={`/collections?category=${active.slug}`}>Explore collection <ArrowRight size={16} aria-hidden="true"/></Link>
          <div className="circular-collections-controls" aria-label="Category navigation">
            <button type="button" onClick={() => step(-1)} aria-label="Previous category"><ArrowLeft size={18}/></button>
            <span className="circular-collections-counter">{String(safeIndex + 1).padStart(2, '0')} <span>/</span> {String(count).padStart(2, '0')}</span>
            <button type="button" onClick={() => step(1)} aria-label="Next category"><ArrowRight size={18}/></button>
            <button type="button" className="circular-collections-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play automatic rotation' : 'Pause automatic rotation'} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
