import { SymbolView, type SymbolViewProps } from 'expo-symbols';
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

import { elevations, screenStyles, tokens } from '@/features/theme';

type NavKey = 'home' | 'games' | 'shop' | 'settings';
type IconName = SymbolViewProps['name'];
type BadgeTone = 'blush' | 'butter' | 'lavender' | 'mint' | 'neutral' | 'sky';

const NAV_ITEMS: {
  fallback: string;
  href: '/games' | '/settings' | '/shop' | '/';
  icon: IconName;
  key: NavKey;
  label: string;
}[] = [
  {
    href: '/',
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
    fallback: '⌂',
    key: 'home',
    label: 'Home',
  },
  {
    href: '/games',
    icon: { ios: 'gamecontroller.fill', android: 'sports_esports', web: 'sports_esports' },
    fallback: '◉',
    key: 'games',
    label: 'Games',
  },
  {
    href: '/shop',
    icon: { ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' },
    fallback: '□',
    key: 'shop',
    label: 'Shop',
  },
  {
    href: '/settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
    fallback: '○',
    key: 'settings',
    label: 'Settings',
  },
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
            { paddingBottom: 118 + Math.max(insets.bottom, 14) },
          ]}>
          {header}
          {children}
        </ScrollView>

        <View style={styles.navOuter}>
          <View style={[styles.navCard, { paddingBottom: Math.max(insets.bottom, 14) }]}>
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
                    <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
                      <AppIcon
                        fallback={item.fallback}
                        name={item.icon}
                        size={18}
                        tintColor={active ? '#6b5260' : '#907a6d'}
                      />
                    </View>
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

export function AppIcon({
  fallback,
  name,
  size = 18,
  style,
  tintColor = tokens.text,
}: {
  fallback: string;
  name: IconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
}) {
  return (
    <View style={style}>
      <SymbolView
        fallback={<Text style={[styles.iconFallback, { color: tintColor, fontSize: size - 1 }]}>{fallback}</Text>}
        name={name}
        size={size}
        tintColor={tintColor}
        weight="medium"
      />
    </View>
  );
}

export function BadgePill({
  iconFallback,
  iconName,
  label,
  tone = 'neutral',
  value,
}: {
  iconFallback?: string;
  iconName?: IconName;
  label: string;
  tone?: BadgeTone;
  value?: string;
}) {
  return (
    <View style={[styles.badgePill, badgeToneStyles[tone]]}>
      {iconName && iconFallback ? (
        <View style={styles.badgeIconWrap}>
          <AppIcon fallback={iconFallback} name={iconName} size={14} tintColor="#755f54" />
        </View>
      ) : null}
      <Text style={styles.badgeLabel}>{label}</Text>
      {value ? <Text style={styles.badgeValue}>{value}</Text> : null}
    </View>
  );
}

export function HeaderButton({
  iconFallback,
  iconName,
  label,
  onPress,
  tone = 'secondary',
}: {
  iconFallback?: string;
  iconName?: IconName;
  label: string;
  onPress: () => void;
  tone?: 'ghost' | 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        tone === 'primary'
          ? styles.headerButtonPrimary
          : tone === 'ghost'
            ? styles.headerButtonGhost
            : styles.headerButtonSecondary,
        pressed && styles.headerButtonPressed,
      ]}>
      {iconName && iconFallback ? (
        <AppIcon
          fallback={iconFallback}
          name={iconName}
          size={16}
          tintColor={tone === 'primary' ? '#765565' : tokens.text}
        />
      ) : null}
      <Text
        style={[
          styles.headerButtonLabel,
          tone === 'primary' && styles.headerButtonLabelPrimary,
          tone === 'ghost' && styles.headerButtonLabelGhost,
        ]}>
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

export function IconRow({
  iconFallback,
  iconName,
  subtitle,
  title,
}: {
  iconFallback: string;
  iconName: IconName;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.iconRow}>
      <View style={styles.iconRowBadge}>
        <AppIcon fallback={iconFallback} name={iconName} size={18} tintColor="#735f53" />
      </View>
      <View style={styles.iconRowCopy}>
        <Text style={styles.iconRowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.iconRowSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const badgeToneStyles = StyleSheet.create<Record<BadgeTone, ViewStyle>>({
  blush: { backgroundColor: '#f4e2e8' },
  butter: { backgroundColor: '#f7ebc9' },
  lavender: { backgroundColor: '#ebe2f3' },
  mint: { backgroundColor: '#e4eee2' },
  neutral: { backgroundColor: '#f3eadf' },
  sky: { backgroundColor: '#e3eef2' },
});

const styles = StyleSheet.create({
  frame: {
    flex: 1,
  },
  iconFallback: {
    fontWeight: '700',
    textAlign: 'center',
  },
  badgePill: {
    alignItems: 'center',
    borderColor: tokens.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeIconWrap: {
    alignItems: 'center',
    backgroundColor: '#ffffffaa',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  badgeLabel: {
    color: tokens.text,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeValue: {
    color: tokens.subtleText,
    fontSize: 12,
    fontWeight: '700',
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  headerButtonPrimary: {
    backgroundColor: tokens.pink,
    borderColor: '#ddb2bf',
  },
  headerButtonSecondary: {
    backgroundColor: tokens.surface,
    borderColor: tokens.borderStrong,
  },
  headerButtonGhost: {
    backgroundColor: '#ffffff90',
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
    color: '#765565',
  },
  headerButtonLabelGhost: {
    color: '#7f695a',
  },
  infoPanel: {
    ...elevations.card,
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  iconRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconRowBadge: {
    alignItems: 'center',
    backgroundColor: tokens.surfaceStrong,
    borderColor: tokens.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconRowCopy: {
    flex: 1,
    gap: 2,
  },
  iconRowTitle: {
    color: tokens.text,
    fontSize: 17,
    fontWeight: '800',
  },
  iconRowSubtitle: {
    color: tokens.subtleText,
    fontSize: 13,
    lineHeight: 18,
  },
  navOuter: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  navCard: {
    alignItems: 'center',
    backgroundColor: '#f6efe6f2',
    borderTopColor: '#eadbca',
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  navInner: {
    ...elevations.card,
    backgroundColor: '#fff9f4',
    borderColor: tokens.border,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    maxWidth: 460,
    padding: 8,
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 22,
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    minHeight: 68,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: '#f2e6d7',
  },
  navButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  navIconWrap: {
    alignItems: 'center',
    backgroundColor: '#f4ebdf',
    borderRadius: 14,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  navIconWrapActive: {
    backgroundColor: '#ead6de',
  },
  navLabel: {
    color: tokens.subtleText,
    fontSize: 11,
    fontWeight: '700',
  },
  navLabelActive: {
    color: tokens.text,
  },
});
