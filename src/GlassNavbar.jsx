import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Gem, BookOpenText, Mail } from 'lucide-react';
import './GlassNavbar.css';

const items = [
  { to: '/', label: 'Home', Icon: House },
  { to: '/collections', label: 'Collections', Icon: Gem },
  { to: '/about', label: 'About us', Icon: BookOpenText },
  { to: '/contact', label: 'Contact us', Icon: Mail }
];

export default function GlassNavbar() {
  const { pathname } = useLocation();
  const active = pathname === '/' ? 0 : pathname.startsWith('/collections') || pathname.startsWith('/product/') ? 1 : pathname.startsWith('/about') ? 2 : pathname.startsWith('/contact') ? 3 : -1;
  return <nav className="glass-nav" aria-label="Main navigation" style={{ '--active': Math.max(active, 0) }} data-has-active={active >= 0}>
    {items.map(item => <Link key={item.to} to={item.to} aria-label={item.label} aria-current={items[active]?.to === item.to ? 'page' : undefined} title={item.label}><item.Icon aria-hidden="true"/></Link>)}
  </nav>;
}
