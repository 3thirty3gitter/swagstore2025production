'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Store, 
  Shield, 
  Zap, 
  Globe, 
  DollarSign, 
  Clock, 
  Award, 
  Users, 
  Palette,
  Star,
  CheckCircle,
  TrendingUp,
  Gift
} from 'lucide-react';
import StoreRequestForm from '@/components/StoreRequestForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
              🍁 Canadian
            </Badge>
          </div>
        </div>
      </header>

      {/* Demand Notice */}
      <section className="py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
            <Zap className="h-4 w-4" />
            <span>🔥 High Demand Alert: Due to overwhelming response, we're processing requests as fast as possible!</span>
            <Zap className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Free Custom Team Stores for Canadian Organizations
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              We create professional branded storefronts for your hockey teams, dance clubs, bands, and organizations. 
              <strong className="text-foreground"> Completely FREE setup</strong> with custom subdomains and SwagBucks rewards system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowForm(true)}
              >
                Get Your FREE Store
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure • Canadian-hosted • Professional</span>
              </div>
            </div>
            
            {/* Key Benefits Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 bg-green-50 text-green-800 px-4 py-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">100% FREE Setup</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg">
                <Gift className="h-5 w-5" />
                <span className="font-semibold">SwagBucks Rewards</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-purple-50 text-purple-800 px-4 py-3 rounded-lg">
                <Globe className="h-5 w-5" />
                <span className="font-semibold">Custom Subdomain</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
              Everything Your Team Needs - Completely FREE
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional e-commerce features designed specifically for Canadian teams and organizations. 
              No setup fees, no monthly costs, no hidden charges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>100% FREE Setup & Hosting</CardTitle>
                <CardDescription>
                  No setup fees, no monthly costs, no hidden charges. Your professional team store is completely free to create and maintain.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Custom Subdomains</CardTitle>
                <CardDescription>
                  yourteam.swagstore.ca - Professional branded URLs that match your organization's identity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Gift className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>SwagBucks Rewards System</CardTitle>
                <CardDescription>
                  Built-in loyalty program that rewards team members and supporters with points for every purchase
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-8 w-8 text-orange-500 mb-2" />
                <CardTitle>24-Hour Setup</CardTitle>
                <CardDescription>
                  Your professional team store will be live and ready for orders within 24 hours of submitting your request
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Palette className="h-8 w-8 text-pink-500 mb-2" />
                <CardTitle>Professional Design</CardTitle>
                <CardDescription>
                  Beautiful, mobile-responsive designs that showcase your team's brand and merchandise professionally
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Fundraising Tools</CardTitle>
                <CardDescription>
                  Built-in milestone tracking and team fundraising features to help you reach your goals faster
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Store className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Easy product management with photos, variants, pricing, and real-time inventory tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with Canadian data hosting, SSL encryption, and PCI compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-indigo-500 mb-2" />
                <CardTitle>Multi-Team Management</CardTitle>
                <CardDescription>
                  Perfect for organizations managing multiple teams or divisions from a single platform
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
            Perfect for Canadian Teams & Organizations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏒</span>
              </div>
              <h3 className="font-semibold mb-2">Hockey Teams</h3>
              <p className="text-sm text-muted-foreground">Jerseys, equipment, team gear, and custom merchandise for all skill levels</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💃</span>
              </div>
              <h3 className="font-semibold mb-2">Dance Studios</h3>
              <p className="text-sm text-muted-foreground">Costumes, accessories, studio apparel, and competition gear</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="font-semibold mb-2">Music Groups</h3>
              <p className="text-sm text-muted-foreground">Band merchandise, instruments, accessories, and promotional items</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="font-semibold mb-2">Organizations</h3>
              <p className="text-sm text-muted-foreground">Corporate merchandise, branded items, and promotional products</p>
            </div>
          </div>

          {/* Testimonial-style section */}
          <div className="bg-primary/5 rounded-lg p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
            <blockquote className="text-lg italic text-center mb-4">
              "SwagStore made it so easy for our hockey team to sell merchandise. The SwagBucks rewards system 
              keeps our players engaged, and the free setup saved us hundreds of dollars!"
            </blockquote>
            <cite className="text-sm text-muted-foreground">- Hockey Team Manager, Toronto, ON</cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Ready for Your FREE Custom Team Store?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of Canadian teams already using SwagStore to manage their merchandise, 
            engage their communities, and raise funds for their goals.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6"
            onClick={() => setShowForm(true)}
          >
            Get Started - It's FREE
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm mt-4 opacity-75">No credit card required • Setup in 24 hours • 100% Canadian</p>
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
              <span>•</span>
              <span>Custom Team Stores</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Store Request Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <StoreRequestForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
