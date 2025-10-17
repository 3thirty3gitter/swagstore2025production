import Footer from '@/components/Footer';
import SiteLogo from '@/components/ui/SiteLogo';
import { ArrowRight, Store, Gift, Star, Zap, TrendingUp, Users, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HomeClient from '@/components/HomeClient';
import Image from 'next/image';
import { AnimatedHero } from '@/components/animations/AnimatedHero';
import { AnimatedNumber } from '@/components/animations/AnimatedNumber';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { FloatingCard } from '@/components/animations/FloatingCard';
import { StaggeredCards } from '@/components/animations/StaggeredCards';
import { PulseIcon } from '@/components/animations/PulseIcon';

// This is a server-rendered homepage. Interactive pieces (dialog, forms, state) are
// delegated to the client component `HomeClient` so the root route can be safely
// prerendered at build time on Vercel.
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section - Completely Redesigned */}
        <section className="relative py-3 md:py-20 overflow-hidden">
          {/* High Demand Notice */}
          <div className="absolute top-0 left-0 right-0 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white overflow-hidden z-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="flex items-center justify-center gap-2 text-sm md:text-base font-semibold animate-pulse">
                <Sparkles className="h-5 w-5" />
                <span>🔥 Overwhelming response! Limited spots available — Secure your team's store today</span>
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Logo - positioned at top with high z-index */}
          <div className="absolute top-16 left-0 right-0 z-30">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto flex items-center">
                <SiteLogo />
              </div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          
          <div className="container mx-auto px-4 relative z-10 pt-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Column - Text Content */}
              <AnimatedHero>
                <div className="text-left space-y-6">
                  <div className="inline-block hero-badge">
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold shadow-lg">
                      #1 Platform for Canadian Teams
                    </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-black font-headline leading-tight hero-title">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                      Build Your Team's
                    </span>
                    <br />
                    <span className="text-gray-900">
                      Dream Store
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium hero-subtitle">
                    Free professional storefronts + SwagBucks rewards on every purchase. Your team earns free gear while supporters get awesome merch!
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 py-6 hero-stats">
                    <div className="text-center">
                      <AnimatedNumber value={100} suffix="%" className="text-3xl font-black text-purple-600" />
                      <div className="text-sm text-gray-600 font-semibold">Free Setup</div>
                    </div>
                    <div className="text-center">
                      <AnimatedNumber value={24} suffix="hr" className="text-3xl font-black text-pink-600" />
                      <div className="text-sm text-gray-600 font-semibold">Launch Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-orange-600">♾️</div>
                      <div className="text-sm text-gray-600 font-semibold">Earning Potential</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 hero-cta">
                    <HomeClient />
                    <a 
                      href="#how-it-works" 
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      See How It Works
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-4 pt-6 items-center">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600 font-medium">No upfront costs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600 font-medium">Canadian-owned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600 font-medium">Secure payments</span>
                    </div>
                  </div>
                </div>
              </AnimatedHero>

              {/* Right Column - Hero Image/Visual */}
              <FloatingCard delay={600}>
                <div className="relative lg:block">
                  <div className="relative aspect-square max-w-xl mx-auto">
                    {/* Main Image Container */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl rotate-6 opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
                      {/* Mockup of a team store */}
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Mockup Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg"></div>
                            <div className="text-white font-bold">Panthers Hockey</div>
                          </div>
                          <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        
                        {/* Mockup Content */}
                        <div className="p-6 space-y-4">
                          <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                            <div className="text-center text-white">
                              <PulseIcon>
                                <Sparkles className="h-16 w-16 mx-auto mb-2" />
                              </PulseIcon>
                              <div className="text-2xl font-bold">Your Team Store</div>
                              <div className="text-sm opacity-90">Professional & Beautiful</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="h-24 bg-gray-100 rounded-lg"></div>
                            <div className="h-24 bg-gray-100 rounded-lg"></div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-semibold text-orange-800">SwagBucks Earned</div>
                                <div className="text-2xl font-black text-orange-600">$247</div>
                              </div>
                              <TrendingUp className="h-8 w-8 text-orange-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </section>

        {/* How It Works - Redesigned */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold inline-block mb-4">
                  Simple & Powerful
                </span>
                <h2 className="text-4xl md:text-5xl font-black font-headline mb-4 text-gray-900">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Three simple steps to launch your team's revenue-generating store
                </p>
              </div>
            </ScrollReveal>

            <StaggeredCards staggerDelay={200}>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-16">
                {/* Step 1 */}
                <div className="relative group stagger-item">
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-transparent hover:border-purple-200 transform hover:-translate-y-2 overflow-visible">
                    {/* Number Badge */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <span className="text-2xl font-black text-white">1</span>
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className="pt-12 pb-6 px-6 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500">
                        <Store className="h-12 w-12 text-purple-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">We Build Your Store</h3>
                      <p className="text-gray-600 leading-relaxed font-medium mb-4">
                        Fill out a quick form and we'll create your custom-branded storefront with your team colors, logo, and products.
                      </p>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-semibold">
                        <Zap className="h-4 w-4" />
                        <span>Live in 24 hours</span>
                      </div>
                    </div>
                    
                    {/* Bottom Accent */}
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-b-3xl"></div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative group stagger-item">
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-transparent hover:border-pink-200 transform hover:-translate-y-2 overflow-visible">
                    {/* Number Badge */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <span className="text-2xl font-black text-white">2</span>
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className="pt-12 pb-6 px-6 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500">
                        <Users className="h-12 w-12 text-pink-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">Share & Earn</h3>
                      <p className="text-gray-600 leading-relaxed font-medium mb-4">
                        Parents, family, and fans shop your store. Every purchase automatically earns SwagBucks for your team.
                      </p>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-pink-600 font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        <span>Automatic tracking</span>
                      </div>
                    </div>
                    
                    {/* Bottom Accent */}
                    <div className="h-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-b-3xl"></div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative group stagger-item">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-transparent hover:border-orange-200 transform hover:-translate-y-2 overflow-visible">
                  {/* Number Badge */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <span className="text-2xl font-black text-white">3</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="pt-12 pb-6 px-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500">
                      <Gift className="h-12 w-12 text-orange-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Get Free Gear</h3>
                    <p className="text-gray-600 leading-relaxed font-medium mb-4">
                      Watch your milestone meter fill up and redeem SwagBucks for team equipment, jerseys, and more!
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-orange-600 font-semibold">
                      <Sparkles className="h-4 w-4" />
                      <span>Unlimited potential</span>
                    </div>
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-b-3xl"></div>
                </div>
              </div>
            </div>
            </StaggeredCards>
            
            {/* CTA Below Steps */}
            <ScrollReveal direction="up" delay={400}>
              <div className="text-center mt-16">
                <p className="text-gray-600 mb-6 text-lg font-medium">Ready to get started?</p>
                <HomeClient />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Section - NEW */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold inline-block mb-4">
                Everything Included
              </span>
              <h2 className="text-4xl md:text-5xl font-black font-headline mb-4 text-gray-900">
                Why Teams Love SwagStore
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Custom Subdomain</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Get your own yourteam.swagstore.ca URL</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Premium Products</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Quality apparel and team gear your supporters will love</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Zero Maintenance</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We handle everything - you just share and earn</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Real-Time Tracking</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Watch your SwagBucks grow right on your storefront website</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section - Redesigned */}
        <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* CTA Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-100">
                <h2 className="text-4xl md:text-5xl font-black font-headline mb-6 text-gray-900">
                  Ready to Launch Your Team Store?
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                  Join hundreds of Canadian teams already earning free gear. Setup takes 5 minutes, launch happens in 24 hours.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <HomeClient />
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>No credit card needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>24-hour setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
