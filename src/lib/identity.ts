import type { PersonSlug } from "../types/domain";

const STORAGE_KEY = "couple-habit.identity";

export function getStoredIdentity(): PersonSlug | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "me" || value === "partner" ? value : null;
}

export function setStoredIdentity(identity: PersonSlug): void {
  localStorage.setItem(STORAGE_KEY, identity);
}

export function clearStoredIdentity(): void {
  localStorage.removeItem(STORAGE_KEY);
}
