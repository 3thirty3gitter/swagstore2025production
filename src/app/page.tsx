'use client';

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
  Palette,
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';
import StoreRequestForm from '@/components/StoreRequestForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">SwagStore</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              🍁 100% Canadian Owned & Operated
            </Badge>
          </div>
        </div>
      </header>

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
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
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

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Simple: we create your storefront, your supporters shop, and your team earns SwagBucks to redeem for free gear.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>1) We Build Your Store</CardTitle>
                <CardDescription>
                  SwagStore designs and maintains your professional branded storefront — no management needed from your team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>2) Supporters Shop & You Earn</CardTitle>
                <CardDescription>
                  Parents, family, and fans purchase from your store. Every order earns your team SwagBucks automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>3) Redeem for Free Swag</CardTitle>
                <CardDescription>
                  Track progress with your milestone meter and use SwagBucks for free team merchandise.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">Perfect for Canadian Teams & Organizations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🏒</span></div>
              <h3 className="font-semibold mb-2">Hockey Teams</h3>
              <p className="text-sm text-muted-foreground">Earn free equipment through supporter purchases</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">💃</span></div>
              <h3 className="font-semibold mb-2">Dance Studios</h3>
              <p className="text-sm text-muted-foreground">Turn sales into free costumes and accessories</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🎵</span></div>
              <h3 className="font-semibold mb-2">Music Groups</h3>
              <p className="text-sm text-muted-foreground">Earn free instruments and merchandise</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🏫</span></div>
              <h3 className="font-semibold mb-2">School Teams</h3>
              <p className="text-sm text-muted-foreground">Support school athletics with free team gear</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
            <blockquote className="text-lg italic text-center mb-4">
              "Our school hockey team earned hundreds in free equipment. Families love shopping and we love the free gear!"
            </blockquote>
            <cite className="text-sm text-muted-foreground">- Coach, Winnipeg MB</cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Ready to Start Earning Free Swag?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">Join Canadian teams using SwagStore to turn supporter purchases into SwagBucks and free merchandise.</p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => setShowForm(true)}>
            Request your storefront today!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
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
              <span>Custom Team Stores</span>
            </div>
          </div>
        </div>
      </footer>

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
