"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import StoreRequestForm from '@/components/StoreRequestForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function HomeClient() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button 
        size="lg" 
        className="text-lg px-8 py-6"
        onClick={() => setShowForm(true)}
      >
        Request your storefront today!
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Secure • Canadian-hosted • Professional</span>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Request Your Free SwagStore</DialogTitle>
            <DialogDescription>
              Fill out this form to request a custom merchandise store for your team or organization.
            </DialogDescription>
          </DialogHeader>
          <StoreRequestForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
