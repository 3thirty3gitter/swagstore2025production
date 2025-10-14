'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Shield } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/dashboard';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setIsCheckingAuth(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.email);
      
      if (user) {
        try {
          // Check if user is admin
          if (firestore) {
            const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
            if (adminDoc.exists()) {
              console.log('User is admin');
              setUser(user);
              setIsAuthenticated(true);
            } else {
              console.log('User is not admin');
              setIsAuthenticated(false);
              await auth.signOut();
            }
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No user signed in');
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Unable to connect to authentication service.',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to sign in with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential.user.email);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(firestore, 'admins', userCredential.user.uid));
      
      if (adminDoc.exists()) {
        console.log('Admin verification successful');
        setIsAuthenticated(true);
        setUser(userCredential.user);
        toast({
          title: 'Login Successful',
          description: 'Welcome to the SwagStore admin dashboard.',
        });
      } else {
        console.log('User is not an admin');
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>SwagStore Admin</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
