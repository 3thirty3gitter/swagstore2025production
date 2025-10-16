"use client";

import Link from "next/link";
import SiteLogo from '@/components/ui/SiteLogo';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="h-8">
              <SiteLogo />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">by 3thirty3</span>
              <span className="text-xs text-muted-foreground">🍁 100% Canadian Owned & Operated</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2025 SwagStore</span>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
