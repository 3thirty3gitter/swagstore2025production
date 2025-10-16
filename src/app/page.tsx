import Footer from '@/components/Footer';
import SiteLogo from '@/components/ui/SiteLogo';
import { ArrowRight, Store, Gift, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HomeClient from '@/components/HomeClient';

// This is a server-rendered homepage. Interactive pieces (dialog, forms, state) are
// delegated to the client component `HomeClient` so the root route can be safely
// prerendered at build time on Vercel.
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* Main content */}
      <main className="flex-1">
        {/* High Demand Notice (orange tape) */}
        <section className="py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
              <span className="sr-only">High demand</span>
              <span>🔥 Overwhelming response! We're processing store requests as fast as we can — submit yours today to secure your spot.</span>
            </div>
          </div>
        </section>

        {/* Logo below the tape */}
        <div className="container mx-auto px-4 pt-4">
          <div className="max-w-7xl mx-auto flex items-center">
            <SiteLogo />
          </div>
        </div>

        {/* Hero Section (server-rendered) */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent leading-[1.06] md:leading-[1.06] pb-1 overflow-visible">
                Free Team Stores That Earn Free Swag
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                We build and manage professional storefronts for Canadian teams, clubs, schools, and groups. Every supporter purchase earns your team SwagBucks toward free merchandise — plus special member pricing for actual teams.
              </p>

              {/* Interactive CTA is loaded on the client for state and dialog */}
              <div className="mb-8">
                <HomeClient />
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg">
                  <Gift className="h-5 w-5" />
                  <span className="font-semibold">SwagBucks Rewards</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-purple-50 text-purple-800 px-4 py-3 rounded-lg">
                  <span className="font-semibold">Custom Subdomain</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-green-50 text-green-800 px-4 py-3 rounded-lg">
                  <span className="font-semibold">Professional Design</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Simple: we create your storefront, your supporters shop, and your team earns SwagBucks to redeem for free gear.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Store className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Step 1</span>
                  </div>
                  <CardTitle className="text-xl mb-3">We Build Your Store</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">SwagStore designs and maintains your professional branded storefront — no management needed from your team.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Store className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Step 2</span>
                  </div>
                  <CardTitle className="text-xl mb-3">Supporters Shop & You Earn</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">Parents, family, and fans purchase from your store. Every order earns your team SwagBucks automatically.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Gift className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">Step 3</span>
                  </div>
                  <CardTitle className="text-xl mb-3">Redeem for Free Swag</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">Track progress with your milestone meter and use SwagBucks for free team merchandise.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-primary/5 rounded-lg p-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <blockquote className="text-lg italic text-center mb-4">"Our school hockey team earned hundreds in free swag. Families love shopping and we love the free gear!"</blockquote>
              <cite className="text-sm text-muted-foreground">- Coach, Winnipeg MB</cite>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
