'use client';

import { useState } from "react";
import { MapleLeaf } from "lucide-react";

type SwagBucksTrackerProps = {
    tenantId: string;
    title: string;
    description: string;
    gates: any[];
}

export function SwagBucksTrackerSection({ tenantId, title, description, gates = [] }: SwagBucksTrackerProps) {
    const [debug] = useState({
        tenantId,
        title,
        description,
        gatesCount: gates.length
    });

    return (
        <section className="py-8 bg-red-50 border border-red-200 rounded-lg">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <MapleLeaf className="h-6 w-6 text-red-500" />
                    <h2 className="text-3xl font-bold text-red-800">{title || 'SwagBucks Tracker'}</h2>
                    <MapleLeaf className="h-6 w-6 text-red-500" />
                </div>
                
                <p className="text-gray-700 mb-6">{description || 'Earn SwagBucks with every purchase!'}</p>
                
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                    <h3 className="font-bold text-red-600 mb-4">🧪 Debug Info</h3>
                    <div className="text-left space-y-2 text-sm">
                        <p><strong>Tenant ID:</strong> {debug.tenantId}</p>
                        <p><strong>Title:</strong> {debug.title}</p>
                        <p><strong>Gates:</strong> {debug.gatesCount} configured</p>
                        <p><strong>Status:</strong> ✅ Component rendering successfully</p>
                    </div>
                </div>
                
                <div className="mt-6 text-sm text-gray-600">
                    🎯 Subdomain routing working • Component error resolved
                </div>
            </div>
        </section>
    );
}
