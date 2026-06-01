import { StyleSheet } from 'react-native';

export const tokens = {
  background: '#10131f',
  surface: '#171c2b',
  surfaceStrong: '#1d2234',
  text: '#f5f7ff',
  subtleText: '#98a3c7',
  cyan: '#61dafb',
  gold: '#ffd65c',
  pink: '#ff7da5',
  green: '#61d394',
  danger: '#ff6b7a',
  border: '#2a3148',
} as const;

export const screenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 20,
  },
});
