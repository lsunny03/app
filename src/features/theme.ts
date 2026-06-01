import { StyleSheet } from 'react-native';

export const tokens = {
  background: '#f7efe2',
  surface: '#fffaf3',
  surfaceStrong: '#f2e6d7',
  text: '#644d3f',
  subtleText: '#9b806d',
  cyan: '#b5d7d1',
  gold: '#efcf92',
  pink: '#efbcc9',
  green: '#bfd8bb',
  danger: '#d98f8e',
  border: '#e4d2bf',
  lavender: '#d9c8e8',
  peach: '#f5d6bf',
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
