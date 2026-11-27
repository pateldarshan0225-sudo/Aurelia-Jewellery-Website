import React, { useState } from 'react';
import { ArrowRight, Diamond, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { siteConfig } from './config/siteConfig';
import './ContactPage.css';

export default function ContactPage({ Enquiry }) {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email || '') ? siteConfig.email : '';
  const phone = /^[+\d\s().-]+$/.test(siteConfig.phone || '') && (siteConfig.phone.match(/\d/g) || []).length >= 7 ? siteConfig.phone : '';
  const address = siteConfig.address && !/coming soon/i.test(siteConfig.address) ? siteConfig.address : '';
  function submitContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const next = {};
    if (!values.name?.trim()) next.name = 'Please enter your name.';
    const digits = (values.phone || '').replace(/\D/g, '');
    if (!values.phone?.trim()) next.phone = 'Please enter your phone number.';
    else if (!/^[+()\d\s-]+$/.test(values.phone) || digits.length < 7 || digits.length > 15) next.phone = 'Please enter a valid phone number.';
    if (!values.message?.trim()) next.message = 'Please enter your message.';
    setErrors(next);
    if (Object.keys(next).length) { setMessage(''); form.elements[Object.keys(next)[0]].focus(); return; }
    setMessage('This demo form is not connected, so your message has not been sent.');
  }
  function clearError(field) { setErrors(previous => ({ ...previous, [field]: undefined })); setMessage(''); }
  return <div className="contact-page">
    <section className="contact-editorial" aria-labelledby="contact-title">
      <div className="contact-editorial-inner">
        <div className="contact-editorial-copy"><span className="eyebrow">A NOTE TO AURÉLIA</span><h1 id="contact-title">Every story starts<br/><em>with a hello.</em></h1><p>Whether you have a question about a piece or need a little help choosing, we would love to hear from you.</p><span className="contact-editorial-signature"><span/> THOUGHTFULLY YOURS <Diamond size={12}/></span></div>
        <aside className="contact-editorial-note" aria-label="A note from Aurélia"><span className="contact-editorial-note-icon"><Sparkles size={21}/></span><span className="contact-editorial-note-label">THE AURÉLIA EXPERIENCE</span><p>For the pieces you love,<br/><em>and the moments they hold.</em></p><span className="contact-editorial-note-rule"/></aside>
      </div>
    </section>
    <section className="contact-main" aria-label="Contact Aurélia">
      <div className="contact-main-inner">
        <div className="contact-intro"><span className="eyebrow">HERE FOR YOU</span><h2>Let’s <em>connect.</em></h2><p className="contact-intro-text">Have a piece in mind? We’re here to help you discover something that feels like you.</p>
          <div className="contact-info-card"><span className="contact-info-eyebrow">VISIT &amp; ENQUIRE</span><h3>{siteConfig.brandName}</h3><div className="contact-info-row"><MapPin size={18} aria-hidden="true"/><span>{address && <>{address}<br/></>}{siteConfig.city}</span></div>{email && <a className="contact-info-row" href={`mailto:${email}`}><Mail size={18} aria-hidden="true"/><span>{email}</span></a>}{phone && <a className="contact-info-row" href={`tel:${phone.replace(/[^+\d]/g,'')}`}><Phone size={18} aria-hidden="true"/><span>{phone}</span></a>}<Enquiry className="contact-whatsapp"><MessageCircle size={17} aria-hidden="true"/> Enquire on WhatsApp <ArrowRight size={16} aria-hidden="true"/></Enquiry></div>
          <p className="contact-intro-footnote"><Diamond size={13} aria-hidden="true"/> A little beauty, every day.</p>
        </div>
        <form className="contact-form" noValidate onSubmit={submitContact}><span className="eyebrow">SEND US A NOTE</span><h2>Let’s start a <em>conversation.</em></h2><p className="contact-form-intro">Tell us what’s on your mind.</p><p className="contact-demo-note">Demo website · This form is not connected and messages are not sent.</p>
          <label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} onChange={() => clearError('name')} placeholder="Your name"/>{errors.name && <span className="contact-field-error" id="contact-name-error" role="alert">{errors.name}</span>}
          <label htmlFor="contact-phone">Phone number <span>*</span></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contact-phone-error' : undefined} onChange={() => clearError('phone')} placeholder="Your phone number"/>{errors.phone && <span className="contact-field-error" id="contact-phone-error" role="alert">{errors.phone}</span>}
          <label htmlFor="contact-message">Your message <span>*</span></label><textarea id="contact-message" name="message" required rows="4" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} onChange={() => clearError('message')} placeholder="How can we help?"/>{errors.message && <span className="contact-field-error" id="contact-message-error" role="alert">{errors.message}</span>}
          <button className="contact-submit" type="submit">Send message <ArrowRight size={16} aria-hidden="true"/></button>{message && <p className="contact-form-status" role="status">{message}</p>}
        </form>
      </div>
    </section>
  </div>;
}
