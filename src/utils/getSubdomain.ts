export function getSubdomain(): string {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1'
    ? 'lebel'
    : hostname.split('.')[0];
}
