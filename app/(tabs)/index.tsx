import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useScanner } from '../../lib/useScanner';
import { useAvailable } from '../../lib/useAvailable';
import { ScanProgress } from '../../components/ScanProgress';

const MAX_FEED = 50;

export default function LiveFeedScreen() {
  const { status, current, connected } = useScanner();
  const { domains } = useAvailable();
  const [feedLog, setFeedLog] = useState<string[]>([]);

  useEffect(() => {
    if (current) {
      setFeedLog(prev => [current, ...prev].slice(0, MAX_FEED));
    }
  }, [current]);

  const recentAvailable = domains.slice(0, 5).map(d => d.domain);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>📡 Canlı Tarama</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: connected ? '#052e16' : '#27272a' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: connected ? '#10b981' : '#71717a' }} />
          <Text style={{ fontSize: 12, color: connected ? '#10b981' : '#71717a' }}>
            {connected ? 'Bağlı' : 'Bağlanıyor'}
          </Text>
        </View>
      </View>

      {status ? (
        status.scanning ? (
          <ScanProgress status={status} current={current} />
        ) : (
          <View style={{ backgroundColor: '#09090b', borderRadius: 12, marginHorizontal: 16, padding: 16 }}>
            <Text style={{ color: '#71717a', textAlign: 'center' }}>⏸ Scanner beklemede</Text>
          </View>
        )
      ) : (
        <View style={{ backgroundColor: '#09090b', borderRadius: 12, marginHorizontal: 16, padding: 16 }}>
          <Text style={{ color: '#52525b', textAlign: 'center', fontSize: 13 }}>Bağlanılıyor...</Text>
        </View>
      )}

      {recentAvailable.length > 0 && (
        <View style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 4 }}>
          <Text style={{ fontSize: 11, color: '#71717a', marginBottom: 6 }}>Son bulunanlar</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {recentAvailable.map(d => (
              <View key={d} style={{ backgroundColor: '#052e16', borderWidth: 1, borderColor: '#166534', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: '#6ee7b7', fontSize: 12, fontFamily: 'monospace' }}>{d}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={{ fontSize: 11, color: '#3f3f46', paddingHorizontal: 16, marginTop: 12, marginBottom: 4 }}>Taranan domainler</Text>
      <FlatList
        data={feedLog}
        keyExtractor={(item, i) => `${item}-${i}`}
        renderItem={({ item }) => {
          const isAvailable = recentAvailable.includes(item);
          return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 2, backgroundColor: isAvailable ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 12, color: isAvailable ? '#10b981' : '#3f3f46', fontWeight: isAvailable ? 'bold' : 'normal' }}>
                {isAvailable ? '✓ ' : '  '}{item}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: '#3f3f46', fontSize: 12, textAlign: 'center', marginTop: 32 }}>
            Tarama başladığında burada görünür
          </Text>
        }
      />
    </SafeAreaView>
  );
}
