import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  type RewardedAdReward,
} from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { Platform } from 'react-native';

import { IS_ADMIN_BUILD } from './app-variant';

export type RewardedAdResult = {
  completed: boolean;
  message?: string;
};

const rewardedUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID_ANDROID || TestIds.REWARDED,
      ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID_IOS || TestIds.REWARDED,
      default: TestIds.REWARDED,
    });

let initializationPromise: Promise<void> | null = null;

export const REWARDED_ADS_SUPPORTED = !IS_ADMIN_BUILD;

async function ensureMobileAdsReady() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      if (Platform.OS === 'ios') {
        const permission = await getTrackingPermissionsAsync();
        if (permission.status === 'undetermined') {
          await requestTrackingPermissionsAsync();
        }
      }

      await mobileAds().initialize();
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

export async function showSponsoredBonusAd(): Promise<RewardedAdResult> {
  if (!REWARDED_ADS_SUPPORTED) {
    return {
      completed: false,
      message: 'Rewarded ads are disabled in the admin build.',
    };
  }

  await ensureMobileAdsReady();

  return new Promise((resolve) => {
    const rewarded = RewardedAd.createForAdRequest(rewardedUnitId);
    let earnedReward: RewardedAdReward | null = null;

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        earnedReward = reward;
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      cleanup();
      resolve(
        earnedReward
          ? { completed: true }
          : {
              completed: false,
              message: 'Finish the rewarded ad to claim the bonus.',
            }
      );
    });

    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      cleanup();
      resolve({
        completed: false,
        message: error.message || 'Rewarded ad failed to load.',
      });
    });

    const cleanup = () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };

    rewarded.load();
  });
}
