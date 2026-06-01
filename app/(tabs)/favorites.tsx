import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Linking, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useAvailable } from '../../lib/useAvailable';
import { ScoreBar } from '../../components/ScoreBar';
import { scoreDomain } from '../../lib/scoring';
import { AvailableDomain } from '../../types';

function FavoriteCard({
  item,
  onUnfavorite,
  onPress,
}: {
  item: AvailableDomain;
  onUnfavorite: () => void;
  onPress: () => void;
}) {
  const score = scoreDomain(item.domain);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: '#09090b', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16 }}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{item.domain}</Text>
        <TouchableOpacity onPress={onUnfavorite}>
          <Text style={{ fontSize: 20 }}>⭐</Text>
        </TouchableOpacity>
      </View>

      <ScoreBar score={score} />

      {item.note ? (
        <View style={{ marginTop: 8, backgroundColor: '#27272a', borderRadius: 8, padding: 8 }}>
          <Text style={{ fontSize: 12, color: '#d4d4d8' }}>{item.note}</Text>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => Clipboard.setStringAsync(item.domain)}
          style={{ flex: 1, backgroundColor: '#27272a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 12, color: '#d4d4d8' }}>📋 Kopyala</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`https://www.namecheap.com/domains/registration/results/?domain=${item.domain}`)}
          style={{ flex: 1, backgroundColor: '#27272a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 12, color: '#d4d4d8' }}>🔗 Namecheap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`https://www.godaddy.com/domainsearch/find?domainToCheck=${item.domain}`)}
          style={{ flex: 1, backgroundColor: '#27272a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 12, color: '#d4d4d8' }}>🔗 GoDaddy</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const { domains, toggleFavorite } = useAvailable();
  const router = useRouter();
  const favorites = domains.filter(d => d.favorited);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
          ⭐ Favoriler{' '}
          <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#71717a' }}>({favorites.length})</Text>
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FavoriteCard
            item={item}
            onUnfavorite={() => toggleFavorite(item.id, false)}
            onPress={() => router.push(`/domain/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: '#52525b', textAlign: 'center', marginTop: 64, lineHeight: 24 }}>
            Henüz favori domain yok.{'\n'}Available ekranında → sağa kaydır
          </Text>
        }
      />
    </SafeAreaView>
  );
}
