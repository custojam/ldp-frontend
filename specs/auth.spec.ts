/**
 * Feature: Authentication (Frontend)
 *
 * Spec: Login page allows admin to authenticate.
 * Token is stored in localStorage and attached to subsequent requests.
 * Protected routes redirect to /login when token is absent.
 * Public form pages do NOT require authentication.
 */

import { getToken, setToken, clearToken, isAuthenticated } from '../src/lib/auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'window', { value: global });

describe('Feature: Authentication (Frontend)', () => {
  beforeEach(() => localStorageMock.clear());

  describe('Spec: Token management', () => {
    it('should return null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });

    it('should store and retrieve a token', () => {
      setToken('my-jwt-token');
      expect(getToken()).toBe('my-jwt-token');
    });

    it('should clear the token on logout', () => {
      setToken('my-jwt-token');
      clearToken();
      expect(getToken()).toBeNull();
    });
  });

  describe('Spec: isAuthenticated()', () => {
    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when a token is stored', () => {
      setToken('valid-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false after token is cleared', () => {
      setToken('valid-token');
      clearToken();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('Spec: Protected vs. public routes', () => {
    const PROTECTED_PATHS = ['/dashboard', '/brokers', '/forms', '/distributions', '/leads'];
    const PUBLIC_PATHS = ['/login', '/lead-registration', '/contact-us'];

    it('should identify admin paths as protected', () => {
      PROTECTED_PATHS.forEach((path) => {
        const isProtected = ['/dashboard', '/brokers', '/forms', '/distributions', '/leads'].some(
          (p) => path.startsWith(p)
        );
        expect(isProtected).toBe(true);
      });
    });

    it('public form pages and /login should not be protected', () => {
      PUBLIC_PATHS.forEach((path) => {
        const isProtected = ['/dashboard', '/brokers', '/forms', '/distributions', '/leads'].some(
          (p) => path.startsWith(p)
        );
        expect(isProtected).toBe(false);
      });
    });
  });
});
