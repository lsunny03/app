export type AppVariant = 'consumer' | 'admin';

export const APP_VARIANT: AppVariant =
  process.env.EXPO_PUBLIC_APP_VARIANT === 'admin' ? 'admin' : 'consumer';

export const IS_ADMIN_BUILD = APP_VARIANT === 'admin';
export const MONETIZATION_ENABLED = !IS_ADMIN_BUILD;
