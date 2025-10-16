'use client';

import Footer from '@/components/Footer';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Store, 
  Shield, 
  Globe, 
  Gift,
  Star,
  CheckCircle,
  Zap,
  ShoppingBag
} from 'lucide-react';
import StoreRequestForm from '@/components/StoreRequestForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* Header removed — layout provides the site header and logo */}

      {/* Main content */}
      <main className="flex-1">
        {/* High Demand Notice */}
        <section className="py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
              <Zap className="h-4 w-4" />
              <span>🔥 Overwhelming response! We're processing store requests as fast as we can — submit yours today to secure your spot.</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent leading-[1.06] md:leading-[1.06] pb-1 overflow-visible">
                Free Team Stores That Earn Free Swag
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                We build and manage professional storefronts for Canadian teams, clubs, schools, and groups. 
                Every supporter purchase earns your team SwagBucks toward free merchandise — plus special member pricing for actual teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setShowForm(true)}
                >
                  Request your storefront today!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure • Canadian-hosted • Professional</span>
                </div>
              </div>
              
              {/* Key Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg">
                  <Gift className="h-5 w-5" />
                  <span className="font-semibold">SwagBucks Rewards</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-purple-50 text-purple-800 px-4 py-3 rounded-lg">
                  <Globe className="h-5 w-5" />
                  <span className="font-semibold">Custom Subdomain</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-green-50 text-green-800 px-4 py-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Professional Design</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced Visual Design */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Simple: we create your storefront, your supporters shop, and your team earns SwagBucks to redeem for free gear.
              </p>
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
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    SwagStore designs and maintains your professional branded storefront — no management needed from your team.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <ShoppingBag className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Step 2</span>
                  </div>
                  <CardTitle className="text-xl mb-3">Supporters Shop & You Earn</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    Parents, family, and fans purchase from your store. Every order earns your team SwagBucks automatically.
                  </CardDescription>
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
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    Track progress with your milestone meter and use SwagBucks for free team merchandise.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Progress Flow Indicator */}
            <div className="flex justify-center items-center mt-12 space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
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
              <blockquote className="text-lg italic text-center mb-4">
                "Our school hockey team earned hundreds in free swag. Families love shopping and we love the free gear!"
              </blockquote>
              <cite className="text-sm text-muted-foreground">- Coach, Winnipeg MB</cite>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Store Request Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Request Your Free SwagStore</DialogTitle>
            <DialogDescription>
              Fill out this form to request a custom merchandise store for your team or organization.
            </DialogDescription>
          </DialogHeader>
          <StoreRequestForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
