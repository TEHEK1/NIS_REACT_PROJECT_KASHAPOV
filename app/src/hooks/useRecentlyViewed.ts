import { useState, useCallback } from 'react';

const STORAGE_KEY = 'nft-gallery-recent';
const MAX_ITEMS = 8;

function load(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(load);

  const addViewed = useCallback((id: string) => {
    setIds(prev => {
      const next = [id, ...prev.filter(i => i !== id)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds: ids, addViewed };
}
