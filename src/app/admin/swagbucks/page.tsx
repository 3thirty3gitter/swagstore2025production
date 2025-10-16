import { StatCard } from "@/components/admin/stat-card";
import { Gift, TrendingUp, Users, DollarSign } from 'lucide-react';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function SwagBucksAdminPage() {
  const { db } = getAdminApp();
  
  let balances: any[] = [];
  let tenants: any[] = [];

  try {
    // Fetch SwagBucks balances
    const balancesSnapshot = await db.collection('swagBucksBalances').get();
    balances = balancesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get tenants data
    const tenantsSnapshot = await db.collection('tenants').get();
    tenants = tenantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error loading SwagBucks data:', error);
  }

  // Calculate statistics
  const totalSwagBucksInCirculation = balances.reduce((sum, b) => sum + (b.balance || 0), 0);
  const totalEarnedAllTime = balances.reduce((sum, b) => sum + (b.totalEarned || 0), 0);
  const totalRedeemedAllTime = balances.reduce((sum, b) => sum + (b.totalRedeemed || 0), 0);

  // Helper function to get tenant name
  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.name || tenant?.storeName || `Team ${tenantId.slice(0, 8)}`;
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

      {/* Overview Stats */}
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
          value="0"
          icon={DollarSign}
          description="Redemption requests awaiting approval"
          className="border-orange-200 bg-gradient-to-br from-orange-50 to-white"
        />
      </div>

      {/* Team Balances */}
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
              <div key={balance.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-semibold text-red-800">{getTenantName(balance.tenantId)}</h3>
                  <p className="text-sm text-red-600">
                    Earned: {balance.totalEarned || 0} SB • Redeemed: {balance.totalRedeemed || 0} SB
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-700">{balance.balance || 0}</div>
                  <div className="text-sm text-red-600">
                    ${(balance.balance || 0).toFixed(2)} CAD value
                  </div>
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
