'use server';

import type { Product, Tenant, Order } from "./types";

// This file used to contain server-side data fetching with Firebase Admin.
// It has been cleared as part of the backend reset.
// We will rebuild data fetching using client-side hooks.

export async function getProducts(): Promise<Product[]> {
  console.log("getProducts called, but it's a placeholder. Returning empty array.");
  return [];
}

export async function getTenants(): Promise<Tenant[]> {
    console.log("getTenants called, but it's a placeholder. Returning empty array.");
    return [];
}

export async function getOrders(): Promise<Order[]> {
  console.log("getOrders called, but it's a placeholder. Returning empty array.");
  return [];
}
