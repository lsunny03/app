import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SHOP_BOOSTERS, useGameApp } from '@/features/game-app-context';
import { screenStyles, tokens } from '@/features/theme';

export default function ShopScreen() {
  const { state, buyBooster } = useGameApp();

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
              Soft-currency boosts, monetization surfaces, and an ad-free admin preview.
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
            Spend coins from successful runs, or grant them for free in admin mode.
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
                    Owned {state.boosters[booster.key]} · {state.adminMode ? 'Free' : `${booster.cost} coins`}
                  </Text>
                  <Pressable
                    onPress={() => buyBooster(booster.key)}
                    style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>{state.adminMode ? 'Grant' : 'Buy'}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monetization layout</Text>
          <View style={styles.monetizationCard}>
            <Text style={styles.planTitle}>Free player loop</Text>
            <Text style={styles.planBody}>
              Sponsored bonus prompts and optional premium upsell screens keep the default build
              free to install while preserving short session flow.
            </Text>
          </View>
          <View style={styles.monetizationCard}>
            <Text style={styles.planTitle}>Premium / admin lane</Text>
            <Text style={styles.planBody}>
              Admin mode disables ads, unlocks premium previews, and removes booster costs so QA
              and content tuning stay friction-free.
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
    backgroundColor: tokens.surface,
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
    backgroundColor: '#372f17',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 110,
  },
  walletLabel: {
    color: '#dbcf9b',
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
    backgroundColor: tokens.gold,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buyButtonText: {
    color: '#2b2200',
    fontSize: 14,
    fontWeight: '800',
  },
  monetizationCard: {
    backgroundColor: tokens.surface,
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
