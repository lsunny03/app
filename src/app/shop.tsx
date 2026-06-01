import { StyleSheet, Text, View } from 'react-native';

import { SHOP_BOOSTERS, useGameApp } from '@/features/game-app-context';
import { HeaderButton, InfoPanel, MobileShell } from '@/features/navigation/mobile-shell';
import { tokens } from '@/features/theme';

export default function ShopScreen() {
  const { buyBooster, isAdminBuild, state } = useGameApp();

  return (
    <MobileShell
      activeTab="shop"
      header={
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Booster shelf</Text>
          <Text style={styles.title}>Stock up for the next round.</Text>
          <Text style={styles.subtitle}>
            Soft currency powers the player build while admin keeps everything open for testing.
          </Text>
          <View style={styles.wallet}>
            <Text style={styles.walletLabel}>Coins</Text>
            <Text style={styles.walletValue}>{state.coins}</Text>
          </View>
        </View>
      }>
      <InfoPanel style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Every boost is live now</Text>
        <Text style={styles.infoBody}>
          Freeze, undo, shuffle, and magnet all map to real gameplay actions instead of idle inventory.
        </Text>
      </InfoPanel>

      <View style={styles.boosterList}>
        {SHOP_BOOSTERS.map((booster) => (
          <View key={booster.key} style={styles.boosterCard}>
            <View style={styles.boosterTop}>
              <Text style={styles.boosterEmoji}>{booster.emoji}</Text>
              <View style={styles.boosterCopy}>
                <Text style={styles.boosterTitle}>{booster.title}</Text>
                <Text style={styles.boosterDescription}>{booster.description}</Text>
              </View>
            </View>

            <Text style={styles.stockLabel}>
              Owned {state.boosters[booster.key]} · {isAdminBuild ? 'Included in admin' : `${booster.cost} coins`}
            </Text>

            <HeaderButton
              label={isAdminBuild ? 'Add to QA loadout' : `Buy ${booster.title}`}
              onPress={() => buyBooster(booster.key)}
              tone="primary"
            />
          </View>
        ))}
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 10,
  },
  eyebrow: {
    color: '#a88377',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: tokens.text,
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
  },
  wallet: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7e4b7',
    borderColor: '#ead3a0',
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 126,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  walletLabel: {
    color: '#92724f',
    fontSize: 12,
    fontWeight: '700',
  },
  walletValue: {
    color: tokens.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  infoPanel: {
    backgroundColor: '#fff3ea',
    borderColor: '#efd8c3',
  },
  infoTitle: {
    color: tokens.text,
    fontSize: 18,
    fontWeight: '800',
  },
  infoBody: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  boosterList: {
    gap: 14,
  },
  boosterCard: {
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  boosterTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  boosterEmoji: {
    fontSize: 30,
    marginTop: 4,
  },
  boosterCopy: {
    flex: 1,
    gap: 6,
  },
  boosterTitle: {
    color: tokens.text,
    fontSize: 20,
    fontWeight: '800',
  },
  boosterDescription: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  stockLabel: {
    color: tokens.subtleText,
    fontSize: 14,
    fontWeight: '700',
  },
});
