import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs,
  increment,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { 
  calculateSwagBucksEarned,
  generateTransactionId,
  SwagBucksTransactionType,
  isValidRedemption,
  type SwagBucksTransaction,
  type SwagBucksBalance
} from '../swagbucks';

// Process order and award SwagBucks
export async function processOrderSwagBucks(
  db: any,
  orderId: string,
  tenantId: string,
  orderSubtotal: number,
  userId: string = 'system'
) {
  try {
    const swagBucksEarned = calculateSwagBucksEarned(orderSubtotal);
    
    if (swagBucksEarned === 0) return { swagBucksEarned: 0 };

    // Create transaction record
    const transaction = {
      tenantId,
      type: SwagBucksTransactionType.EARNED,
      amount: swagBucksEarned,
      description: `Earned from order #${orderId.slice(-8)}`,
      orderId,
      createdAt: serverTimestamp(),
      createdBy: userId,
      metadata: {
        orderSubtotal
      }
    };

    // Add to transactions collection
    const transactionRef = await addDoc(collection(db, 'swagbucks_transactions'), transaction);

    // Update tenant balance
    const balanceRef = doc(db, 'swagbucks_balances', tenantId);
    const balanceDoc = await getDoc(balanceRef);

    if (balanceDoc.exists()) {
      await updateDoc(balanceRef, {
        balance: increment(swagBucksEarned),
        totalEarned: increment(swagBucksEarned),
        lastUpdated: serverTimestamp()
      });
    } else {
      // Create initial balance
      await setDoc(balanceRef, {
        tenantId,
        balance: swagBucksEarned,
        totalEarned: swagBucksEarned,
        totalRedeemed: 0,
        lastUpdated: serverTimestamp()
      });
    }

    return { transactionId: transactionRef.id, swagBucksEarned };
  } catch (error) {
    console.error('Error processing SwagBucks:', error);
    throw error;
  }
}

// Get tenant SwagBucks balance
export async function getTenantBalance(
  db: any,
  tenantId: string
): Promise<SwagBucksBalance | null> {
  try {
    const balanceRef = doc(db, 'swagbucks_balances', tenantId);
    const balanceDoc = await getDoc(balanceRef);

    if (!balanceDoc.exists()) {
      return {
        tenantId,
        balance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        lastUpdated: new Date()
      };
    }

    const data = balanceDoc.data();
    return {
      tenantId,
      balance: data.balance || 0,
      totalEarned: data.totalEarned || 0,
      totalRedeemed: data.totalRedeemed || 0,
      lastUpdated: data.lastUpdated?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error getting balance:', error);
    return null;
  }
}

// Get all balances for admin dashboard
export async function getAllBalances(db: any): Promise<SwagBucksBalance[]> {
  try {
    const balancesSnapshot = await getDocs(collection(db, 'swagbucks_balances'));
    
    return balancesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        tenantId: doc.id,
        balance: data.balance || 0,
        totalEarned: data.totalEarned || 0,
        totalRedeemed: data.totalRedeemed || 0,
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error getting all balances:', error);
    return [];
  }
}

// Listen to balance changes (real-time updates)
export function subscribeToBalances(
  db: any, 
  callback: (balances: SwagBucksBalance[]) => void
): Unsubscribe {
  const q = collection(db, 'swagbucks_balances');
  
  return onSnapshot(q, (snapshot) => {
    const balances = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        tenantId: doc.id,
        balance: data.balance || 0,
        totalEarned: data.totalEarned || 0,
        totalRedeemed: data.totalRedeemed || 0,
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };
    });
    
    callback(balances);
  });
}

// Get pending redemption requests
export async function getPendingRedemptions(db: any) {
  try {
    const q = query(
      collection(db, 'swagbucks_redemptions'),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      requestedAt: doc.data().requestedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error getting pending redemptions:', error);
    return [];
  }
}
