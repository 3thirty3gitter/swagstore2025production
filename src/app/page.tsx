'use client';

import { LoginForm } from "@/components/auth/login-form";
import { Loader2, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/firebase/auth/use-user";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <Loader2 className="w-8 h-8 animate-spin" />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-foreground">SwagStore</h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
