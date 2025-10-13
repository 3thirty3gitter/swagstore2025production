'use client';

import { useFirebase } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import { getTenantBalance } from "@/lib/services/swagbucks-service";
import type { Order, SwagBucksGate } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Loader2, Award, Shirt, MapleLeaf, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCAD } from "@/lib/canadaData";
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
    
    // Get orders for calculating total sales (for display purposes)
    const ordersQuery = firestore ? query(collection(firestore, 'orders'), where('tenantId', '==', tenantId)) : null;
    const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersQuery);

    // Load real SwagBucks balance
    useEffect(() => {
        async function loadBalance() {
            if (!firestore) return;
            
            try {
                const balance = await getTenantBalance(firestore, tenantId);
                setTenantBalance(balance);
            } catch (error) {
                console.error('Error loading tenant balance:', error);
            } finally {
                setLoadingBalance(false);
            }
        }

        loadBalance();
    }, [firestore, tenantId]);

    if (ordersLoading || loadingBalance) {
        return (
            <section className="py-8 md:py-12 bg-gradient-to-br from-red-50 to-white border border-red-100">
                <div className="container mx-auto text-center">
                    <div className="flex items-center justify-center gap-2">
                        <MapleLeaf className="h-6 w-6 text-red-500 animate-pulse" />
                        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                        <MapleLeaf className="h-6 w-6 text-red-500 animate-pulse" />
                    </div>
                    <p className="mt-2 text-sm text-red-600">Loading Canadian SwagBucks...</p>
                </div>
            </section>
        )
    }
    
    // Use REAL SwagBucks balance (not calculated from orders)
    const totalSwagBucks = tenantBalance?.balance || 0;
    const totalRevenue = orders?.reduce((acc, order) => acc + order.total, 0) || 0;
    const totalEarned = tenantBalance?.totalEarned || 0;
    const totalRedeemed = tenantBalance?.totalRedeemed || 0;
    
    const sortedGates = [...gates].sort((a, b) => a.target - b.target);
    const maxTarget = sortedGates.length > 0 ? Math.max(...sortedGates.map(g => g.target)) : 5000;
    const progressPercentage = maxTarget > 0 ? (totalSwagBucks / maxTarget) * 100 : 0;
    
    return (
        <section className="py-8 md:py-12 bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl shadow-xl">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <MapleLeaf className="h-8 w-8 text-red-500" />
                        <h2 className="text-4xl md:text-5xl font-bold font-headline uppercase text-red-800">{title}</h2>
                        <MapleLeaf className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">{description}</p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            Total Sales: {formatCAD(totalRevenue)}
                        </span>
                        <span>•</span>
                        <span>Total Earned: {totalEarned} SB</span>
                        <span>•</span>
                        <span>Total Redeemed: {totalRedeemed} SB</span>
                        <span>•</span>
                        <span>Earning Rate: 10% 🍁</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-32 h-32 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                        <span className="text-3xl font-bold">{totalSwagBucks}</span>
                        <span className="text-sm font-medium">SwagBucks</span>
                        <span className="text-xs opacity-90">{formatCAD(totalSwagBucks)} available</span>
                    </div>

                    {gates.length > 0 && (
                        <div className="w-full px-12">
                            <div className="relative pt-16 pb-12">
                                <Progress 
                                    value={Math.min(progressPercentage, 100)} 
                                    className="h-8 rounded-full bg-red-100" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-red-700 bg-white px-2 py-1 rounded-full shadow">
                                        {Math.round(progressPercentage)}% to next milestone
                                    </span>
                                </div>
                                
                                {sortedGates.map(gate => {
                                    const gatePosition = Math.min((gate.target / maxTarget) * 100, 100);
                                    const isAchieved = totalSwagBucks >= gate.target;
                                    return (
                                        <div key={gate.id} className="absolute top-1/2" style={{ left: `${gatePosition}%`, transform: 'translateY(-50%)' }}>
                                            <div className={cn(
                                                "relative flex flex-col items-center -translate-x-1/2 transition-all duration-300",
                                                isAchieved ? 'text-green-600 scale-110' : 'text-red-400'
                                            )}>
                                                {/* Top Part - Goal */}
                                                <div className="absolute bottom-[calc(100%_+_2rem)] w-max text-center">
                                                    <div className={cn(
                                                        "p-2 rounded-lg border-2 bg-white shadow-md transition-all",
                                                        isAchieved ? 'border-green-500 bg-green-50' : 'border-red-300'
                                                    )}>
                                                        <Shirt className="h-6 w-6 mb-1 mx-auto transition-colors" />
                                                        <p className="text-xs font-semibold uppercase">{gate.name}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Bottom Part - Target */}
                                                <div className="absolute top-[calc(100%_+_2rem)] w-max text-center">
                                                    <div className={cn(
                                                        "p-2 rounded-lg border-2 bg-white shadow-md transition-all",
                                                        isAchieved ? 'border-green-500 bg-green-50' : 'border-red-300'
                                                    )}>
                                                        {isAchieved ? (
                                                            <Award className="h-6 w-6 mb-1 mx-auto text-green-600" />
                                                        ) : (
                                                            <Award className="h-6 w-6 mb-1 mx-auto" />
                                                        )}
                                                        <p className="text-xs font-bold">{gate.target} SB</p>
                                                        <p className="text-xs text-gray-600">{formatCAD(gate.target)}</p>
                                                        {isAchieved && (
                                                            <p className="text-xs text-green-600 font-bold">✓ UNLOCKED!</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    
                    <div className="text-center text-sm text-gray-600 max-w-lg">
                        <p className="mb-2">
                            <strong>Live Balance:</strong> {totalSwagBucks} SwagBucks available for redemption
                        </p>
                        <p className="mb-2">
                            <strong>How it works:</strong> Earn 10 SwagBucks for every $100 CAD in team sales
                        </p>
                        <p>
                            SwagBucks can be redeemed for team equipment, tournament fees, or special gear!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
