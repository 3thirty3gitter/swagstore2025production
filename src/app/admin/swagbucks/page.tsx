'use client';

import { useState, useEffect } from 'react';
import { StatCard } from "@/components/admin/stat-card";
import { Gift, TrendingUp, Users, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SwagBucksAdminPage() {
  const { user, isLoading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verify admin status before allowing access
  useEffect(() => {
    async function verifyAdminAccess() {
      if (userLoading) return;
      
      if (!user) {
        router.push('/login-admin');
        return;
      }

      if (!firestore) return;

      try {
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        
        if (!adminDoc.exists() || adminDoc.data()?.role !== 'admin') {
          setAuthError('Admin access required for SwagBucks management.');
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin verification failed:', error);
        setAuthError('Unable to verify admin permissions.');
        setIsAdmin(false);
      }
    }

    verifyAdminAccess();
  }, [user, userLoading, firestore, router]);

  // Show loading while checking authentication
  if (userLoading || isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verifying SwagBucks admin access...</span>
      </div>
    );
  }

  // Show error if not admin
  if (isAdmin === false || authError) {
    return (
      <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">SwagBucks Access Denied</h1>
        <p className="text-gray-600 mb-4">
          {authError || 'You do not have admin permissions to manage SwagBucks.'}
        </p>
        <p className="text-sm text-gray-500">
          Current user: {user?.email || 'Not authenticated'}
        </p>
      </div>
    );
  }

  // If admin verified, show the SwagBucks dashboard
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-red-800">SwagBucks Management</h1>
            <Gift className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600 mt-1">Canadian SwagBucks Rewards System • All values in CAD 🍁</p>
        </div>
        <div className="text-sm text-green-600 font-medium">
          ✅ Admin Access Verified
        </div>
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

      {/* Rest of SwagBucks content... */}
      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p>🛡️ Secure Admin Access • SwagStore Canada • 10% earning rate on all sales 🍁</p>
      </div>
    </div>
  );
}
