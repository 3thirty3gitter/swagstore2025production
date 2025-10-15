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
        const url = json?.settings?.logoUrl || fallbackSrc || null;
        if (mounted && url) setLogo(url);
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fallbackSrc]);

  if (!logo) return null;

  return (
    <div className="h-10 w-auto relative">
      <Image src={logo} alt="Site logo" fill style={{ objectFit: 'contain' }} sizes="(max-width: 640px) 120px, 220px" />
    </div>
  );
}
