import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import { ScanStatus } from '../types';

export interface ScannerState {
  status: ScanStatus | null;
  current: string;
  connected: boolean;
}

export function useScanner(): ScannerState {
  const [status, setStatus] = useState<ScanStatus | null>(null);
  const [current, setCurrent] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connRef = ref(db, '.info/connected');
    const statusRef = ref(db, '/scan/status');
    const currentRef = ref(db, '/scan/current');

    const unsubConn = onValue(connRef, snap => setConnected(snap.val() ?? false));
    const unsubStatus = onValue(statusRef, snap => setStatus(snap.val()));
    const unsubCurrent = onValue(currentRef, snap => setCurrent(snap.val() ?? ''));

    return () => { unsubConn(); unsubStatus(); unsubCurrent(); };
  }, []);

  return { status, current, connected };
}
