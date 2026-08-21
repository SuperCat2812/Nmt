export function formatCoefficient(a: number): string {
  if (a === 1) return '';
  if (a === -1) return '-';
  return String(a);
}
