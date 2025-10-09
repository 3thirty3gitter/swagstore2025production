"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '@/firebase/config';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      <LogIn className="mr-2 h-4 w-4" />
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

export function LoginForm() {
  const { toast } = useToast();
  const [state, action] = useActionState(login, { success: false, error: undefined });
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.email && state?.password) {
      const auth = getAuth(firebaseApp);
      signInWithEmailAndPassword(auth, state.email, state.password)
        .then(() => {
          toast({ title: 'Login Successful', description: "Redirecting to dashboard..."});
          router.push('/admin/dashboard');
        })
        .catch((error) => {
          toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
        });
    }
  }, [state, router, toast]);

  return (
    <form action={action}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              defaultValue="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required defaultValue="password" />
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
