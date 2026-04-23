import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let isNotificationHandlerConfigured = false;

function ensureNotificationHandler() {
  if (isNotificationHandlerConfigured) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  isNotificationHandlerConfigured = true;
}

export async function requestLocalNotificationPermissions() {
  if (Platform.OS === "web") return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    ensureNotificationHandler();
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  if (!requested.granted) return false;

  ensureNotificationHandler();
  return true;
}

export async function scheduleLocalNotification(payload: {
  title: string;
  body: string;
}) {
  const granted = await requestLocalNotificationPermissions();
  if (!granted) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      sound: false,
    },
    trigger: null,
  });
}
