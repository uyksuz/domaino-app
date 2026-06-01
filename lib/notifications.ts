import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { ref, set } from 'firebase/database';
import { db } from './firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  await set(ref(db, '/push_token'), token);
  return token;
}

export function useNotificationNavigation(
  onDomainNotification: (domain: string) => void
) {
  const response = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (!response) return;
    const domain = response.notification.request.content.data?.domain as string | undefined;
    if (domain) onDomainNotification(domain);
  }, [response]);
}
