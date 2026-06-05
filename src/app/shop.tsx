import { StyleSheet, Text, View } from 'react-native';

import { SHOP_BOOSTERS, useGameApp } from '@/features/game-app-context';
import { AppIcon, BadgePill, HeaderButton, IconRow, InfoPanel, MobileShell } from '@/features/navigation/mobile-shell';
import { elevations, tokens } from '@/features/theme';

export default function ShopScreen() {
  const { buyBooster, isAdminBuild, state } = useGameApp();

  return (
    <MobileShell
      activeTab="shop"
      header={
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <BadgePill
              iconFallback="$"
              iconName={{ ios: 'creditcard.fill', android: 'toll', web: 'toll' }}
              label="Wallet"
              tone="butter"
              value={String(state.coins)}
            />
            <BadgePill
              iconFallback="✓"
              iconName={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
              label={isAdminBuild ? 'QA loadout' : 'Live prices'}
              tone={isAdminBuild ? 'mint' : 'blush'}
            />
          </View>

          <Text style={styles.title}>A softer shelf for real gameplay boosts.</Text>
          <Text style={styles.subtitle}>
            Every booster changes an actual run now, so the shop needs to feel like part of the game loop, not a stub.
          </Text>
        </View>
      }>
      <InfoPanel style={styles.infoPanel}>
        <IconRow
          iconFallback="✦"
          iconName={{ ios: 'wand.and.stars', android: 'auto_fix_high', web: 'auto_fix_high' }}
          subtitle="Freeze, undo, shuffle, and magnet all connect to live game actions."
          title="Everything here works"
        />
      </InfoPanel>

      <View style={styles.boosterList}>
        {SHOP_BOOSTERS.map((booster) => (
          <View key={booster.key} style={styles.boosterCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.boosterTop}>
                <View style={styles.boosterEmojiWrap}>
                  <Text style={styles.boosterEmoji}>{booster.emoji}</Text>
                </View>
                <View style={styles.boosterCopy}>
                  <Text style={styles.boosterTitle}>{booster.title}</Text>
                  <Text style={styles.boosterDescription}>{booster.description}</Text>
                </View>
              </View>

              <View style={styles.pricePill}>
                <Text style={styles.priceValue}>{isAdminBuild ? 'Free' : `${booster.cost}`}</Text>
              </View>
            </View>

            <View style={styles.stockRow}>
              <View style={styles.stockPill}>
                <AppIcon
                  fallback="◉"
                  name={{ ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' }}
                  size={14}
                  tintColor="#7d6658"
                />
                <Text style={styles.stockLabel}>Owned {state.boosters[booster.key]}</Text>
              </View>

              <HeaderButton
                iconFallback="+"
                iconName={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' }}
                label={isAdminBuild ? 'Add to QA' : 'Buy now'}
                onPress={() => buyBooster(booster.key)}
                tone="primary"
              />
            </View>
          </View>
        ))}
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    color: tokens.text,
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 35,
    maxWidth: 330,
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 360,
  },
  infoPanel: {
    backgroundColor: '#fff3ea',
    borderColor: '#efd8c3',
  },
  boosterList: {
    gap: 14,
  },
  boosterCard: {
    ...elevations.card,
    backgroundColor: tokens.surface,
    borderColor: tokens.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  cardTopRow: {
    gap: 14,
  },
  boosterTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  boosterEmojiWrap: {
    alignItems: 'center',
    backgroundColor: tokens.surfaceStrong,
    borderColor: tokens.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  boosterEmoji: {
    fontSize: 26,
  },
  boosterCopy: {
    flex: 1,
    gap: 4,
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
  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7ead0',
    borderColor: '#ead4a3',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceValue: {
    color: tokens.text,
    fontSize: 13,
    fontWeight: '800',
  },
  stockRow: {
    gap: 12,
  },
  stockPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: tokens.surfaceMuted,
    borderColor: tokens.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stockLabel: {
    color: tokens.subtleText,
    fontSize: 13,
    fontWeight: '700',
  },
});
