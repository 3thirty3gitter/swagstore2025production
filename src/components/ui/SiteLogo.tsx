"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Settings = { logoUrl?: string };

export default function SiteLogo({ fallbackSrc }: { fallbackSrc?: string }) {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/site-settings');
        const json = await res.json();
        const raw = json?.settings?.logoUrl || fallbackSrc || null;
        if (!raw) return;

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
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fallbackSrc]);

  // Don't show anything until logo is loaded - prevents flash
  if (!logo) {
    return <div className="h-10 w-[220px]"></div>;
  }

  return (
    <div className="h-10 w-auto">
      <Image 
        src={logo} 
        alt="Site logo" 
        width={220} 
        height={40} 
        style={{ objectFit: 'contain' }} 
        priority
      />
    </div>
  );
}
