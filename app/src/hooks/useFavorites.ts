import { useState, useCallback } from 'react';

const STORAGE_KEY = 'nft-gallery-favorites';

function loadFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavorites(favorites: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite, count: favorites.size };
}
