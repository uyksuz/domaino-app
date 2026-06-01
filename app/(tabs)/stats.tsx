import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useStats } from '../../lib/useStats';
import { useAvailable } from '../../lib/useAvailable';

const SCREEN_W = Dimensions.get('window').width;

export default function StatsScreen() {
  const stats = useStats();
  const { domains } = useAvailable();

  const breakdown: Record<number, number> = { 3: 0, 4: 0, 5: 0 };
  domains.forEach(d => { if (d.length in breakdown) breakdown[d.length]++; });

  const history = stats?.history?.slice(-14) ?? [];
  const chartData = {
    labels: history.map(h => h.date.slice(5)),
    datasets: [{ data: history.length > 0 ? history.map(h => h.count) : [0] }],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>📊 İstatistikler</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 24 }}>
          {[
            { label: 'Toplam', value: stats?.total_found ?? 0, color: '#10b981' },
            { label: 'Bugün', value: stats?.today_found ?? 0, color: '#f59e0b' },
            { label: 'Favoriler', value: domains.filter(d => d.favorited).length, color: '#6366f1' },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: '#09090b', borderRadius: 12, padding: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: s.color }}>{s.value}</Text>
              <Text style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 10 }}>Karakter bazlı dağılım</Text>
          {([3, 4, 5] as const).map(len => (
            <View key={len} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Text style={{ color: '#a1a1aa', width: 44, fontSize: 13 }}>{len} harf</Text>
              <View style={{ flex: 1, height: 12, backgroundColor: '#27272a', borderRadius: 6, overflow: 'hidden' }}>
                <View style={{
                  height: '100%', backgroundColor: '#10b981', borderRadius: 6,
                  width: `${domains.length > 0 ? (breakdown[len] / domains.length) * 100 : 0}%`,
                }} />
              </View>
              <Text style={{ color: '#71717a', fontSize: 12, width: 24, textAlign: 'right' }}>{breakdown[len]}</Text>
            </View>
          ))}
        </View>

        {history.length > 0 && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 8 }}>Son 14 gün</Text>
            <BarChart
              data={chartData}
              width={SCREEN_W - 32}
              height={180}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#09090b',
                backgroundGradientFrom: '#09090b',
                backgroundGradientTo: '#09090b',
                color: () => '#10b981',
                labelColor: () => '#71717a',
                barPercentage: 0.6,
                decimalPlaces: 0,
              }}
              style={{ borderRadius: 12 }}
            />
          </View>
        )}

        {stats?.last_run && (
          <Text style={{ fontSize: 11, color: '#3f3f46', textAlign: 'center', marginTop: 16, paddingBottom: 32 }}>
            Son tarama: {new Date(stats.last_run).toLocaleString('tr-TR')}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
