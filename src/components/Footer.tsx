"use client";

import Link from "next/link";
import SiteLogo from '@/components/ui/SiteLogo';

export default function Footer() {
  return (
  <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="h-12">
              <SiteLogo />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">by 3thirty3</span>
              <span className="text-xs text-muted-foreground">🍁 100% Canadian Owned & Operated</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <span>•</span>
            <Link href="/request-store" className="hover:text-foreground transition-colors">Request Store</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span>•</span>
            <span>© 2025 SwagStore</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
