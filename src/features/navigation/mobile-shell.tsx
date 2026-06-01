import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenStyles, tokens } from '@/features/theme';

type NavKey = 'home' | 'games' | 'shop' | 'settings';

const NAV_ITEMS: { href: '/games' | '/settings' | '/shop' | '/'; icon: string; key: NavKey; label: string }[] = [
  { href: '/', icon: '🏠', key: 'home', label: 'Home' },
  { href: '/games', icon: '🎮', key: 'games', label: 'Games' },
  { href: '/shop', icon: '🛍️', key: 'shop', label: 'Shop' },
  { href: '/settings', icon: '⚙️', key: 'settings', label: 'Settings' },
];

export function MobileShell({
  activeTab,
  children,
  header,
}: PropsWithChildren<{ activeTab: NavKey; header?: ReactNode }>) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <View style={styles.frame}>
        <ScrollView
          contentContainerStyle={[
            screenStyles.scrollContent,
            { paddingBottom: 116 + Math.max(insets.bottom, 12) },
          ]}>
          {header}
          {children}
        </ScrollView>

        <View pointerEvents="box-none" style={styles.navOuter}>
          <View style={[styles.navCard, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <View style={styles.navInner}>
              {NAV_ITEMS.map((item) => {
                const active = item.key === activeTab;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    onPress={() => {
                      if (!active) {
                        router.replace(item.href);
                      }
                    }}
                    style={({ pressed }) => [
                      styles.navButton,
                      active && styles.navButtonActive,
                      pressed && styles.navButtonPressed,
                    ]}>
                    <Text style={styles.navIcon}>{item.icon}</Text>
                    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function HeaderButton({
  label,
  onPress,
  tone = 'secondary',
}: {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        tone === 'primary' ? styles.headerButtonPrimary : styles.headerButtonSecondary,
        pressed && styles.headerButtonPressed,
      ]}>
      <Text style={[styles.headerButtonLabel, tone === 'primary' && styles.headerButtonLabelPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function InfoPanel({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.infoPanel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
  },
  navOuter: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  navCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(247, 239, 226, 0.96)',
    borderTopWidth: 1,
    borderTopColor: '#e7d7c4',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  navInner: {
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    maxWidth: 460,
    padding: 8,
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 20,
    flex: 1,
    gap: 4,
    minHeight: 64,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: tokens.surfaceStrong,
  },
  navButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    color: tokens.subtleText,
    fontSize: 11,
    fontWeight: '700',
  },
  navLabelActive: {
    color: tokens.text,
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButtonPrimary: {
    backgroundColor: tokens.pink,
    borderColor: '#e1b1bf',
  },
  headerButtonSecondary: {
    backgroundColor: '#fbf4eb',
    borderColor: tokens.border,
  },
  headerButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  headerButtonLabel: {
    color: tokens.text,
    fontSize: 15,
    fontWeight: '800',
  },
  headerButtonLabelPrimary: {
    color: '#745463',
  },
  infoPanel: {
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
});
