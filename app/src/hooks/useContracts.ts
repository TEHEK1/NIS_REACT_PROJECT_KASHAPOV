import { useSyncExternalStore, useCallback } from 'react';
import { contractStore, type ContractEntry } from '@/config/contracts';

export function useContracts() {
  const contracts = useSyncExternalStore(
    cb => contractStore.subscribe(cb),
    () => contractStore.getAll(),
  );

  const add = useCallback((entry: ContractEntry) => contractStore.add(entry), []);
  const remove = useCallback((slug: string) => contractStore.remove(slug), []);
  const reset = useCallback(() => contractStore.resetToDefaults(), []);

  return { contracts, add, remove, reset };
}
