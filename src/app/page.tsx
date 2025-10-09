import { Button } from "@/components/ui/button";
import { Store, Gift, Users, TrendingUp, Shirt, DollarSign, Award } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-primary/10 to-background">
        <Store className="w-20 h-20 text-primary mb-6" />
        <h1 className="text-6xl font-bold font-headline text-center mb-4">
          SwagStore
        </h1>
        <p className="text-2xl text-center max-w-3xl mb-2">
          Free Custom Merch Store for Your Team, Club, or Group
        </p>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mb-8">
          Sell branded merchandise and earn SwagBucks for free gear
        </p>
        <div className="flex gap-4">
          <Link href="#how-it-works">
            <Button size="lg" className="text-lg px-8">Get Started Free</Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" size="lg" className="text-lg px-8">Team Login</Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Three simple steps to start earning</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <Store className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Get Your Free Store</h3>
              <p className="text-muted-foreground">Set up your custom merch store in minutes. Choose from our product catalog and add your team's branding.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <Shirt className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Share & Sell</h3>
              <p className="text-muted-foreground">Share your unique store link with supporters, parents, and fans. They shop, you earn.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Earn SwagBucks</h3>
              <p className="text-muted-foreground">Every sale earns SwagBucks. Redeem them for free gear, equipment, or merchandise for your team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Teams Love SwagStore</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6">
              <DollarSign className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Free Setup</h3>
              <p className="text-muted-foreground">No upfront costs, no monthly fees. Get your store live today at zero cost.</p>
            </div>
            <div className="border rounded-lg p-6">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Perfect for Any Group</h3>
              <p className="text-muted-foreground">Sports teams, school clubs, non-profits, and community groups all thrive on SwagStore.</p>
            </div>
            <div className="border rounded-lg p-6">
              <Award className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality Merchandise</h3>
              <p className="text-muted-foreground">Premium products from trusted brands. Your supporters get great gear, you earn rewards.</p>
            </div>
            <div className="border rounded-lg p-6">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Track Your Earnings</h3>
              <p className="text-muted-foreground">Real-time dashboard shows sales, SwagBucks earned, and available rewards.</p>
            </div>
            <div className="border rounded-lg p-6">
              <Store className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Custom Branding</h3>
              <p className="text-muted-foreground">Add your logo, colors, and team identity. Make it uniquely yours.</p>
            </div>
            <div className="border rounded-lg p-6">
              <Gift className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Flexible Rewards</h3>
              <p className="text-muted-foreground">Redeem SwagBucks for equipment, team gear, or donate to your organization's fund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 opacity-90">Join hundreds of teams already raising funds through SwagStore</p>
          <Link href="#how-it-works">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Launch Your Free Store
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SwagStore. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/admin/login" className="hover:text-foreground">Team Login</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
            <Link href="#" className="hover:text-foreground">FAQ</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
