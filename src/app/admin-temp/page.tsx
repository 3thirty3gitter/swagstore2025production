import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, Gift, Users, ShoppingCart, Package } from 'lucide-react';

export default function AdminTemp() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <Store className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">SwagStore Admin Portal</h1>
          <p className="text-muted-foreground">Canadian Edition 🍁</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/dashboard" className="block">
            <div className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary text-primary-foreground p-2 rounded">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Dashboard</h3>
              </div>
              <p className="text-sm text-muted-foreground">Overview and analytics</p>
            </div>
          </Link>

          <Link href="/admin/swagbucks" className="block">
            <div className="border rounded-lg p-6 hover:bg-muted/50 transition-colors bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-600 text-white p-2 rounded">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">SwagBucks Management ✨</h3>
              </div>
              <p className="text-sm text-muted-foreground">NEW: Manage CAD rewards system</p>
            </div>
          </Link>

          <Link href="/admin/tenants" className="block">
            <div className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-600 text-white p-2 rounded">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Team Management</h3>
              </div>
              <p className="text-sm text-muted-foreground">Manage Canadian teams & stores</p>
            </div>
          </Link>

          <Link href="/admin/orders" className="block">
            <div className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-600 text-white p-2 rounded">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Orders</h3>
              </div>
              <p className="text-sm text-muted-foreground">View and manage orders</p>
            </div>
          </Link>

          <Link href="/admin/products" className="block">
            <div className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-600 text-white p-2 rounded">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Products</h3>
              </div>
              <p className="text-sm text-muted-foreground">Manage product catalog</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
