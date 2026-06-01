import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useAvailable } from '../../lib/useAvailable';
import { ScoreBar } from '../../components/ScoreBar';
import { scoreDomain } from '../../lib/scoring';

export default function DomainDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { domains, toggleFavorite, setNote } = useAvailable();
  const item = domains.find(d => d.id === id);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item?.note ?? '');

  if (!item) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#71717a' }}>Domain bulunamadı</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#10b981' }}>← Geri</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const score = scoreDomain(item.domain);

  const saveNote = () => {
    setNote(item.id, noteText);
    setEditingNote(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>{item.domain}</Text>
          <Text style={{ fontSize: 13, color: '#71717a' }}>
            {item.length}-karakter · Bulundu: {new Date(item.found_at).toLocaleString('tr-TR')}
          </Text>
        </View>

        <View style={{ backgroundColor: '#09090b', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>Domain Skoru</Text>
          <ScoreBar score={score} />
        </View>

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id, !item.favorited)}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            borderRadius: 12, paddingVertical: 12, marginBottom: 16,
            backgroundColor: item.favorited ? '#422006' : '#09090b',
          }}
        >
          <Text style={{ fontSize: 20 }}>{item.favorited ? '⭐' : '☆'}</Text>
          <Text style={{ fontWeight: '600', color: item.favorited ? '#fde68a' : '#a1a1aa' }}>
            {item.favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          </Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: '#09090b', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: '#a1a1aa' }}>Not</Text>
            {!editingNote && (
              <TouchableOpacity onPress={() => { setNoteText(item.note); setEditingNote(true); }}>
                <Text style={{ fontSize: 12, color: '#10b981' }}>Düzenle</Text>
              </TouchableOpacity>
            )}
          </View>
          {editingNote ? (
            <>
              <TextInput
                style={{ color: '#fff', fontSize: 13, backgroundColor: '#27272a', borderRadius: 8, padding: 12, marginBottom: 8 }}
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Bu domain hakkında not..."
                placeholderTextColor="#52525b"
                multiline
                autoFocus
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={saveNote} style={{ flex: 1, backgroundColor: '#059669', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingNote(false)} style={{ flex: 1, backgroundColor: '#27272a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#a1a1aa', fontSize: 13 }}>İptal</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ color: '#d4d4d8', fontSize: 13 }}>{item.note || 'Not yok'}</Text>
          )}
        </View>

        <View style={{ gap: 12, paddingBottom: 32 }}>
          {[
            { label: '📋 Kopyala', action: () => Clipboard.setStringAsync(item.domain) },
            { label: '🛒 Namecheap\'te Aç', action: () => Linking.openURL(`https://www.namecheap.com/domains/registration/results/?domain=${item.domain}`) },
            { label: '🛒 GoDaddy\'de Aç', action: () => Linking.openURL(`https://www.godaddy.com/domainsearch/find?domainToCheck=${item.domain}`) },
            { label: '🔍 WHOIS Sorgula', action: () => Linking.openURL(`https://whois.domaintools.com/${item.domain}`) },
          ].map(a => (
            <TouchableOpacity
              key={a.label}
              onPress={a.action}
              style={{ backgroundColor: '#09090b', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#d4d4d8', fontSize: 14 }}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
