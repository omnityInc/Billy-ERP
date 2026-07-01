export type Paise = number & { readonly __brand: "Paise" };

export function formatINR(paise: Paise | number): string {
  const amount = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactINR(paise: Paise | number): string {
  const amount = Math.abs(paise / 100);
  const sign = paise < 0 ? '-' : '';

  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `${sign}₹${crores.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `${sign}₹${lakhs.toFixed(2)}L`;
  } else if (amount >= 1000) {
    const thousands = amount / 1000;
    return `${sign}₹${thousands.toFixed(2)}K`;
  }

  return formatINR(paise);
}
