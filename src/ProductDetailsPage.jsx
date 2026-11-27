import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Expand, Gem, Hash, MessageCircle, Share2, Sparkles, X } from 'lucide-react';
import { formatPrice } from './utils/format';
import AnimatedProductCard from './AnimatedProductCard';
import './ProductDetailsPage.css';

export default function ProductDetailsPage({ products, categories, Enquiry }) {
  const { slug } = useParams();
  const product = products.find(item => item.slug === slug);
  const category = categories.find(item => item.slug === product?.category);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const closeRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => { setImageIndex(0); setZoom(false); setExpanded(false); setShareStatus(''); }, [slug]);
  useEffect(() => {
    if (!zoom) return;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = event => { if (event.key === 'Escape') setZoom(false); if (event.key === 'Tab') { const buttons = [...document.querySelectorAll('.product-detail-lightbox button')]; const first = buttons[0], last = buttons[buttons.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [zoom]);
  if (!product) return <section className="empty section"><h1>We couldn't find that piece.</h1><p>There's plenty more to discover in our collection.</p><Link className="button button-dark" to="/collections">Explore collections</Link></section>;
  const images = [...new Set((product.images?.length ? product.images : [product.image]).filter(Boolean))];
  const image = images[imageIndex] || images[0];
  const related = products.filter(item => item.id !== product.id).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 4);
  const description = product.description || '';
  const long = description.length > 125;
  const cutoff = long ? Math.max(1, description.lastIndexOf(' ', 125)) : description.length;
  const sample = description.toLowerCase().includes('illustrative demo') || (product.priceNote || '').toLowerCase().includes('sample');
  async function share() {
    const data = { title: product.name, url: window.location.href };
    try {
      if (navigator.share) { await navigator.share(data); setShareStatus(''); }
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(data.url); setShareStatus('Product link copied.'); }
      else setShareStatus('Copy the product link from your browser address bar.');
    } catch (error) { if (error.name !== 'AbortError') setShareStatus('Unable to share. Copy the link from your browser address bar.'); }
  }
  return <motion.div key={product.id} className="product-detail-page" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
    <div className="product-detail-inner">
      <nav className="product-detail-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/collections">Collections</Link><span>/</span><span aria-current="page">{product.name}</span></nav>
      <div className="product-detail-layout">
        <motion.div className="product-detail-gallery" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          {image ? <button type="button" className="product-detail-photo" onClick={() => setZoom(true)} aria-label={`Enlarge photo of ${product.name}`}><AnimatePresence mode="wait" initial={false}><motion.img key={image} src={image} alt={product.name} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}/></AnimatePresence><span><Expand size={15}/> Enlarge</span></button> : <div className="product-detail-no-image">Image unavailable</div>}
          {images.length > 1 && <div className="product-detail-dots" aria-label="Product images">{images.map((src, index) => <button key={src} type="button" onClick={() => setImageIndex(index)} aria-label={`View image ${index + 1}`} aria-pressed={imageIndex === index}/>)}</div>}
        </motion.div>
        <motion.div className="product-detail-info" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: reduced ? 0 : .12 }}>
          <span className="eyebrow">{category?.label || product.category}</span><h1>{product.name}</h1>
          <p className="product-detail-price">{formatPrice(product.price)} {product.priceNote && <small>{product.priceNote}</small>}</p>
          <div className="product-detail-badges"><span><Gem size={14}/>{category?.label || product.category}</span>{product.productCode && <span><Hash size={14}/>{product.productCode}</span>}{product.material && <span><Sparkles size={14}/>{product.material}</span>}</div>
          <div className="product-detail-actions"><Enquiry product={product} className="product-detail-enquire"><MessageCircle size={17}/> Enquire on WhatsApp <ArrowRight size={16}/></Enquiry><button type="button" onClick={share} className="product-detail-share"><Share2 size={16}/> Share product</button></div>
          <p className="product-detail-share-status" role="status">{shareStatus}</p>
          {description && <div className="product-detail-description"><h2>The details</h2><motion.div initial={false} animate={{ height: 'auto' }} transition={{ duration: reduced ? 0 : .3 }}><p>{expanded || !long ? description : `${description.slice(0, cutoff).trimEnd()}…`}</p></motion.div>{long && <button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? 'Read less' : 'Read more'} <ChevronDown size={14} className={expanded ? 'is-up' : ''}/></button>}{sample && !expanded && long && <p className="product-detail-disclosure">Illustrative demo design; details and pricing are sample information.</p>}</div>}
          {(product.material || product.productCode) && <details className="product-detail-accordion"><summary>Product information <ChevronDown size={16}/></summary><dl>{product.material && <div><dt>Material</dt><dd>{product.material}</dd></div>}{product.productCode && <div><dt>Product code</dt><dd>{product.productCode}</dd></div>}</dl></details>}
        </motion.div>
      </div>
    </div>
    {related.length > 0 && <section className="product-related collection-section"><div className="product-detail-inner"><div className="product-related-heading"><span className="eyebrow">THE AURÉLIA EDIT</span><h2>You might also <em>like.</em></h2><p>More pieces to fall in love with.</p></div><div className="product-grid">{related.map((item, i) => <motion.div key={item.id} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .55, delay: reduced ? 0 : i * .08 }}><AnimatedProductCard product={item} category={categories.find(c => c.slug === item.category)} Enquiry={Enquiry}/></motion.div>)}</div></div></section>}
    {zoom && image && <div className="product-detail-lightbox" role="dialog" aria-modal="true" aria-label={`Enlarged photo of ${product.name}`} onMouseDown={event => { if (event.target === event.currentTarget) setZoom(false); }}><button ref={closeRef} type="button" onClick={() => setZoom(false)} aria-label="Close enlarged image"><X size={23}/></button><img src={image} alt={`${product.name}, enlarged view`}/>{images.length > 1 && <div className="product-detail-lightbox-nav"><button type="button" onClick={() => setImageIndex(i => (i - 1 + images.length) % images.length)} aria-label="Previous image"><ArrowLeft/></button><span>{imageIndex + 1} / {images.length}</span><button type="button" onClick={() => setImageIndex(i => (i + 1) % images.length)} aria-label="Next image"><ArrowRight/></button></div>}</div>}
  </motion.div>;
}
