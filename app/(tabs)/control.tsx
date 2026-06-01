import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import { ControlSettings } from '../../types';

export default function ControlScreen() {
  const [settings, setSettings] = useState<ControlSettings>({
    command: 'run',
    slice: 50000,
    concurrency: 100,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(db, '/control'), snap => {
      const val = snap.val();
      if (val) setSettings({
        command: val.command ?? 'run',
        slice: val.slice ?? 50000,
        concurrency: val.concurrency ?? 100,
      });
    });
    return unsub;
  }, []);

  const save = async () => {
    await set(ref(db, '/control'), settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>⚙️ Kontrol Paneli</Text>
        </View>

        <View style={{ backgroundColor: '#09090b', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Scanner Durumu</Text>
              <Text style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                {settings.command === 'run' ? '🟢 Çalışıyor' : '🔴 Durduruldu'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSettings(s => ({ ...s, command: s.command === 'run' ? 'stop' : 'run' }))}
              style={{
                paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
                backgroundColor: settings.command === 'run' ? '#450a0a' : '#052e16',
              }}
            >
              <Text style={{ fontWeight: '600', color: settings.command === 'run' ? '#fca5a5' : '#6ee7b7' }}>
                {settings.command === 'run' ? '⏹ Durdur' : '▶ Başlat'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: '#09090b', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Günlük 5-Char Dilim</Text>
            <Text style={{ color: '#10b981', fontWeight: 'bold' }}>{settings.slice.toLocaleString()}</Text>
          </View>
          <Slider
            minimumValue={10000}
            maximumValue={200000}
            step={5000}
            value={settings.slice}
            onValueChange={v => setSettings(s => ({ ...s, slice: Math.round(v) }))}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#27272a"
            thumbTintColor="#10b981"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 11, color: '#52525b' }}>10k</Text>
            <Text style={{ fontSize: 11, color: '#52525b' }}>200k</Text>
          </View>
        </View>

        <View style={{ backgroundColor: '#09090b', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>DNS Concurrency</Text>
            <Text style={{ color: '#10b981', fontWeight: 'bold' }}>{settings.concurrency}</Text>
          </View>
          <Slider
            minimumValue={50}
            maximumValue={500}
            step={25}
            value={settings.concurrency}
            onValueChange={v => setSettings(s => ({ ...s, concurrency: Math.round(v) }))}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#27272a"
            thumbTintColor="#10b981"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 11, color: '#52525b' }}>50</Text>
            <Text style={{ fontSize: 11, color: '#52525b' }}>500</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={save}
          style={{
            marginHorizontal: 16, paddingVertical: 16, borderRadius: 12, alignItems: 'center',
            backgroundColor: saved ? '#065f46' : '#059669',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            {saved ? '✓ Kaydedildi' : 'Kaydet'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
