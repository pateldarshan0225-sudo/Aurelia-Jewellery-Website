import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from './config/siteConfig';
import { categories } from './data/products';
import './Footer.css';

const explore = [ ['Home', '/'], ['Collections', '/collections'], ['About Us', '/about'], ['Contact Us', '/contact'] ];

function socialUrl(value, domain) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === domain || url.hostname.endsWith(`.${domain}`)) ? url.href : '';
  } catch { return ''; }
}

function PinterestIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.65 19.31c-.05-.79-.09-2 .02-2.86l1.29-5.47s-.33-.66-.33-1.64c0-1.54.9-2.69 2.02-2.69.95 0 1.41.72 1.41 1.57 0 .96-.61 2.4-.93 3.74-.26 1.12.56 2.04 1.66 2.04 1.99 0 3.52-2.1 3.52-5.13 0-2.68-1.93-4.55-4.69-4.55-3.2 0-5.08 2.4-5.08 4.88 0 .97.37 2.01.84 2.58a.34.34 0 0 1 .08.33l-.31 1.27c-.05.21-.17.26-.39.16-1.45-.67-2.36-2.79-2.36-4.49 0-3.66 2.66-7.02 7.68-7.02 4.03 0 7.17 2.87 7.17 6.71 0 4-2.52 7.22-6.03 7.22-1.18 0-2.29-.61-2.67-1.34l-.72 2.75c-.26 1.01-.97 2.28-1.45 3.06A10 10 0 1 0 12 2Z"/></svg>;
}

export default function Footer({ Logo, Enquiry }) {
  const footerRef = useRef(null);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    footer.classList.add('lux-footer--reveal');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        footer.classList.add('lux-footer--visible');
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const socials = [
    { label: 'Instagram', url: socialUrl(siteConfig.instagram, 'instagram.com'), icon: <Instagram size={17} aria-hidden="true"/> },
    { label: 'Facebook', url: socialUrl(siteConfig.facebook, 'facebook.com'), icon: <Facebook size={17} aria-hidden="true"/> },
    { label: 'Pinterest', url: socialUrl(siteConfig.pinterest, 'pinterest.com'), icon: <PinterestIcon/> },
  ].filter(item => item.url);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email || '') ? siteConfig.email : '';
  const phone = /^[+\d\s().-]+$/.test(siteConfig.phone || '') && (siteConfig.phone.match(/\d/g) || []).length >= 7 ? siteConfig.phone : '';

  return <footer ref={footerRef} className="site-footer">
    <div className="lux-footer-waves" aria-hidden="true">
      {[1, 2, 3].map(layer => <svg key={layer} className={`lux-footer-wave lux-footer-wave--${layer}`} viewBox="0 0 2880 180" preserveAspectRatio="none" focusable="false">
        <path d="M0 80 C240 20 480 20 720 80 S1200 140 1440 80 L1440 180 L0 180 Z"/>
        <path d="M1440 80 C1680 20 1920 20 2160 80 S2640 140 2880 80 L2880 180 L1440 180 Z"/>
      </svg>)}
    </div>
    <div className="lux-footer-shell">
      <div className="lux-footer-grid">
        <div className="lux-footer-col lux-footer-brand">
          <Logo/>
          <p className="lux-footer-description">Timeless elegance for the moments that matter.</p>
          <p className="lux-footer-tagline">A little beauty, every day.</p>
          {socials.length > 0 && <div className="lux-footer-socials" aria-label="Social media">{socials.map(item => <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label}>{item.icon}</a>)}</div>}
        </div>
        <nav className="lux-footer-col" aria-label="Explore">
          <h3>Explore</h3>
          {explore.map(([label, path]) => <Link className="lux-footer-link" key={path} to={path}><span>{label}</span></Link>)}
        </nav>
        <nav className="lux-footer-col" aria-label="Collections">
          <h3>Collections</h3>
          {categories.map(category => <Link className="lux-footer-link" key={category.slug} to={`/collections?category=${category.slug}`}><span>{category.label}</span></Link>)}
        </nav>
        <div className="lux-footer-col lux-footer-contact">
          <h3>Visit &amp; enquire</h3>
          {siteConfig.city && <p><MapPin size={16} aria-hidden="true"/><span>{siteConfig.city}</span></p>}
          {email && <a className="lux-footer-contact-link" href={`mailto:${email}`}><Mail size={16} aria-hidden="true"/><span>{email}</span></a>}
          {phone && <a className="lux-footer-contact-link" href={`tel:${phone.replace(/[^+\d]/g, '')}`}><Phone size={16} aria-hidden="true"/><span>{phone}</span></a>}
          <Enquiry className="lux-footer-enquiry"><MessageCircle size={16} aria-hidden="true"/><span>Enquire on WhatsApp</span><ArrowRight className="lux-footer-enquiry-arrow" size={16} aria-hidden="true"/></Enquiry>
        </div>
        <div className="lux-footer-col lux-footer-newsletter">
          <h3>Stay in the loop.</h3>
          <p>Discover new collections, timeless designs, and exclusive updates.</p>
          <form onSubmit={event => { event.preventDefault(); setNewsletterMessage('Newsletter subscriptions are not available yet.'); }}>
            <label htmlFor="footer-email">Email address</label>
            <div className="lux-footer-newsletter-field">
              <input id="footer-email" type="email" name="email" autoComplete="email" placeholder="Your email address" required aria-describedby="footer-newsletter-status"/>
              <button type="submit"><span>Subscribe</span><ArrowRight size={15} aria-hidden="true"/></button>
            </div>
            <p id="footer-newsletter-status" className="lux-footer-newsletter-status" role="status">{newsletterMessage || 'Newsletter subscriptions are not available yet.'}</p>
          </form>
        </div>
      </div>
      <div className="lux-footer-bottom"><span>{'\u00A9'} {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</span>{siteConfig.demoMode && <span>Demo website {'\u00B7'} Imagery and details are sample content.</span>}</div>
    </div>
  </footer>;
}
