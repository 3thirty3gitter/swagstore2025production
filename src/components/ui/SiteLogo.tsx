"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Settings = { logoUrl?: string };

export default function SiteLogo({ fallbackSrc }: { fallbackSrc?: string }) {
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        if (mounted) setLoading(false);
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
