# Pocket Arcade

Pocket Arcade is a mobile-first offline arcade built with Expo and React Native Web. The current MVP includes:

- Snake Sprint
- Fruit Merge
- Cake Sort
- Screwdom Lite
- Local coin progression and booster inventory
- Admin mode that disables monetization surfaces and unlocks free booster grants

## Run locally

```bash
npm install
npm run web
```

Then open the Expo web URL shown in the terminal, usually `http://localhost:8081`.

## Notes

- Progress is stored locally with AsyncStorage.
- The same codebase is ready to run on mobile Expo targets later.
