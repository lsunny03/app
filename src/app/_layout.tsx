import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GameAppProvider } from '@/features/game-app-context';
import { tokens } from '@/features/theme';

export default function RootLayout() {
  return (
    <GameAppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.background },
          animation: 'slide_from_right',
        }}
      />
    </GameAppProvider>
  );
}
