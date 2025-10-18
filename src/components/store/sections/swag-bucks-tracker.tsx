'use client';

import { useFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { getTenantBalance } from "@/lib/services/swagbucks-service";
import type { Order, SwagBucksGate } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Loader2, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { SwagBucksBalance } from "@/lib/swagbucks";

type SwagBucksTrackerProps = {
    tenantId: string;
    title: string;
    description: string;
    gates: SwagBucksGate[];
}

export function SwagBucksTrackerSection({ tenantId, title, description, gates = [] }: SwagBucksTrackerProps) {
    const { firestore } = useFirebase();
    const [tenantBalance, setTenantBalance] = useState<SwagBucksBalance | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get orders for calculating total sales (for display purposes)
    const ordersQuery = firestore ? query(collection(firestore, 'orders'), where('tenantId', '==', tenantId)) : null;
    const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersQuery);

    // Load real SwagBucks balance
    useEffect(() => {
        async function loadBalance() {
            if (!firestore) {
                // Wait a bit for firestore to initialize
                setTimeout(() => setLoadingBalance(false), 2000);
                return;
            }
            
            if (!tenantId) {
                setError('No tenant ID provided');
                setLoadingBalance(false);
                return;
            }
            
            try {
                const balance = await getTenantBalance(firestore, tenantId);
                setTenantBalance(balance);
                setError(null);
            } catch (error) {
                console.error('Error loading tenant balance:', error);
                setError('Failed to load SwagBucks balance');
                // Set default values so the component doesn't break
                setTenantBalance({
                    tenantId,
                    balance: 0,
                    totalEarned: 0,
                    totalRedeemed: 0,
                    lastUpdated: new Date()
                });
            } finally {
                setLoadingBalance(false);
            }
        }

        loadBalance();
    }, [firestore, tenantId]);

    // Show error state if there's a critical error
    if (error && !tenantBalance) {
        return (
            <section className="py-8 md:py-12 bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl">
                <div className="container mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 text-red-600">
                        <span className="h-6 w-6 text-2xl">🍁</span>
                        <p className="text-sm">{error}</p>
                        <span className="h-6 w-6 text-2xl">🍁</span>
                    </div>
                </div>
            </section>
        );
    }

    if (ordersLoading || loadingBalance) {
        return (
            <section className="py-8 md:py-12 bg-gradient-to-br from-red-50 to-white border border-red-100">
                <div className="container mx-auto text-center">
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-6 w-6 text-red-500 text-2xl">🍁</span>
                        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                        <span className="h-6 w-6 text-red-500 text-2xl">🍁</span>
                    </div>
                    <p className="mt-2 text-sm text-red-600">Loading Canadian SwagBucks...</p>
                </div>
            </section>
        )
    }
    
    // Use REAL SwagBucks balance (not calculated from orders)
    const totalSwagBucks = tenantBalance?.balance || 0;
    
    const sortedGates = [...gates].sort((a, b) => a.target - b.target);
    const nextGate = sortedGates.find(gate => totalSwagBucks < gate.target);
    const currentTarget = nextGate ? nextGate.target : (sortedGates[sortedGates.length - 1]?.target || 0);
    const progressPercentage = currentTarget > 0 ? Math.min((totalSwagBucks / currentTarget) * 100, 100) : 0;
    
    return (
        <section className="py-6 md:py-8 bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl shadow-lg">
            <div className="container mx-auto max-w-5xl px-4">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-red-500 text-xl">🍁</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline uppercase text-red-800">{title}</h2>
                        <span className="text-red-500 text-xl">🍁</span>
                    </div>
                    <p className="text-base text-gray-700 max-w-2xl mx-auto">{description}</p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                    {/* Progress Bar with SwagBucks Display */}
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-red-200 shadow-sm">
                                <span className="text-2xl font-bold text-red-600">{totalSwagBucks}</span>
                                <span className="text-sm font-medium text-gray-600">SwagBucks</span>
                            </div>
                            {nextGate && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Next Milestone</p>
                                    <p className="text-sm font-bold text-red-600">{nextGate.target} SB</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative h-12 bg-red-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 flex items-center justify-end pr-3"
                                style={{ width: `${progressPercentage}%` }}
                            >
                                {progressPercentage > 15 && (
                                    <span className="text-white text-xs font-bold">{Math.round(progressPercentage)}%</span>
                                )}
                            </div>
                            {progressPercentage <= 15 && progressPercentage > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-red-600 text-xs font-bold">{Math.round(progressPercentage)}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Milestones Grid */}
                    {gates.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            {sortedGates.map(gate => {
                                const isAchieved = totalSwagBucks >= gate.target;
                                const isCurrent = nextGate?.id === gate.id;
                                return (
                                    <div 
                                        key={gate.id} 
                                        className={cn(
                                            "relative p-3 rounded-lg border-2 transition-all duration-300",
                                            isAchieved 
                                                ? "bg-green-50 border-green-500 shadow-md" 
                                                : isCurrent
                                                ? "bg-white border-red-400 shadow-md animate-pulse"
                                                : "bg-white border-gray-200"
                                        )}
                                    >
                                        {isAchieved && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                <span className="text-xs font-bold">✓</span>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <Shirt className={cn(
                                                "h-8 w-8 mx-auto mb-1 transition-colors",
                                                isAchieved ? "text-green-600" : isCurrent ? "text-red-500" : "text-gray-400"
                                            )} />
                                            <p className={cn(
                                                "text-xs font-semibold uppercase mb-1",
                                                isAchieved ? "text-green-700" : isCurrent ? "text-red-600" : "text-gray-600"
                                            )}>
                                                {gate.name}
                                            </p>
                                            <p className={cn(
                                                "text-sm font-bold",
                                                isAchieved ? "text-green-600" : isCurrent ? "text-red-600" : "text-gray-500"
                                            )}>
                                                {gate.target} SB
                                            </p>
                                            {isAchieved && (
                                                <p className="text-xs text-green-600 font-bold mt-1">UNLOCKED!</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
