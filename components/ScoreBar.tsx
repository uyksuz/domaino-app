import React from 'react';
import { View, Text } from 'react-native';
import { DomainScore } from '../lib/scoring';

function scoreColor(total: number): string {
  if (total >= 80) return '#10b981';
  if (total >= 60) return '#f59e0b';
  return '#ef4444';
}

interface Props {
  score: DomainScore;
  compact?: boolean;
}

export function ScoreBar({ score, compact = false }: Props) {
  const color = scoreColor(score.total);
  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 11, color: '#a1a1aa' }}>Skor</Text>
        <Text style={{ fontSize: 11, fontWeight: 'bold', color }}>{score.total}</Text>
      </View>
      <View style={{ height: 6, backgroundColor: '#27272a', borderRadius: 3, overflow: 'hidden' }}>
        <View style={{ height: '100%', borderRadius: 3, width: `${score.total}%`, backgroundColor: color }} />
      </View>
      {!compact && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={{ fontSize: 10, color: '#71717a' }}>Uzunluk {score.length}</Text>
          <Text style={{ fontSize: 10, color: '#71717a' }}>Okunuş {score.pronounce}</Text>
          <Text style={{ fontSize: 10, color: '#71717a' }}>Hafıza {score.memory}</Text>
        </View>
      )}
    </View>
  );
}
