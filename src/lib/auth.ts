export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth-token', token);
}

export function clearToken(): void {
  localStorage.removeItem('auth-token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
