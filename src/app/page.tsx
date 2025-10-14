import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Store, Globe, Palette, CreditCard, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">SwagStore</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              🍁 Canadian
            </Badge>
          </div>
          
          {/* Admin Login Only */}
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Custom Team Stores for Canadian Organizations
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Create professional branded storefronts for your hockey teams, dance clubs, bands, and organizations. Complete with custom subdomains and SwagBucks rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/admin">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure • Canadian-hosted • Professional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
              Everything Your Team Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional e-commerce features designed specifically for Canadian teams and organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Custom Subdomains</CardTitle>
                <CardDescription>
                  yourteam.swagstore.ca - Professional branded URLs for your organization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Palette className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Website Editor</CardTitle>
                <CardDescription>
                  Drag-and-drop website builder with professional templates and layouts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-primary mb-2" />
                <CardTitle>SwagBucks Rewards</CardTitle>
                <CardDescription>
                  Built-in loyalty program to reward your team members and supporters
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Store className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Easy inventory management with photos, variants, and pricing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with Canadian data hosting and privacy compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multi-Tenant Platform</CardTitle>
                <CardDescription>
                  Manage multiple team stores from a single admin dashboard
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">
            Perfect for Canadian Teams
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏒</span>
              </div>
              <h3 className="font-semibold mb-2">Hockey Teams</h3>
              <p className="text-sm text-muted-foreground">Jerseys, equipment, and team merchandise</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💃</span>
              </div>
              <h3 className="font-semibold mb-2">Dance Studios</h3>
              <p className="text-sm text-muted-foreground">Costumes, accessories, and studio apparel</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="font-semibold mb-2">Music Groups</h3>
              <p className="text-sm text-muted-foreground">Band merchandise, instruments, and accessories</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="font-semibold mb-2">Organizations</h3>
              <p className="text-sm text-muted-foreground">Corporate merchandise and branded items</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Ready to Launch Your Team Store?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join Canadian teams already using SwagStore to manage their merchandise and engage their communities
          </p>
          <Link href="/admin">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Building Your Store
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
              <span>🍁 Made in Canada</span>
              <span>•</span>
              <span>© 2025 SwagStore</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
