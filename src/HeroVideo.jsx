import React, { useEffect, useRef, useState } from 'react';
import { useDocumentVisible, useElementVisible } from './utils/useVisibility';

export default function HeroVideo() {
  const ref = useRef(null);
  const inView = useElementVisible(ref);
  const documentVisible = useDocumentVisible();
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (inView && documentVisible && !reduced) video.play().catch(() => {});
    else video.pause();
  }, [inView, documentVisible, reduced]);
  return <video ref={ref} muted loop playsInline preload="metadata"><source src="/images/hero/chiaroscuro-jewelry.mp4" type="video/mp4"/></video>;
}
