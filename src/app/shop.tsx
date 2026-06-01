import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SHOP_BOOSTERS, useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function ShopScreen() {
  const { buyBooster, isAdminBuild, state } = useGameApp();

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <ScrollView contentContainerStyle={screenStyles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Shop</Text>
            <Text style={styles.subtitle}>
              Buy real gameplay boosts with coins, or keep them included in the admin build.
            </Text>
          </View>
          <View style={styles.wallet}>
            <Text style={styles.walletLabel}>Coins</Text>
            <Text style={styles.walletValue}>{state.coins}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boost inventory</Text>
          <Text style={styles.sectionBody}>
            Every boost below now changes the game it belongs to instead of sitting idle in storage.
          </Text>
          <View style={styles.boosterList}>
            {SHOP_BOOSTERS.map((booster) => (
              <View key={booster.key} style={styles.boosterCard}>
                <View style={styles.boosterTop}>
                  <Text style={styles.boosterEmoji}>{booster.emoji}</Text>
                  <View style={styles.boosterText}>
                    <Text style={styles.boosterTitle}>{booster.title}</Text>
                    <Text style={styles.boosterDescription}>{booster.description}</Text>
                  </View>
                </View>

                <View style={styles.boosterFooter}>
                  <Text style={styles.stockLabel}>
                    Owned {state.boosters[booster.key]} ·{' '}
                    {isAdminBuild ? 'Included in admin build' : `${booster.cost} coins`}
                  </Text>
                  <Pressable onPress={() => buyBooster(booster.key)} style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>{isAdminBuild ? 'Add' : 'Buy'}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monetization layout</Text>
          <View style={styles.monetizationCard}>
            <Text style={styles.planTitle}>Consumer build</Text>
            <Text style={styles.planBody}>
              Rewarded ads grant bonus coins on supported mobile builds, while boosters use soft
              currency earned in play.
            </Text>
          </View>
          <View style={styles.monetizationCard}>
            <Text style={styles.planTitle}>Admin build</Text>
            <Text style={styles.planBody}>
              Admin builds remove rewarded ads entirely and keep booster access friction-free for QA.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fbf4eb',
    borderWidth: 1,
    borderColor: tokens.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  backLabel: {
    color: tokens.text,
    fontSize: 14,
    fontWeight: '700',
  },
  headerText: {
    gap: 8,
  },
  title: {
    color: tokens.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: tokens.subtleText,
    fontSize: 15,
    lineHeight: 22,
  },
  wallet: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7e4b7',
    borderWidth: 1,
    borderColor: '#ead3a0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 110,
  },
  walletLabel: {
    color: '#92724f',
    fontSize: 12,
    fontWeight: '700',
  },
  walletValue: {
    color: tokens.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    color: tokens.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionBody: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
  boosterList: {
    gap: 12,
  },
  boosterCard: {
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  boosterTop: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  boosterEmoji: {
    fontSize: 28,
  },
  boosterText: {
    flex: 1,
    gap: 4,
  },
  boosterTitle: {
    color: tokens.text,
    fontSize: 17,
    fontWeight: '800',
  },
  boosterDescription: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
  boosterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  stockLabel: {
    color: tokens.subtleText,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  buyButton: {
    backgroundColor: tokens.pink,
    borderWidth: 1,
    borderColor: '#e1b1bf',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buyButtonText: {
    color: '#745463',
    fontSize: 14,
    fontWeight: '800',
  },
  monetizationCard: {
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.border,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  planTitle: {
    color: tokens.text,
    fontSize: 17,
    fontWeight: '800',
  },
  planBody: {
    color: tokens.subtleText,
    fontSize: 14,
    lineHeight: 20,
  },
});
