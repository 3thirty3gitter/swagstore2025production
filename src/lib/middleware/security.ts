import { NextRequest } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest, 
  maxRequests: number = 100, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const clientIP = request.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const clientData = rateLimitStore.get(clientIP);
  
  if (!clientData || clientData.resetTime < windowStart) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
}

// Sanitize string input
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

// Validate Canadian postal code
export const canadianPostalCodeSchema = z.string().regex(
  /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
  'Invalid Canadian postal code format'
);

// Validate Canadian province
export const canadianProvinceSchema = z.enum([
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
]);

// Security headers middleware
export function securityHeaders() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.square-cdn.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https://firebasestorage.googleapis.com https://picsum.photos;
      connect-src 'self' https://api.github.com https://firestore.googleapis.com;
    `.replace(/\s+/g, ' ').trim()
  };
}
