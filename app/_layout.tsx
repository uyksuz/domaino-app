import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerForPushNotifications, useNotificationNavigation } from '../lib/notifications';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  useNotificationNavigation((domain) => {
    router.push(`/domain/${encodeURIComponent(domain)}`);
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="domain/[id]"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Domain Detay',
            headerStyle: { backgroundColor: '#09090b' },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
