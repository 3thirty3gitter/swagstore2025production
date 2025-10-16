'use client';

import { useState, useEffect } from 'react';
import { StatCard } from "@/components/admin/stat-card";
import { Gift, TrendingUp, Users, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase";
import { doc, getDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useCollection } from "@/firebase/firestore/use-collection";
import { getAllBalances, getPendingRedemptions } from "@/lib/services/swagbucks-service";
import type { SwagBucksBalance } from "@/lib/swagbucks";

interface RedemptionRequest {
  id: string;
  tenantId: string;
  tenantName?: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
}

export default function SwagBucksAdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [balances, setBalances] = useState<SwagBucksBalance[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Get tenants data to match tenant names
  const { data: tenants } = useCollection(
    firestore ? collection(firestore, 'tenants') : null
  );

  // Verify admin status
  useEffect(() => {
    async function verifyPlatformAdmin() {
      if (userLoading) return;
      
      if (!user) {
        router.push('/login-admin');
        return;
      }

      if (!firestore) return;

      try {
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        setIsAdmin(adminDoc.exists() && adminDoc.data()?.role === 'admin');
      } catch (error) {
        console.error('Admin verification failed:', error);
        setIsAdmin(false);
      }
    }

    verifyPlatformAdmin();
  }, [user, userLoading, firestore, router]);

  // Load real SwagBucks data
  useEffect(() => {
    async function loadSwagBucksData() {
      if (!firestore || !isAdmin) return;

      try {
        setLoading(true);
        
        // Get all tenant balances
        const balanceData = await getAllBalances(firestore);
        setBalances(balanceData);

        // Get pending redemption requests
        const redemptionData = await getPendingRedemptions(firestore);
        setRedemptions(redemptionData);
        
      } catch (error) {
        console.error('Error loading SwagBucks data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSwagBucksData();
  }, [firestore, isAdmin]);

  // Show loading while checking authentication
  if (userLoading || isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Platform Admin Only</h1>
        <p className="text-gray-600">This area is restricted to the platform administrator.</p>
      </div>
    );
  }

  // Show loading for data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading SwagBucks data...</span>
      </div>
    );
  }

  // Calculate overview statistics from real data
  const totalSwagBucksInCirculation = balances.reduce((sum, balance) => sum + balance.balance, 0);
  const totalEarnedAllTime = balances.reduce((sum, balance) => sum + balance.totalEarned, 0);
  const totalRedeemedAllTime = balances.reduce((sum, balance) => sum + balance.totalRedeemed, 0);
  const pendingRequests = redemptions.filter(r => r.status === 'pending').length;

  // Helper function to get tenant name by ID
  const getTenantName = (tenantId: string) => {
    const tenant = tenants?.find(t => t.id === tenantId);
    return tenant?.name || `Team ${tenantId.slice(0, 8)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-red-800">SwagBucks Management</h1>
            <Gift className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600 mt-1">Real-time SwagBucks data • All values in CAD 🍁</p>
        </div>
        <div className="text-sm text-green-600 font-medium">
          ✅ Live Data Connected
        </div>
      </div>

      {/* Real-time Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active SwagBucks"
          value={totalSwagBucksInCirculation.toString()}
          icon={Gift}
          description={`$${totalSwagBucksInCirculation.toFixed(2)} CAD value in circulation`}
          className="border-red-200 bg-gradient-to-br from-red-50 to-white"
        />
        <StatCard
          title="Total Earned"
          value={totalEarnedAllTime.toString()}
          icon={TrendingUp}
          description={`$${totalEarnedAllTime.toFixed(2)} CAD earned by all teams`}
          className="border-green-200 bg-gradient-to-br from-green-50 to-white"
        />
        <StatCard
          title="Active Teams"
          value={balances.length.toString()}
          icon={Users}
          description="Canadian teams with SwagBucks balances"
          className="border-blue-200 bg-gradient-to-br from-blue-50 to-white"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={DollarSign}
          description="Redemption requests awaiting approval"
          className="border-orange-200 bg-gradient-to-br from-orange-50 to-white"
        />
      </div>

      {/* Real Team Balances */}
      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-red-500" />
          Live Canadian Team SwagBucks Balances
        </h2>
        
        {balances.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No SwagBucks balances yet</p>
            <p className="text-sm">Balances will appear when teams make their first sales</p>
          </div>
        ) : (
          <div className="space-y-4">
            {balances.map((balance) => (
              <div key={balance.tenantId} className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-semibold text-red-800">{getTenantName(balance.tenantId)}</h3>
                  <p className="text-sm text-red-600">
                    Earned: {balance.totalEarned} SB • Redeemed: {balance.totalRedeemed} SB
                  </p>
                  <p className="text-xs text-red-500">
                    Last updated: {balance.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-700">{balance.balance}</div>
                  <div className="text-sm text-red-600">
                    ${balance.balance.toFixed(2)} CAD value
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real Redemption Requests */}
      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-orange-500" />
          Live Redemption Requests
        </h2>
        
        {redemptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pending redemption requests</p>
            <p className="text-sm">Requests will appear when teams redeem SwagBucks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {redemptions.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-orange-50">
                <div>
                  <h3 className="font-semibold text-orange-800">{getTenantName(request.tenantId)}</h3>
                  <p className="text-sm text-orange-600">{request.description}</p>
                  <p className="text-xs text-orange-500">
                    Requested: {request.requestedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-orange-700">{request.amount} SwagBucks</div>
                    <div className="text-sm text-orange-600">
                      ${request.amount.toFixed(2)} CAD value
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm">
                    {request.status}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p className="flex items-center justify-center gap-2">
          <Gift className="w-4 h-4 text-red-500" />
          SwagStore Canada • Real-time SwagBucks tracking • 10% earning rate
          <Gift className="w-4 h-4 text-red-500" />
        </p>
      </div>
    </div>
  );
}
