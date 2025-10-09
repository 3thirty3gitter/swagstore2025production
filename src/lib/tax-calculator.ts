// Canadian Provincial Tax Rates (2025)
export const CANADIAN_TAX_RATES: Record<string, { gst: number; pst: number; hst: number; name: string }> = {
  // Provinces with HST (Harmonized Sales Tax)
  'ON': { gst: 0, pst: 0, hst: 0.13, name: 'Ontario' },
  'NB': { gst: 0, pst: 0, hst: 0.15, name: 'New Brunswick' },
  'NL': { gst: 0, pst: 0, hst: 0.15, name: 'Newfoundland and Labrador' },
  'NS': { gst: 0, pst: 0, hst: 0.15, name: 'Nova Scotia' },
  'PE': { gst: 0, pst: 0, hst: 0.15, name: 'Prince Edward Island' },
  
  // Provinces with GST + PST
  'BC': { gst: 0.05, pst: 0.07, hst: 0, name: 'British Columbia' },
  'MB': { gst: 0.05, pst: 0.07, hst: 0, name: 'Manitoba' },
  'QC': { gst: 0.05, pst: 0.09975, hst: 0, name: 'Quebec' },
  'SK': { gst: 0.05, pst: 0.06, hst: 0, name: 'Saskatchewan' },
  
  // Provinces/Territories with GST only
  'AB': { gst: 0.05, pst: 0, hst: 0, name: 'Alberta' },
  'NT': { gst: 0.05, pst: 0, hst: 0, name: 'Northwest Territories' },
  'NU': { gst: 0.05, pst: 0, hst: 0, name: 'Nunavut' },
  'YT': { gst: 0.05, pst: 0, hst: 0, name: 'Yukon' },
};

export interface TaxCalculation {
  subtotal: number;
  gst: number;
  pst: number;
  hst: number;
  totalTax: number;
  total: number;
  taxRate: number;
  province: string;
  taxBreakdown: string;
}

/**
 * Calculate Canadian taxes based on province
 * @param subtotal - The subtotal amount before taxes
 * @param provinceCode - Two-letter province code (e.g., 'AB', 'ON')
 * @returns Tax calculation breakdown
 */
export function calculateCanadianTax(subtotal: number, provinceCode: string): TaxCalculation {
  const province = provinceCode.toUpperCase();
  const taxRate = CANADIAN_TAX_RATES[province] || CANADIAN_TAX_RATES['AB']; // Default to Alberta
  
  let gst = 0;
  let pst = 0;
  let hst = 0;
  let taxBreakdown = '';
  
  if (taxRate.hst > 0) {
    // HST provinces
    hst = subtotal * taxRate.hst;
    taxBreakdown = `HST (${(taxRate.hst * 100).toFixed(2)}%)`;
  } else {
    // GST + PST provinces
    gst = subtotal * taxRate.gst;
    if (taxRate.pst > 0) {
      pst = subtotal * taxRate.pst;
      taxBreakdown = `GST (${(taxRate.gst * 100).toFixed(0)}%) + PST (${(taxRate.pst * 100).toFixed(2)}%)`;
    } else {
      taxBreakdown = `GST (${(taxRate.gst * 100).toFixed(0)}%)`;
    }
  }
  
  const totalTax = gst + pst + hst;
  const total = subtotal + totalTax;
  const effectiveTaxRate = totalTax / subtotal;
  
  return {
    subtotal,
    gst,
    pst,
    hst,
    totalTax,
    total,
    taxRate: effectiveTaxRate,
    province: taxRate.name,
    taxBreakdown,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
