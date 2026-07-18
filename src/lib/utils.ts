export function formatDate(time: string): string {
  return new Date(time).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', dateStyle: 'medium' });
}