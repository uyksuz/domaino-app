import React from 'react';
import { View, Text } from 'react-native';
import { ScanStatus } from '../types';

function eta(offset: number, total: number, startedAt: string | null): string {
  if (!startedAt || offset === 0) return '—';
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
  const rate = offset / elapsed;
  if (rate === 0) return '—';
  const remaining = (total - offset) / rate;
  const hours = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  return hours > 0 ? `~${hours}s ${mins}dk` : `~${mins}dk`;
}

interface Props {
  status: ScanStatus;
  current: string;
}

export function ScanProgress({ status, current }: Props) {
  const pct = status.total > 0 ? (status.offset / status.total) * 100 : 0;
  return (
    <View style={{ backgroundColor: '#09090b', borderRadius: 12, padding: 16, marginHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
          {status.length}-Karakter Tarama
        </Text>
        <Text style={{ fontSize: 14, color: '#10b981' }}>{pct.toFixed(1)}%</Text>
      </View>

      <View style={{ height: 8, backgroundColor: '#27272a', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        <View style={{ height: '100%', backgroundColor: '#10b981', borderRadius: 4, width: `${Math.min(pct, 100)}%` }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 11, color: '#71717a' }}>
          {status.offset.toLocaleString()} / {status.total.toLocaleString()}
        </Text>
        <Text style={{ fontSize: 11, color: '#71717a' }}>
          ETA {eta(status.offset, status.total, status.started_at)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
        <Text style={{ fontSize: 11, color: '#d4d4d8', fontFamily: 'monospace' }} numberOfLines={1}>
          {current || '—'}
        </Text>
      </View>
    </View>
  );
}
