'use server';

import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './firebase-admin';
import { requireAdmin } from './services/admin-service';
import { revalidatePath } from 'next/cache';

// Secure product creation with validation
const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  category: z.string().min(1).max(100),
  tenantIds: z.array(z.string()).min(1),
  images: z.array(z.object({
    src: z.string().url(),
    alt: z.string().max(200)
  })),
  variants: z.array(z.object({
    title: z.string().max(100),
    price: z.number().positive().max(10000), // Max $10,000 CAD
    sku: z.string().max(50),
    inventoryQuantity: z.number().int().min(0)
  })).min(1)
});

export async function createSecureProduct(
  prevState: any,
  formData: FormData,
  authToken: string
) {
  try {
    // Verify authentication
    const { auth } = getAdminApp();
    const decodedToken = await auth.verifyIdToken(authToken);
    
    // Verify admin role
    await requireAdmin(decodedToken.uid);
    
    // Validate input data
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = productSchema.parse({
      ...rawData,
      tenantIds: JSON.parse(rawData.tenantIds as string),
      images: JSON.parse(rawData.images as string),
      variants: JSON.parse(rawData.variants as string)
    });
    
    // Create product with audit trail
    const { db } = getAdminApp();
    const productRef = db.collection('products').doc();
    
    await productRef.set({
      ...validatedData,
      createdAt: new Date(),
      createdBy: decodedToken.uid,
      lastModified: new Date(),
      lastModifiedBy: decodedToken.uid
    });
    
    revalidatePath('/admin/products');
    return { success: true, productId: productRef.id };
    
  } catch (error) {
    console.error('Secure product creation failed:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid data provided',
        fieldErrors: error.flatten().fieldErrors
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Product creation failed' 
    };
  }
}

// Secure order validation
const orderSchema = z.object({
  tenantId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive().max(100),
    price: z.number().positive()
  })).min(1),
  customerInfo: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(20),
    address: z.object({
      street: z.string().min(1).max(200),
      city: z.string().min(1).max(100),
      province: z.string().length(2), // Canadian province codes
      postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/), // Canadian postal code
      country: z.literal('CA')
    })
  }),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  total: z.number().positive().max(10000)
});

export async function createSecureOrder(orderData: any, paymentIntentId: string) {
  try {
    // Validate order data
    const validatedOrder = orderSchema.parse(orderData);
    
    // Verify payment intent with Square (if using Square)
    // This would integrate with your payment processor
    
    // Calculate expected totals server-side
    const calculatedSubtotal = validatedOrder.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    if (Math.abs(calculatedSubtotal - validatedOrder.subtotal) > 0.01) {
      throw new Error('Order total mismatch');
    }
    
    // Create order with security context
    const { db } = getAdminApp();
    const orderRef = db.collection('orders').doc();
    
    await orderRef.set({
      ...validatedOrder,
      id: orderRef.id,
      status: 'pending',
      paymentIntentId,
      createdAt: new Date(),
      ipAddress: 'server-side', // You'd get this from request headers
      userAgent: 'server-side',
      fraudScore: 0 // Implement fraud detection
    });
    
    return { success: true, orderId: orderRef.id };
    
  } catch (error) {
    console.error('Secure order creation failed:', error);
    throw error;
  }
}

// Secure SwagBucks redemption
export async function approveRedemptionSecure(
  redemptionId: string,
  authToken: string,
  reason?: string
) {
  try {
    // Verify admin authentication
    const { auth } = getAdminApp();
    const decodedToken = await auth.verifyIdToken(authToken);
    await requireAdmin(decodedToken.uid);
    
    const { db } = getAdminApp();
    
    // Atomic transaction for redemption approval
    await db.runTransaction(async (transaction) => {
      const redemptionRef = db.collection('swagbucks_redemptions').doc(redemptionId);
      const redemptionDoc = await transaction.get(redemptionRef);
      
      if (!redemptionDoc.exists) {
        throw new Error('Redemption request not found');
      }
      
      const redemption = redemptionDoc.data();
      
      if (redemption.status !== 'pending') {
        throw new Error('Redemption already processed');
      }
      
      // Verify tenant balance
      const balanceRef = db.collection('swagbucks_balances').doc(redemption.tenantId);
      const balanceDoc = await transaction.get(balanceRef);
      
      if (!balanceDoc.exists || balanceDoc.data().balance < redemption.amount) {
        throw new Error('Insufficient SwagBucks balance');
      }
      
      // Update redemption status
      transaction.update(redemptionRef, {
        status: 'approved',
        approvedBy: decodedToken.uid,
        approvedAt: new Date(),
        reason: reason || 'Approved by admin'
      });
      
      // Deduct from balance
      transaction.update(balanceRef, {
        balance: balanceDoc.data().balance - redemption.amount,
        totalRedeemed: (balanceDoc.data().totalRedeemed || 0) + redemption.amount,
        lastUpdated: new Date()
      });
      
      // Create transaction record
      transaction.create(db.collection('swagbucks_transactions').doc(), {
        tenantId: redemption.tenantId,
        type: 'redeemed',
        amount: -redemption.amount,
        description: redemption.description,
        redemptionId: redemptionId,
        createdAt: new Date(),
        createdBy: decodedToken.uid
      });
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Secure redemption approval failed:', error);
    throw error;
  }
}
