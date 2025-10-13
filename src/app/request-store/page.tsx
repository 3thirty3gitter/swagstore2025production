import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store } from 'lucide-react';
import StoreRequestForm from '@/components/StoreRequestForm';

export const metadata: Metadata = {
  title: 'Request Your Free Store | SwagStore',
  description: 'Get your custom merchandise store set up in 24 hours. Free setup for teams, clubs, and organizations.',
};

export default function RequestStorePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">SwagStore</span>
            </div>
          </div>
          <Link href="/admin/login">
            <Button variant="outline" size="sm">
              Team Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Free SwagStore
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Tell us about your team and we'll create a custom merchandise store for you. 
            No upfront costs, no setup fees - just start selling and earning SwagBucks!
          </p>
          
          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free Setup & Hosting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>24-Hour Launch Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Earn SwagBucks on Every Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No Monthly Fees</span>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <StoreRequestForm />

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">How long does setup take?</h3>
              <p className="text-muted-foreground">
                Most stores are live within 24 hours of request approval. We'll email you as soon as your store is ready with your unique link and admin access.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">What products can we sell?</h3>
              <p className="text-muted-foreground">
                We offer t-shirts, hoodies, hats, water bottles, bags, and more. All products can be customized with your team logo and colors.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">How do SwagBucks work?</h3>
              <p className="text-muted-foreground">
                You earn SwagBucks on every sale made through your store. Redeem them for free merchandise, equipment, or donate to your team fund.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is there really no cost?</h3>
              <p className="text-muted-foreground">
                Absolutely! No setup fees, no monthly charges, no hidden costs. We make money when you make sales, so your success is our success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SwagStore. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/admin/login" className="hover:text-foreground">Team Login</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}