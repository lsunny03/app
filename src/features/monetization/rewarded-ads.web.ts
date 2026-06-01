export type RewardedAdResult = {
  completed: boolean;
  message?: string;
};

export const REWARDED_ADS_SUPPORTED = false;

export async function showSponsoredBonusAd(): Promise<RewardedAdResult> {
  return {
    completed: false,
    message: 'Rewarded ads are available in iOS and Android builds.',
  };
}
