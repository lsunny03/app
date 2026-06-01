import { StyleSheet } from 'react-native';

export const tokens = {
  background: '#f6efe6',
  surface: '#fffaf4',
  surfaceMuted: '#f9f1e8',
  surfaceStrong: '#f1e4d4',
  text: '#60493b',
  subtleText: '#917868',
  cyan: '#c6e1e3',
  gold: '#f2dca5',
  pink: '#e8bdca',
  green: '#cadfca',
  danger: '#d98f8e',
  border: '#e5d2bf',
  borderStrong: '#d8c0a8',
  lavender: '#dbcee8',
  peach: '#f3d7c0',
  cream: '#f8f2ea',
  shadow: '#7b6555',
} as const;

export const elevations = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: tokens.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
});

export const screenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },
});
