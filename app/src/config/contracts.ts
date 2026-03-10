export interface ContractEntry {
  contractAddress: string;
  slug: string;
}

export const DEFAULT_CONTRACTS: ContractEntry[] = [
  { contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', slug: 'bayc' },
  { contractAddress: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', slug: 'azuki' },
  { contractAddress: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', slug: 'pudgy-penguins' },
  { contractAddress: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', slug: 'doodles' },
  { contractAddress: '0x1A92f7381B9F03921564a437210bB9396471050C', slug: 'cool-cats' },
];

const STORAGE_KEY = 'nft-gallery:contracts';

type Listener = () => void;

class ContractStore {
  private list: ContractEntry[];
  private listeners = new Set<Listener>();

  constructor() {
    this.list = this.load();
  }

  private load(): ContractEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ContractEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [...DEFAULT_CONTRACTS];
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
    this.listeners.forEach(fn => fn());
  }

  getAll(): ContractEntry[] {
    return this.list;
  }

  getBySlug(slug: string): ContractEntry | undefined {
    return this.list.find(c => c.slug === slug);
  }

  getByAddress(address: string): ContractEntry | undefined {
    return this.list.find(c => c.contractAddress.toLowerCase() === address.toLowerCase());
  }

  add(entry: ContractEntry): boolean {
    const addr = entry.contractAddress.toLowerCase();
    if (this.list.some(c => c.contractAddress.toLowerCase() === addr)) return false;
    if (this.list.some(c => c.slug === entry.slug)) return false;
    this.list = [...this.list, entry];
    this.persist();
    return true;
  }

  remove(slug: string): boolean {
    const prev = this.list.length;
    this.list = this.list.filter(c => c.slug !== slug);
    if (this.list.length !== prev) {
      this.persist();
      return true;
    }
    return false;
  }

  resetToDefaults() {
    this.list = [...DEFAULT_CONTRACTS];
    this.persist();
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const contractStore = new ContractStore();
