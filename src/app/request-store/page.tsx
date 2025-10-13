import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store, MapPin, Truck, Calculator } from 'lucide-react';
import StoreRequestForm from '@/components/StoreRequestForm';

export const metadata: Metadata = {
  title: 'Request Your Free Canadian Store | SwagStore',
  description: 'Get your custom merchandise store set up in 24 hours. Free setup for Canadian teams, clubs, and organizations. Serving all provinces and territories.',
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
              <span className="font-bold text-xl">SwagStore Canada</span>
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍁</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              Get Your Free Canadian SwagStore
            </h1>
            <span className="text-2xl">🍁</span>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Tell us about your Canadian team and we'll create a custom merchandise store for you. 
            No upfront costs, no setup fees - just start selling and earning SwagBucks in CAD!
          </p>
          
          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free Setup & Canadian Hosting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>24-Hour Launch Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Earn SwagBucks in CAD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Coast-to-Coast Shipping</span>
            </div>
          </div>

          {/* Canadian Coverage */}
          <div className="bg-muted/30 rounded-lg p-6 max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Serving All of Canada</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              From Vancouver Island to Newfoundland, from Toronto to Yellowknife - 
              we ship to all 10 provinces and 3 territories with competitive Canadian rates.
            </p>
          </div>
        </div>

        {/* Request Form */}
        <StoreRequestForm />

        {/* FAQ Section - Canadian Specific */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">How long does setup take across Canada?</h3>
              <p className="text-muted-foreground">
                Most stores are live within 24 hours of request approval, regardless of your location in Canada. We'll email you as soon as your store is ready with your unique link and admin access.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">What Canadian products can we sell?</h3>
              <p className="text-muted-foreground">
                We offer hockey jerseys, team hoodies, toques, t-shirts, water bottles, backpacks, and more. All products are sourced and shipped from Canada, with custom printing available for team logos and colours.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-2 mb-2">
                <Calculator className="w-5 h-5 text-primary mt-0.5" />
                <h3 className="font-semibold">How do Canadian taxes work?</h3>
              </div>
              <p className="text-muted-foreground">
                We automatically calculate and collect the correct taxes for each province: GST (5%) + PST where applicable, or HST (13-15%) in participating provinces. All prices displayed include applicable taxes.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-2 mb-2">
                <Truck className="w-5 h-5 text-primary mt-0.5" />
                <h3 className="font-semibold">What about shipping across Canada?</h3>
              </div>
              <p className="text-muted-foreground">
                Standard shipping is $9.99 CAD, express is $19.99 CAD. Free shipping on orders over $75 CAD. We ship to all provinces and territories including remote areas in the North.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">How do SwagBucks work in Canada?</h3>
              <p className="text-muted-foreground">
                You earn SwagBucks in Canadian dollars on every sale made through your store. Redeem them for free merchandise, equipment, or donate to your team fund. All SwagBucks values are in CAD.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is there really no cost for Canadian teams?</h3>
              <p className="text-muted-foreground">
                Absolutely! No setup fees, no monthly charges, no hidden costs. We make money when you make sales, so your success is our success. Perfect for Canadian teams on any budget.
              </p>
            </div>
          </div>
        </div>

        {/* Canadian Testimonial Section */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🏆</div>
            <blockquote className="text-lg italic mb-4">
              "SwagStore helped our Toronto hockey team raise over $3,000 CAD in just one season. 
              The setup was incredibly easy and our parents love the quality Canadian-made gear!"
            </blockquote>
            <cite className="text-muted-foreground">
              - Sarah Chen, Team Manager, North York Thunder Hockey
            </cite>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SwagStore Canada. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/admin/login" className="hover:text-foreground">Team Login</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
          <p className="text-xs mt-4">
            Proudly Canadian • Serving teams from coast to coast • All prices in CAD • GST/HST calculated automatically
          </p>
        </div>
      </footer>
    </main>
  );
}