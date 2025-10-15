'use client';

import { useState } from "react";

type SwagBucksTrackerProps = {
    tenantId: string;
    title?: string;
    description?: string;
    gates?: any[];
}

export function SwagBucksTrackerSection({ tenantId, title, description, gates = [] }: SwagBucksTrackerProps) {
    const debugInfo = {
        tenantId,
        title: title || 'Default SwagBucks Title',
        description: description || 'Default SwagBucks Description',
        gatesCount: gates.length,
        timestamp: new Date().toLocaleString()
    };

    return (
        <section className="py-8 bg-red-50 border border-red-200 rounded-lg">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="h-6 w-6 text-red-500 text-xl">🍁</span>
                    <h2 className="text-3xl font-bold text-red-800">{debugInfo.title}</h2>
                    <span className="h-6 w-6 text-red-500 text-xl">🍁</span>
                </div>
                
                <p className="text-gray-700 mb-6">{debugInfo.description}</p>
                
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                    <h3 className="font-bold text-red-600 mb-4">🧪 Subdomain Debug Info</h3>
                    <div className="text-left space-y-2 text-sm">
                        <p><strong>Tenant ID:</strong> {debugInfo.tenantId}</p>
                        <p><strong>Title:</strong> {debugInfo.title}</p>
                        <p><strong>Gates:</strong> {debugInfo.gatesCount} configured</p>
                        <p><strong>Time:</strong> {debugInfo.timestamp}</p>
                        <p><strong>Status:</strong> ✅ Subdomain routing working!</p>
                    </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 font-semibold">🎯 Subdomain System Status</p>
                    <p className="text-green-700 text-sm">Component rendering successfully via subdomain routing</p>
                    <p className="text-green-600 text-xs mt-1">
                        URL: {typeof window !== 'undefined' ? window.location.href : 'server-side'}
                    </p>
                </div>
            </div>
        </section>
    );
}
