import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { formatPrice } from './utils/format';
import './JewelleryShowcase.css';
import { useDocumentVisible } from './utils/useVisibility';

const selections = [
  { id: 'N1', image: '/images/modern/showcase/necklace.webp', category: 'Necklaces', description: 'A delicate pendant for everyday moments.', position: 'center 70%' },
  { id: 'E1', image: '/images/modern/showcase/earrings.webp', category: 'Earrings', description: 'A polished finishing touch, made for every day.', position: 'center 50%' },
  { id: 'R1', image: '/images/modern/showcase/ring.webp', category: 'Rings', description: 'A timeless solitaire with a beautifully simple setting.', position: 'center 55%' },
  { id: 'B1', image: '/images/modern/showcase/bracelet.webp', category: 'Bracelets', description: 'A graceful line of light for every occasion.', position: 'center 50%' },
  { id: 'P1', image: '/images/modern/showcase/pearl.webp', category: 'Pendants', description: 'A luminous pearl on a delicate chain.', position: 'center 70%' }
];
const interval = 5500;
const ease = [0.22, 1, 0.36, 1];

export default function JewelleryShowcase({ products, renderEnquiry }) {
  const items = useMemo(() => selections.map(selection => ({ ...selection, product: products.find(product => product.id === selection.id) })).filter(item => item.product), [products]);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [moving, setMoving] = useState(false);
  const [progressCycle, setProgressCycle] = useState(0);
  const section = useRef(null);
  const swipeStart = useRef(null);
  const timer = useRef(null);
  const reduced = useReducedMotion();
  const documentVisible = useDocumentVisible();
  const count = items.length;
  const isPaused = paused || hovered || focused || !visible || !documentVisible || !!reduced || moving;
  const goTo = useCallback((next) => {
    if (!count) return;
    const target = (next + count) % count;
    if (target === active) return;
    setPrevious(active);
    setActive(target);
    setMoving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setMoving(false); setPrevious(null); }, reduced ? 0 : 1100);
  }, [active, count, reduced]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!section.current) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (!isPaused) setProgressCycle(value => value + 1); }, [isPaused]);
  useEffect(() => {
    if (isPaused || count < 2) return;
    const id = window.setTimeout(() => goTo(active + 1), interval);
    return () => window.clearTimeout(id);
  }, [isPaused, active, count, goTo]);
  if (!count) return null;
  const current = items[active];
  const previews = Array.from({ length: count - 1 }, (_, index) => (active + index + 1) % count);
  const transition = { duration: reduced ? 0 : 1.05, ease };
  return <section className="jewellery-showcase" aria-labelledby="showcase-title" ref={section}>
    <div className="showcase-heading"><span className="eyebrow">THE AURÉLIA SELECTION</span><h2 id="showcase-title">Discover your next <em>favourite.</em></h2><p>Timeless designs. Modern elegance. Jewellery made for every moment.</p></div>
    <LayoutGroup id="jewellery-cinema"><div className="cinema" aria-label="Jewellery showcase" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(active + (e.key === 'ArrowRight' ? 1 : -1)); } }} onPointerDown={e => { if (e.pointerType !== 'mouse') swipeStart.current = { x: e.clientX, y: e.clientY }; }} onPointerUp={e => { if (!swipeStart.current) return; const dx = e.clientX - swipeStart.current.x, dy = e.clientY - swipeStart.current.y; swipeStart.current = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(active + (dx < 0 ? 1 : -1)); }} onPointerCancel={() => { swipeStart.current = null; }}>
      <div className="cinema-scene" aria-hidden="true">{previous !== null && <img className="cinema-previous" src={items[previous].image} alt="" loading="lazy" style={{ objectPosition: items[previous].position }}/>}<motion.img key={current.id} layoutId={`showcase-photo-${current.id}`} transition={transition} className="cinema-background" src={current.image} alt="" loading="lazy" style={{ objectPosition: current.position, borderRadius: 0 }} /></div>
      <div className="cinema-shade" aria-hidden="true" />
      <div className="cinema-copy" key={current.id} aria-live={isPaused ? 'polite' : 'off'}><span className="cinema-category">{current.category}</span><h3>{current.product.name}</h3><p>{current.description}</p><div className="cinema-price">{formatPrice(current.product.price)} <small>{current.product.priceNote}</small></div><div className="cinema-actions"><Link className="cinema-view" to={`/product/${current.product.slug}`}>View details <ArrowRight size={16}/></Link>{renderEnquiry(current.product)}</div></div>
      <div className="cinema-previews" aria-label="Choose a jewellery piece">{previews.map(index => { const item = items[index]; return <motion.button layout key={item.id} className="cinema-preview" type="button" onClick={() => goTo(index)} aria-label={`Show ${item.product.name}`} transition={transition}><motion.img layoutId={`showcase-photo-${item.id}`} src={item.image} alt="" loading="lazy" style={{ borderRadius: 17 }} transition={transition}/><span>{item.category} <ArrowRight size={14}/></span></motion.button>; })}</div>
      <div className="cinema-controls"><div className="cinema-arrows"><button type="button" onClick={() => goTo(active - 1)} aria-label="Previous jewellery"><ArrowLeft size={18}/></button><button type="button" onClick={() => goTo(active + 1)} aria-label="Next jewellery"><ArrowRight size={18}/></button><button type="button" onClick={() => setPaused(value => !value)} disabled={!!reduced} aria-label={reduced ? 'Autoplay disabled by reduced motion' : paused ? 'Play slideshow' : 'Pause slideshow'} aria-pressed={paused || !!reduced}>{paused || reduced ? <Play size={14}/> : <Pause size={14}/>}</button></div><div className="cinema-progress" aria-hidden="true"><span key={`${active}-${progressCycle}`} style={{ animationPlayState: isPaused ? 'paused' : 'running', animationDuration: `${interval}ms` }}/></div><span className="cinema-count" aria-live={isPaused ? 'polite' : 'off'}>{String(active + 1).padStart(2, '0')} <span>/</span> {String(count).padStart(2, '0')}</span></div>
    </div></LayoutGroup>
  </section>;
}
