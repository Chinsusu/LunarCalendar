/**
 * Root Layout
 * @lunar-calendar/mobile
 */

import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type ExtendedTheme = Theme & {
  fonts: {
    regular: { fontFamily: string; fontWeight: string };
    medium: { fontFamily: string; fontWeight: string };
    bold: { fontFamily: string; fontWeight: string };
  };
};

const navigationTheme: ExtendedTheme = {
  ...DefaultTheme,
  fonts: {
    regular: {
      fontFamily: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }) ?? 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }) ?? 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'System' }) ?? 'System',
      fontWeight: '700',
    },
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navigationTheme}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
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
              headerShown: false,
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
    </ThemeProvider>
  );
}
