import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import { Stats } from '../types';

export function useStats(): Stats | null {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const unsub = onValue(ref(db, '/stats'), snap => {
      setStats(snap.val());
    });
    return unsub;
  }, []);

  return stats;
}
