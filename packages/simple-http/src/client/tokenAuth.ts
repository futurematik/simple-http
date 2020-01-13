export function tokenAuth(token: string, scheme = 'Bearer'): string {
  return `${scheme} ${token}`;
}
