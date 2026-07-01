export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getFinancialYear(date: Date): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  if (month >= 3) return `FY ${year}-${String(year + 1).slice(2)}`;
  return `FY ${year - 1}-${String(year).slice(2)}`;
}
