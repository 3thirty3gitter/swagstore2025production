"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Settings = { logoUrl?: string };

export default function SiteLogo({ fallbackSrc }: { fallbackSrc?: string }) {
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/site-settings');
        const json = await res.json();
        const raw = json?.settings?.logoUrl || fallbackSrc || null;
        if (!raw) {
          if (mounted) setLoading(false);
          return;
        }

        // try signed URL first
        try {
          const signedRes = await fetch('/api/site-settings/signed');
          if (signedRes.ok) {
            const signedJson = await signedRes.json();
            const final = signedJson?.signedUrl || raw;
            if (mounted) setLogo(final);
            return;
          }
        } catch (err) {
          // fallback to raw
        }

        if (mounted) setLogo(raw);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fallbackSrc]);

  // Show skeleton while loading or if no logo
  if (loading || !logo) {
    return (
      <div className="h-10 w-[220px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" 
           style={{ 
             backgroundSize: '200% 100%',
             animation: 'shimmer 1.5s ease-in-out infinite'
           }}>
      </div>
    );
  }

  return (
    <div 
      className="h-10 w-auto transition-opacity duration-500 ease-in-out"
      style={{ opacity: imageLoaded ? 1 : 0 }}
    >
      <Image 
        src={logo} 
        alt="Site logo" 
        width={220} 
        height={40} 
        style={{ objectFit: 'contain' }} 
        priority
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
