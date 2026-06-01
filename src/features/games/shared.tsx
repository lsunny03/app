import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/features/theme';

export function GameSurface({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.surface}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  tone = 'secondary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        tone === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}>
      <Text
        style={[
          styles.actionLabel,
          tone === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function StatRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <View style={styles.statRow}>
      {items.map((item) => (
        <View key={item.label} style={styles.statCard}>
          <Text style={styles.statLabel}>{item.label}</Text>
          <Text style={styles.statValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function BoosterRow({
  items,
}: {
  items: {
    disabled?: boolean;
    label: string;
    onPress: () => void;
    tone?: 'primary' | 'secondary';
  }[];
}) {
  return (
    <View style={styles.boosterRow}>
      {items.map((item) => (
        <ActionButton
          key={item.label}
          disabled={item.disabled}
          label={item.label}
          onPress={item.onPress}
          tone={item.tone}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: tokens.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.border,
    padding: 18,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  title: {
    color: tokens.text,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 88,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: tokens.pink,
  },
  secondaryButton: {
    backgroundColor: '#fbf2e8',
  },
  disabledButton: {
    opacity: 0.4,
  },
  pressedButton: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  primaryLabel: {
    color: '#6f5362',
  },
  secondaryLabel: {
    color: tokens.text,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: tokens.surfaceStrong,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 108,
    gap: 3,
  },
  statLabel: {
    color: tokens.subtleText,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    color: tokens.text,
    fontSize: 16,
    fontWeight: '800',
  },
  boosterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
