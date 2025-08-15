"use client";

const GUEST_NAME_KEY = 'forever_captured_guest_name';
const AUTH_FLAG_KEY = 'forever_captured_auth_flag';
const IS_ADMIN_KEY = 'forever_captured_is_admin';

export const login = (name: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_NAME_KEY, name);
    localStorage.setItem(AUTH_FLAG_KEY, 'true');
    if (name === "Admin") {
      localStorage.setItem(IS_ADMIN_KEY, 'true');
    } else {
      localStorage.removeItem(IS_ADMIN_KEY);
    }
  }
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_NAME_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(IS_ADMIN_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_FLAG_KEY) === 'true';
  }
  return false;
};

export const getGuestName = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(GUEST_NAME_KEY);
  }
  return null;
};

export const isAdmin = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(IS_ADMIN_KEY) === 'true';
  }
  return false;
};
