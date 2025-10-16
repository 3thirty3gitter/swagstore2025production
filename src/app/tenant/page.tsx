import { redirect } from 'next/navigation';

// This page is a fallback - normally middleware handles subdomain routing
// If someone navigates to /tenant directly, redirect to home
export default function TenantFallbackPage() {
  redirect('/');
}
