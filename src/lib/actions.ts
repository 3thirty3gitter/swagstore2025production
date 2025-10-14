
'use server';

import { z } from 'zod';
import {
  Website,
} from './types';
import { revalidatePath } from 'next/cache';
import { getAdminApp } from './firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '@/firebase/config';
import { doc, setDoc, addDoc, collection, getDoc, deleteDoc } from 'firebase/firestore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid email or password format.',
    };
  }
  
  const { email, password } = validatedFields.data;

  try {
    // We do this on the server to avoid exposing the sign-in logic to the client until it's necessary
    // This is a placeholder for server-side validation if needed.
    // The actual sign-in state is managed on the client.
    console.log(`Attempting login for ${email}`);
    // This is a server-side check. The client will handle the actual sign-in.
  } catch (e: any) {
    return { success: false, error: e.message || 'An unknown error occurred.' };
  }

  // We return success and the credentials to let the client-side perform the sign-in
  return { success: true, email, password };
}

const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required.'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required.'),
  tenantIds: z.preprocess(
    val => (Array.isArray(val) ? val : [val].filter(Boolean)),
    z.array(z.string()).min(1, 'Product must be assigned to at least one tenant.')
  ),
  images: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON for images' });
      return z.NEVER;
    }
  }),
  options: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON for options' });
      return z.NEVER;
    }
  }),
  variants: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON for variants' });
      return z.NEVER;
    }
  }),
});


export async function saveProduct(prevState: any, formData: FormData) {
  const validatedFields = productFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      error: "Invalid data provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, ...productData } = validatedFields.data;
  const { db } = getAdminApp();
  
  try {
    if (id) {
      const productRef = db.collection('products').doc(id);
      await productRef.set(productData, { merge: true });
    } else {
      await db.collection('products').add(productData);
    }
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: any) {
    console.error("Error saving product:", e);
    return { success: false, error: 'Failed to save product. Check permissions and data.' };
  }
}

const tenantFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tenant name is required.'),
  storeName: z.string().min(1, 'Storefront name is required.'),
  slug: z.string().min(1, 'Slug is required.'),
});

const getDefaultWebsiteData = (): Website => ({
    header: {
        layout: 'centered',
        menuItems: [],
        logoWidth: 96,
    },
    pages: [
        {
            id: 'home',
            name: 'Home',
            path: '/',
            sections: [
              {
                id: `section-${Date.now()}`,
                type: 'Hero Section',
                props: {
                    title: "Welcome to Your Store",
                    text: "Discover our amazing products.",
                    buttonText: "Shop Now",
                    buttonLink: "#products",
                    imageUrl: `https://picsum.photos/seed/${Date.now()}/1200/800`,
                    imageHint: "storefront",
                    imageWidth: 80,
                }
              },
              {
                id: `section-${Date.now() + 1}`,
                type: 'Product List',
                props: {
                    title: "Featured Products",
                }
              }
            ]
        }
    ]
});


export async function saveTenant(prevState: any, formData: FormData) {
    const validatedFields = tenantFormSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid data provided.",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { id, ...tenantData } = validatedFields.data;
    const { db } = getAdminApp();

    try {
        if (id) {
            const tenantRef = db.collection("tenants").doc(id);
            await tenantRef.set(tenantData, { merge: true });
        } else {
            const newTenantData = {
              ...tenantData,
              website: getDefaultWebsiteData(),
            }
            await db.collection("tenants").add(newTenantData);
        }
        revalidatePath('/admin/tenants');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving tenant:", e);
        return { success: false, error: 'Failed to save tenant. Check permissions and data.' };
    }
}


export async function saveWebsite(tenantId: string, websiteData: Website) {
  const { db } = getAdminApp();
  try {
    const tenantRef = db.collection('tenants').doc(tenantId);
    await tenantRef.set({ website: websiteData }, { merge: true });
    
    const tenantDoc = await tenantRef.get();
    const slug = tenantDoc.data()?.slug;

    if (slug) {
        revalidatePath(`/${slug}`);
    }
    revalidatePath(`/admin/tenants/${tenantId}/editor`);
    
    return { success: true };
  } catch (e: any) {
    console.error("Error saving website:", e);
    return { success: false, error: e.message || 'Failed to save website config.' };
  }
}

export async function uploadFile(prevState: any, formData: FormData): Promise<{ success: boolean, url?: string, error?: string }> {
  const dataUrl = formData.get('dataUrl') as string;
  const fileName = formData.get('fileName') as string;

  if (!dataUrl || !fileName) {
    return { success: false, error: 'Missing data URL or file name.' };
  }

  try {
    const { storage } = getAdminApp();
    const mimeType = dataUrl.match(/data:(.*);base64,/)?.[1];
    const base64 = dataUrl.split(',')[1];
    if (!mimeType || !base64) {
      throw new Error('Invalid Data URL format.');
    }
    
    const buffer = Buffer.from(base64, 'base64');
    const file = storage.bucket().file(`uploads/${Date.now()}-${fileName}`);
    
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
      public: true,
    });
    
    return { success: true, url: file.publicUrl() };

  } catch (e: any) {
    console.error('Upload failed:', e);
    return { success: false, error: e.message || "File upload failed." };
  }
}

export async function deleteTenant(tenantId: string) {
  if (!tenantId || typeof tenantId !== 'string') {
    return { success: false, error: 'Valid tenant ID is required.' };
  }

  const { db } = getAdminApp();
  try {
    // First check if the tenant exists
    const tenantRef = db.collection('tenants').doc(tenantId);
    const tenantDoc = await tenantRef.get();
    
    if (!tenantDoc.exists) {
      return { success: false, error: 'Tenant not found or already deleted.' };
    }
    
    // Delete the tenant
    await tenantRef.delete();
    
    // Force revalidation of the tenants page
    revalidatePath('/admin/tenants');
    revalidatePath('/');
    
    return { success: true };
  } catch (e: any) {
    console.error('Error deleting tenant:', e);
    return { success: false, error: e.message || 'Failed to delete tenant. Please try again.' };
  }
};
  }

  const { db } = getAdminApp();
  try {
    await db.collection('tenants').doc(tenantId).delete();
    revalidatePath('/admin/tenants');
    return { success: true };
  } catch (e: any) {
    console.error('Error deleting tenant:', e);
    return { success: false, error: e.message || 'Failed to delete tenant.' };
  }
}
