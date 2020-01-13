export function httpBasicAuth(username: string, password: string): string {
  return (
    `Basic ` + Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
  );
}
