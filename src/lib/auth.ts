export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth-token', token);
  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

export function clearToken(): void {
  localStorage.removeItem('auth-token');
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
