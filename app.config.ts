import type { ExpoConfig } from 'expo/config';

const variant = process.env.EXPO_PUBLIC_APP_VARIANT === 'admin' ? 'admin' : 'consumer';
const isAdminBuild = variant === 'admin';

const androidAdMobAppId =
  process.env.ADMOB_ANDROID_APP_ID ?? 'ca-app-pub-3940256099942544~3347511713';
const iosAdMobAppId =
  process.env.ADMOB_IOS_APP_ID ?? 'ca-app-pub-3940256099942544~1458002511';

const config: ExpoConfig = {
  name: isAdminBuild ? 'Pocket Arcade Admin' : 'Pocket Arcade',
  slug: isAdminBuild ? 'pocket-arcade-admin' : 'pocket-arcade',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: isAdminBuild ? 'pocketarcadeadmin' : 'pocketarcade',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: isAdminBuild
      ? 'com.lsunny03.pocketarcade.admin'
      : 'com.lsunny03.pocketarcade',
  },
  android: {
    package: isAdminBuild ? 'com.lsunny03.pocketarcade.admin' : 'com.lsunny03.pocketarcade',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  extra: {
    appVariant: variant,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
    'expo-tracking-transparency',
    ...(!isAdminBuild
      ? [
          [
            'react-native-google-mobile-ads',
            {
              androidAppId: androidAdMobAppId,
              iosAppId: iosAdMobAppId,
              userTrackingUsageDescription:
                'This identifier will be used to deliver more relevant rewarded ads.',
            },
          ] as [string, { androidAppId: string; iosAppId: string; userTrackingUsageDescription: string }],
        ]
      : []),
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
