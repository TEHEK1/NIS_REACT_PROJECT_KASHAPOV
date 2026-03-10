import { useState, useEffect } from 'react';

const CACHE_KEY = 'nft-gallery-eth-price';
const CACHE_TTL = 5 * 60 * 1000;
const FALLBACK_PRICE = 3200;

interface CacheEntry {
  price: number;
  ts: number;
}

export function useEthPrice() {
  const [usdPrice, setUsdPrice] = useState<number>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const entry = JSON.parse(cached) as CacheEntry;
        if (Date.now() - entry.ts < CACHE_TTL) return entry.price;
      }
    } catch { /* ignore */ }
    return FALLBACK_PRICE;
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPrice() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        if (!res.ok) return;
        const data = await res.json() as { ethereum?: { usd?: number } };
        const price = data.ethereum?.usd;
        if (price && !cancelled) {
          setUsdPrice(price);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ price, ts: Date.now() }));
        }
      } catch { /* fallback price stays */ }
    }

    fetchPrice();
    return () => { cancelled = true; };
  }, []);

  const ethToUsd = (eth: number) => (eth * usdPrice).toFixed(2);
  const formatUsd = (eth: number) => {
    const usd = eth * usdPrice;
    if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
    if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
    return `$${usd.toFixed(2)}`;
  };

  return { usdPrice, ethToUsd, formatUsd };
}
