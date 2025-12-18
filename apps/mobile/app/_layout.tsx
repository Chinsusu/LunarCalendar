/**
 * Root Layout
 * @lunar-calendar/mobile
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#DC2626',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Lịch Âm Việt Nam',
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            title: 'Chi tiết ngày',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Cài đặt',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
