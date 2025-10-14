"use client";

import { Store } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">SwagStore</span>
            <span className="text-sm text-muted-foreground">by 3thirty3</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>🍁 100% Canadian Owned & Operated</span>
            <span>•</span>
            <span>© 2025 SwagStore</span>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
