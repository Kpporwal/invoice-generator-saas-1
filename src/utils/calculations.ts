import type { InvoiceItem, InvoiceCalculations } from '../types';

export function calculateItemDiscount(item: InvoiceItem): number {
  const baseAmount = item.quantity * item.rate;
  return Math.min(Math.max(Number(item.discount || 0), 0), baseAmount);
}

export function calculateItemBase(item: InvoiceItem): number {
  return item.quantity * item.rate;
}

export function calculateItemTaxableAmount(item: InvoiceItem): number {
  return calculateItemBase(item) - calculateItemDiscount(item);
}

export function calculateItemGST(item: InvoiceItem): number {
  const taxableAmount = calculateItemTaxableAmount(item);
  return taxableAmount * (item.gstPercent / 100);
}

export function calculateItemAmount(item: InvoiceItem): number {
  return calculateItemTaxableAmount(item) + calculateItemGST(item);
}

export function calculateInvoice(
  items: InvoiceItem[]
): InvoiceCalculations {
  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemBase(item),
    0
  );

  const discountTotal = items.reduce(
    (sum, item) => sum + calculateItemDiscount(item),
    0
  );

  const gstTotal = items.reduce(
    (sum, item) => sum + calculateItemGST(item),
    0
  );

  const grandTotal = subtotal - discountTotal + gstTotal;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    gstTotal: Math.round(gstTotal * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    amountInWords: numberToWords(grandTotal),
  };
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';

  const rounded = Math.round(num * 100) / 100;
  const [intPart, decPart] = rounded.toFixed(2).split('.');
  const integer = parseInt(intPart, 10);
  const paise = parseInt(decPart, 10);

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }

  let result = convert(integer) + ' Rupees';
  if (paise > 0) {
    result += ' and ' + convert(paise) + ' Paise';
  }
  result += ' Only';

  return result;
}

export function generateInvoiceNumber(existingInvoices: { invoiceNumber: string }[]): string {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

  let maxNum = 0;
  const prefix = `INV-${currentYear}${currentMonth}-`;
  for (const inv of existingInvoices) {
    if (inv.invoiceNumber.startsWith(prefix)) {
      const numPart = parseInt(inv.invoiceNumber.slice(prefix.length), 10);
      if (numPart > maxNum) maxNum = numPart;
    }
  }

  return `${prefix}${(maxNum + 1).toString().padStart(4, '0')}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
