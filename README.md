# Pocket Arcade

Pocket Arcade is a mobile-first offline arcade built with Expo and React Native Web. The current MVP includes:

- Snake Sprint
- Fruit Merge
- Cake Sort
- Screwdom Lite
- Local coin progression and booster inventory
- Rewarded AdMob bonus flow for the consumer build
- Admin build variant that disables monetization surfaces and keeps boosters free

## Run locally

```bash
npm install
npm run web
```

Then open the Expo web URL shown in the terminal, usually `http://localhost:8081`.

## Build variants

- Consumer build: `EXPO_PUBLIC_APP_VARIANT=consumer`
- Admin build: `EXPO_PUBLIC_APP_VARIANT=admin`

Use `.env.example` as the starting point for AdMob app IDs and rewarded unit IDs. Consumer mobile builds use the Google Mobile Ads SDK; admin builds omit the ad SDK configuration entirely.

An `eas.json` file is included with `production` and `admin` profiles so you can generate separate iOS and Android builds from the same codebase.

## Notes

- Progress is stored locally with AsyncStorage.
- Boosters now affect gameplay directly:
  - Freeze pauses Snake briefly
  - Undo reverts merge and sort moves
  - Shuffle re-rolls sort boards mid-run
  - Magnet upgrades a fruit tier in Fruit Merge
- Rewarded ads are only available in native iOS and Android builds; the web build keeps the consumer flow visible but does not simulate ad rewards.
