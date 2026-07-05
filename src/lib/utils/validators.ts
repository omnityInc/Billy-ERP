export function isValidGSTIN(value: string): boolean {
  if (!value) return false;
  // Format: 2-digit state code + 10-char PAN + 1 entity + 1 checksum + 1 (Z) + 1 checksum
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);
}

export function isValidPAN(value: string): boolean {
  if (!value) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
}
