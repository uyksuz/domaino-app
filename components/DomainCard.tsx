import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Clipboard from 'expo-clipboard';
import { AvailableDomain } from '../types';
import { scoreDomain } from '../lib/scoring';
import { ScoreBar } from './ScoreBar';

const SWIPE_THRESHOLD = 80;

interface Props {
  item: AvailableDomain;
  onFavorite: (id: string, favorited: boolean) => void;
  onPress: (id: string) => void;
}

export function DomainCard({ item, onFavorite, onPress }: Props) {
  const score = scoreDomain(item.domain);
  const translateX = useSharedValue(0);

  const copyDomain = () => Clipboard.setStringAsync(item.domain);

  const pan = Gesture.Pan()
    .onUpdate(e => { translateX.value = e.translationX; })
    .onEnd(e => {
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(onFavorite)(item.id, !item.favorited);
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(copyDomain)();
      }
      translateX.value = withSpring(0);
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[animStyle, { marginHorizontal: 16, marginBottom: 8 }]}>
        <TouchableOpacity
          onPress={() => onPress(item.id)}
          style={{ backgroundColor: '#09090b', borderRadius: 12, padding: 16 }}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{item.domain}</Text>
            <TouchableOpacity onPress={() => onFavorite(item.id, !item.favorited)}>
              <Text style={{ fontSize: 20 }}>{item.favorited ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          </View>

          <ScoreBar score={score} compact />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 11, color: '#71717a' }}>
              {new Date(item.found_at).toLocaleDateString('tr-TR')}
            </Text>
            <Text style={{ fontSize: 11, color: '#52525b' }}>← kopyala · favori →</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}
