export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec / Québec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' }
];

export const formatCanadianPostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return postalCode;
};

export const validateCanadianPostalCode = (postalCode: string): boolean => {
  const pattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  return pattern.test(postalCode);
};

export const formatCAD = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const TAX_RATES = {
  AB: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
  BC: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'GST + PST' },
  MB: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'GST + PST' },
  NB: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  NL: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  NS: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  ON: { gst: 0, pst: 0, hst: 0.13, total: 0.13, name: 'HST' },
  PE: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'HST' },
  QC: { gst: 0.05, pst: 0.09975, hst: 0, total: 0.14975, name: 'GST + QST' },
  SK: { gst: 0.05, pst: 0.06, hst: 0, total: 0.11, name: 'GST + PST' },
  NT: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
  NU: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' },
  YT: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'GST' }
} as const;

export type ProvinceCode = keyof typeof TAX_RATES;

export const calculateTax = (subtotal: number, province: ProvinceCode): {
  subtotal: number;
  tax: number;
  total: number;
  taxName: string;
} => {
  const taxRate = TAX_RATES[province];
  const tax = subtotal * taxRate.total;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
    taxName: taxRate.name
  };
};

export const SHIPPING_RATES_CAD = {
  standard: 9.99,
  express: 19.99,
  free_threshold: 75.00
};