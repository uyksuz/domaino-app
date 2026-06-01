import { useEffect, useState, useCallback } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from './firebase';
import { AvailableDomain } from '../types';

export function useAvailable() {
  const [domains, setDomains] = useState<AvailableDomain[]>([]);

  useEffect(() => {
    const availRef = ref(db, '/available');
    const unsub = onValue(availRef, snap => {
      const val = snap.val();
      if (!val) return setDomains([]);
      const list: AvailableDomain[] = Object.entries(val).map(([id, d]: any) => ({
        id,
        domain: d.domain,
        found_at: d.found_at,
        length: d.length,
        favorited: d.favorited ?? false,
        note: d.note ?? '',
      }));
      list.sort((a, b) => b.found_at.localeCompare(a.found_at));
      setDomains(list);
    });
    return unsub;
  }, []);

  const toggleFavorite = useCallback((id: string, favorited: boolean) => {
    update(ref(db, `/available/${id}`), { favorited });
  }, []);

  const setNote = useCallback((id: string, note: string) => {
    update(ref(db, `/available/${id}`), { note });
  }, []);

  return { domains, toggleFavorite, setNote };
}
