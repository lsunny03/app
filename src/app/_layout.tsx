import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GameAppProvider } from '@/features/game-app-context';

export default function RootLayout() {
  return (
    <GameAppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#10131f' },
          animation: 'slide_from_right',
        }}
      />
    </GameAppProvider>
  );
}
