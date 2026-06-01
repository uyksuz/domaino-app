import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export type LengthFilter = 'all' | '3' | '4' | '5';
export type PatternMode = 'starts' | 'contains' | 'ends';

interface Props {
  length: LengthFilter;
  onLengthChange: (l: LengthFilter) => void;
  pattern: string;
  patternMode: PatternMode;
  onPatternChange: (p: string) => void;
  onPatternModeChange: (m: PatternMode) => void;
}

const LENGTHS: LengthFilter[] = ['all', '3', '4', '5'];
const MODES: PatternMode[] = ['starts', 'contains', 'ends'];
const MODE_LABELS: Record<PatternMode, string> = {
  starts: 'Başlar',
  contains: 'İçerir',
  ends: 'Biter',
};

export function FilterBar({
  length, onLengthChange,
  pattern, patternMode,
  onPatternChange, onPatternModeChange,
}: Props) {
  return (
    <View style={{ paddingHorizontal: 16, gap: 8, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {LENGTHS.map(l => (
          <TouchableOpacity
            key={l}
            onPress={() => onLengthChange(l)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              backgroundColor: length === l ? '#10b981' : '#27272a',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: length === l ? '#fff' : '#a1a1aa' }}>
              {l === 'all' ? 'Tümü' : `${l} Harf`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {MODES.map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => onPatternModeChange(m)}
              style={{
                paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
                backgroundColor: patternMode === m ? '#3f3f46' : '#18181b',
              }}
            >
              <Text style={{ fontSize: 10, color: '#d4d4d8' }}>{MODE_LABELS[m]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={{
            flex: 1, backgroundColor: '#27272a', borderRadius: 8,
            paddingHorizontal: 12, paddingVertical: 6, color: '#fff', fontSize: 14,
          }}
          placeholder="filtrele..."
          placeholderTextColor="#71717a"
          value={pattern}
          onChangeText={onPatternChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
