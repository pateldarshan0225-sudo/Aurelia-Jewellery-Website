import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, X } from 'lucide-react';
import { formatPrice } from './utils/format';
import './AnimatedProductCard.css';

export default function AnimatedProductCard({ product, category, Enquiry }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => { if (panelRef.current) panelRef.current.inert = !open; }, [open]);
  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };
  const destination = `/product/${product.slug}`;
  return <article ref={cardRef} className={`animated-product-card${open ? ' is-open' : ''}`}
    onMouseEnter={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setOpen(true); }}
    onMouseLeave={() => { if (!cardRef.current?.contains(document.activeElement)) close(); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) close(); }}
    onKeyDown={event => { if (event.key === 'Escape' && open) { event.stopPropagation(); close(true); } }}>
    <div className="animated-product-base">
      <div className="animated-product-image"><img src={product.image} alt={product.name} loading="lazy" width="600" height="600"/></div>
      <div className="animated-product-info"><span className="eyebrow">{category?.short || product.category}</span><h3>{product.name}</h3><div className="animated-product-price">{formatPrice(product.price)}</div></div>
    </div>
    <button ref={triggerRef} className="animated-product-trigger" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-label={`Show details for ${product.name}`}>View details <ArrowRight size={15} aria-hidden="true"/></button>
    <div ref={panelRef} className="animated-product-overlay" aria-hidden={!open}>
      <button className="animated-product-close" type="button" onClick={() => close(true)} aria-label={`Close details for ${product.name}`}><X size={18}/></button>
      <div className="animated-product-overlay-content">
        <span className="eyebrow animated-product-reveal">{category?.short || product.category}</span>
        <h3 className="animated-product-reveal">{product.name}</h3>
        {product.description && <p className="animated-product-description animated-product-reveal">{product.description}</p>}
        {product.material && <dl className="animated-product-spec animated-product-reveal"><dt>Material</dt><dd>{product.material}</dd></dl>}
        <div className="animated-product-overlay-price animated-product-reveal">{formatPrice(product.price)}{product.priceNote && <small>{product.priceNote}</small>}</div>
        <div className="animated-product-actions animated-product-reveal"><Enquiry product={product} className="animated-product-enquire"><MessageCircle size={16} aria-hidden="true"/> Enquire now</Enquiry><Link className="animated-product-details" to={destination}>View details <ArrowRight size={16} aria-hidden="true"/></Link></div>
      </div>
    </div>
  </article>;
}
