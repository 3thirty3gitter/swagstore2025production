import { Button } from "@/components/ui/button";
import { Store, Package, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-primary/10 to-background">
        <Store className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-5xl font-bold font-headline text-center mb-4">
          SwagStore
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mb-8">
          Your complete e-commerce solution for custom merchandise and branded products
        </p>
        <div className="flex gap-4">
          <Link href="/admin/login">
            <Button size="lg">Admin Login</Button>
          </Link>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Product Management</h3>
              <p className="text-muted-foreground">Easy-to-use product catalog with inventory tracking</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Multi-Tenant</h3>
              <p className="text-muted-foreground">Manage multiple stores from one platform</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">Track sales and performance in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t mt-auto">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SwagStore. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
