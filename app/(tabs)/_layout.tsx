import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#09090b', borderTopColor: '#27272a' },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#71717a',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Canlı',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="available"
        options={{
          title: 'Müsait',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🟢" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'İstatistik',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
          title: 'Kontrol',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
