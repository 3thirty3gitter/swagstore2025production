'use client';

import { StatCard } from "@/components/admin/stat-card";
import { Gift, TrendingUp, Users, DollarSign } from "lucide-react";

export default function SwagBucksAdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-red-800">SwagBucks Management</h1>
        <p className="text-gray-600 mt-1">Canadian SwagBucks Rewards System • All values in CAD 🍁</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active SwagBucks"
          value="445"
          icon={Gift}
          description="$445.00 CAD value in circulation"
          className="border-red-200 bg-gradient-to-br from-red-50 to-white"
        />
        <StatCard
          title="Total Earned"
          value="895"
          icon={TrendingUp}
          description="$895.00 CAD earned by all teams"
          className="border-green-200 bg-gradient-to-br from-green-50 to-white"
        />
        <StatCard
          title="Active Teams"
          value="3"
          icon={Users}
          description="Canadian teams with SwagBucks"
          className="border-blue-200 bg-gradient-to-br from-blue-50 to-white"
        />
        <StatCard
          title="Pending Requests"
          value="2"
          icon={DollarSign}
          description="Redemption requests awaiting approval"
          className="border-orange-200 bg-gradient-to-br from-orange-50 to-white"
        />
      </div>

      {/* Team Balances */}
      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-red-500" />
          Canadian Team SwagBucks Balances
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
            <div>
              <h3 className="font-semibold text-red-800">Toronto Maple Leafs Hockey</h3>
              <p className="text-sm text-red-600">Earned: 350 SB • Redeemed: 200 SB</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-700">150</div>
              <div className="text-sm text-red-600">$150.00 CAD value</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
            <div>
              <h3 className="font-semibold text-red-800">Vancouver Canucks Youth</h3>
              <p className="text-sm text-red-600">Earned: 125 SB • Redeemed: 50 SB</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-700">75</div>
              <div className="text-sm text-red-600">$75.00 CAD value</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
            <div>
              <h3 className="font-semibold text-red-800">Calgary Flames Development</h3>
              <p className="text-sm text-red-600">Earned: 420 SB • Redeemed: 200 SB</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-700">220</div>
              <div className="text-sm text-red-600">$220.00 CAD value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Requests */}
      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-orange-500" />
          Redemption Requests
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-orange-50">
            <div>
              <h3 className="font-semibold text-orange-800">Toronto Maple Leafs Hockey</h3>
              <p className="text-sm text-orange-600">New hockey sticks for team</p>
              <p className="text-xs text-orange-500">Requested: Today</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-orange-700">100 SwagBucks</div>
                <div className="text-sm text-orange-600">$100.00 CAD value</div>
              </div>
              <span className="px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm">pending</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Reject</button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-orange-50">
            <div>
              <h3 className="font-semibold text-orange-800">Calgary Flames Development</h3>
              <p className="text-sm text-orange-600">Tournament registration fees</p>
              <p className="text-xs text-orange-500">Requested: Today</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-orange-700">150 SwagBucks</div>
                <div className="text-sm text-orange-600">$150.00 CAD value</div>
              </div>
              <span className="px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm">pending</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p>🍁 SwagStore Canada • Serving teams coast to coast • 10% earning rate on all sales 🍁</p>
      </div>
    </div>
  );
}
