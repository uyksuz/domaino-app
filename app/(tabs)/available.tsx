import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAvailable } from '../../lib/useAvailable';
import { DomainCard } from '../../components/DomainCard';
import { FilterBar, LengthFilter, PatternMode } from '../../components/FilterBar';
import { AvailableDomain } from '../../types';

function applyFilters(
  domains: AvailableDomain[],
  length: LengthFilter,
  pattern: string,
  patternMode: PatternMode
): AvailableDomain[] {
  return domains.filter(d => {
    const name = d.domain.replace('.com', '');
    if (length !== 'all' && d.length !== parseInt(length)) return false;
    if (pattern) {
      if (patternMode === 'starts' && !name.startsWith(pattern)) return false;
      if (patternMode === 'contains' && !name.includes(pattern)) return false;
      if (patternMode === 'ends' && !name.endsWith(pattern)) return false;
    }
    return true;
  });
}

export default function AvailableScreen() {
  const { domains, toggleFavorite } = useAvailable();
  const router = useRouter();
  const [length, setLength] = useState<LengthFilter>('all');
  const [pattern, setPattern] = useState('');
  const [patternMode, setPatternMode] = useState<PatternMode>('contains');

  const filtered = useMemo(
    () => applyFilters(domains, length, pattern, patternMode),
    [domains, length, pattern, patternMode]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
          🟢 Müsait Domainler{' '}
          <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#71717a' }}>({filtered.length})</Text>
        </Text>
      </View>

      <FilterBar
        length={length} onLengthChange={setLength}
        pattern={pattern} patternMode={patternMode}
        onPatternChange={setPattern} onPatternModeChange={setPatternMode}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DomainCard
            item={item}
            onFavorite={toggleFavorite}
            onPress={id => router.push(`/domain/${id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: '#52525b', textAlign: 'center', marginTop: 64 }}>
            {domains.length === 0 ? 'Henüz müsait domain bulunamadı' : 'Filtreye uyan domain yok'}
          </Text>
        }
      />

    </SafeAreaView>
  );
}
