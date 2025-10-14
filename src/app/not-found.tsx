import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Store className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. 
            Let's get you back to creating amazing team stores!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="text-lg px-8 py-6">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
