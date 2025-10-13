'use client';

import { useState, useEffect } from 'react';
import { Gift, TrendingUp, Users, DollarSign, MapleLeaf } from 'lucide-react';

interface TenantBalance {
  id: string;
  name: string;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  lastUpdated: Date;
}

interface RedemptionRequest {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
}

export default function SwagBucksAdminPage() {
  const [tenantBalances, setTenantBalances] = useState<TenantBalance[]>([]);
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([]);

  // Mock data - replace with Firebase calls
  useEffect(() => {
    setTenantBalances([
      {
        id: 'tenant1',
        name: 'Toronto Maple Leafs Hockey',
        balance: 150,
        totalEarned: 350,
        totalRedeemed: 200,
        lastUpdated: new Date()
      },
      {
        id: 'tenant2', 
        name: 'Vancouver Canucks Youth',
        balance: 75,
        totalEarned: 125,
        totalRedeemed: 50,
        lastUpdated: new Date()
      },
      {
        id: 'tenant3',
        name: 'Calgary Flames Development',
        balance: 220,
        totalEarned: 420,
        totalRedeemed: 200,
        lastUpdated: new Date()
      }
    ]);

    setRedemptionRequests([
      {
        id: 'req1',
        tenantId: 'tenant1',
        tenantName: 'Toronto Maple Leafs Hockey',
        amount: 100,
        description: 'New hockey sticks for team',
        status: 'pending',
        requestedAt: new Date()
      },
      {
        id: 'req2',
        tenantId: 'tenant3',
        tenantName: 'Calgary Flames Development',
        amount: 150,
        description: 'Tournament registration fees',
        status: 'pending',
        requestedAt: new Date()
      }
    ]);
  }, []);

  const formatCAD = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const totalSwagBucksInCirculation = tenantBalances.reduce((sum, tenant) => sum + tenant.balance, 0);
  const totalEarnedAllTime = tenantBalances.reduce((sum, tenant) => sum + tenant.totalEarned, 0);
  const pendingRequests = redemptionRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <MapleLeaf className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-red-800">SwagBucks Management</h1>
            <MapleLeaf className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600 mt-1">Canadian SwagBucks Rewards System • All values in CAD 🍁</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border border-red-200 bg-gradient-to-br from-red-50 to-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-red-700">Active SwagBucks</h3>
            <Gift className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-800">{totalSwagBucksInCirculation}</div>
          <p className="text-xs text-red-600">
            {formatCAD(totalSwagBucksInCirculation)} value in circulation
          </p>
        </div>

        <div className="border border-green-200 bg-gradient-to-br from-green-50 to-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-700">Total Earned</h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-800">{totalEarnedAllTime}</div>
          <p className="text-xs text-green-600">
            {formatCAD(totalEarnedAllTime)} earned by all teams
          </p>
        </div>

        <div className="border border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-700">Active Teams</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-800">{tenantBalances.length}</div>
          <p className="text-xs text-blue-600">
            Canadian teams with SwagBucks
          </p>
        </div>

        <div className="border border-orange-200 bg-gradient-to-br from-orange-50 to-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-orange-700">Pending Requests</h3>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-800">{pendingRequests}</div>
          <p className="text-xs text-orange-600">
            Redemption requests awaiting approval
          </p>
        </div>
      </div>

      {/* Team Balances */}
      <div className="border rounded-lg bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Gift className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold">Canadian Team SwagBucks Balances</h2>
        </div>
        <div className="space-y-4">
          {tenantBalances.map((tenant) => (
            <div key={tenant.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50/50">
              <div>
                <h3 className="font-semibold text-red-800">{tenant.name}</h3>
                <p className="text-sm text-red-600">
                  Earned: {tenant.totalEarned} SB • Redeemed: {tenant.totalRedeemed} SB
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-700">{tenant.balance}</div>
                <div className="text-sm text-red-600">
                  {formatCAD(tenant.balance)} CAD value
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redemption Requests */}
      <div className="border rounded-lg bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-semibold">Redemption Requests</h2>
        </div>
        <div className="space-y-4">
          {redemptionRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-orange-50/50">
              <div>
                <h3 className="font-semibold text-orange-800">{request.tenantName}</h3>
                <p className="text-sm text-orange-600">{request.description}</p>
                <p className="text-xs text-orange-500">
                  Requested: {request.requestedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-orange-700">{request.amount} SwagBucks</div>
                  <div className="text-sm text-orange-600">
                    {formatCAD(request.amount)} CAD value
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-sm">
                  {request.status}
                </span>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p className="flex items-center justify-center gap-2">
          <MapleLeaf className="w-4 h-4 text-red-500" />
          SwagStore Canada • Serving teams coast to coast • 10% earning rate on all sales
          <MapleLeaf className="w-4 h-4 text-red-500" />
        </p>
      </div>
    </div>
  );
}
