'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, LogIn } from 'lucide-react';
import { firebaseApp } from '@/firebase/config';

export default function LoginAdmin() {
  const [email, setEmail] = useState('trent@3thrity3.ca');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getAuth(firebaseApp);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Store className="w-16 h-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold">SwagStore Admin</h1>
          <p className="text-muted-foreground">Platform Administrator Login 🍁</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="trent@3thrity3.ca"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your admin password"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Signing In...' : 'Access Admin Platform'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Platform Administrator Access Only</p>
              <p>Teams use their custom store URLs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
