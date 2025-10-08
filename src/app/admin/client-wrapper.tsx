'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export function AdminLayoutClientWrapper({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();

    useEffect(() => {
        const handlePermissionError = (error: FirestorePermissionError) => {
            console.error("Firestore Permission Error:", error);
            toast({
                variant: 'destructive',
                title: 'Permission Denied',
                description: `You don't have permission to ${error.operation} documents in the '${error.path}' collection. Please check your Firestore security rules.`,
                duration: 10000,
            });
        };

        errorEmitter.on('permission-error', handlePermissionError);

        return () => {
            errorEmitter.off('permission-error', handlePermissionError);
        };
    }, [toast]);

    return <div className="h-full">{children}</div>;
}