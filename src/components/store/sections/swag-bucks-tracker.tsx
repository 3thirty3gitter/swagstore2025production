

'use client';

import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirebase } from "@/firebase";
import type { Order, SwagBucksGate } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Loader2, Award, Shirt } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type SwagBucksTrackerProps = {
    tenantId: string;
    title: string;
    description: string;
    gates: SwagBucksGate[];
}

export function SwagBucksTrackerSection({ tenantId, title, description, gates = [] }: SwagBucksTrackerProps) {
    const { firestore } = useFirebase();
    
    const ordersQuery = firestore ? query(collection(firestore, 'orders'), where('tenantId', '==', tenantId)) : null;
    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    if (isLoading) {
        return (
            <section className="py-8 md:py-12 bg-card">
                <div className="container mx-auto text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
            </section>
        )
    }
    
    const totalPoints = orders?.reduce((acc, order) => acc + order.total, 0) || 0;
    const sortedGates = [...gates].sort((a, b) => a.target - b.target);
    const maxTarget = 5000;
    const progressPercentage = maxTarget > 0 ? (totalPoints / maxTarget) * 100 : 0;
    
    return (
        <section className="py-8 md:py-12 bg-card text-card-foreground rounded-2xl shadow-2xl border border-white/10">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4 uppercase">{title}</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-24 h-24 flex flex-col items-center justify-center rounded-full border-4 border-muted">
                        <span className="text-3xl font-bold">{Math.round(totalPoints)}</span>
                        <span className="text-sm font-medium text-muted-foreground">PTS</span>
                    </div>

                    <div className="w-full px-12">
                        <div className="relative pt-16 pb-12">
                            <Progress value={progressPercentage} className="h-6 rounded-full" />
                            {sortedGates.map(gate => {
                                const gatePosition = (gate.target / maxTarget) * 100;
                                const isAchieved = totalPoints >= gate.target;
                                return (
                                    <div key={gate.id} className="absolute top-1/2" style={{ left: `${gatePosition}%`, transform: 'translateY(-50%)' }}>
                                        <div className={cn("relative flex flex-col items-center -translate-x-1/2", isAchieved ? 'text-primary' : 'text-muted-foreground')}>
                                            {/* Top Part */}
                                            <div className="absolute bottom-[calc(100%_+_1.5rem)] w-max text-center">
                                                <Shirt className="h-6 w-6 mb-1 mx-auto transition-colors" />
                                                <p className="text-sm font-semibold transition-colors uppercase">{gate.name}</p>
                                            </div>
                                            
                                            {/* Bottom Part */}
                                            <div className="absolute top-[calc(100%_+_1.25rem)] w-max text-center">
                                                <Award className="h-6 w-6 mb-1 mx-auto transition-colors" />
                                                <p className="text-sm font-bold transition-colors">{gate.target} PTS</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
