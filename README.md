# Festival Green Companion

Festival Green Companion is a mobile-first travel-planning application for festival visitors. It helps users compare transport options, choose a journey, and find the most suitable arrival point at the festival site.

The application is built with Expo, React Native, TypeScript, and Expo Router. It targets Android, iOS, and the web from one codebase.

## Project goals

The project aims to make festival travel clearer and more sustainable by allowing visitors to:

- Review their festival trip details.
- Compare travel methods by price, duration, convenience, and CO₂ emissions.
- Select and change their preferred travel method.
- View available festival arrival points on an interactive map.
- Check the estimated walking time from each arrival point to the main arena.
- Keep the experience simple, accessible, and suitable for mobile devices.

## Current features

### Home page

- Displays the Greenfield Festival name and date.
- Shows the journey from Manchester to Willow Park.
- Links to the travel comparison page.
- Shows the currently selected travel method.
- Allows the user to change their selection.

### Travel page

- Compares train, bus, car, and bicycle travel.
- Displays price, journey time, convenience, and CO₂ emissions.
- Highlights the selected option.
- Shares the selected travel option with the home page through React Context.

### Map page

- Displays a custom festival arrival map.
- Provides interactive pins for the shuttle drop-off, bus stop, main entrance, bicycle parking, and car park.
- Updates the selected-location card when a pin is pressed.
- Shows the estimated walking time to the main arena.

### Navigation

- Uses Expo Router for file-based routing.
- Provides Home, Travel, and Map bottom tabs.
- Includes accessible labels and selected states for interactive controls.

## Database plan

The current version uses mock data and in-memory React state while the interface and user flows are being developed. A database is not connected yet.

All information that must be saved or shared will be stored in a database in a future development phase. Local component state will only be used for temporary interface state.

Planned database-backed data includes:

- User accounts and profiles.
- Festival information and dates.
- Journey origins and destinations.
- Available travel options and live travel details.
- User travel selections.
- Arrival points and walking-time information.
- Sustainability data and CO₂ calculations.
- Saved preferences and application settings.
- Any other information that needs to remain available after the app is closed.

The database provider and schema will be selected and documented when the backend phase begins. Sensitive data and credentials must never be committed to the repository. Environment variables will be used for database URLs, API keys, and other secrets.

## Technology stack

- [Expo](https://expo.dev/) SDK 57
- [React Native](https://reactnative.dev/) 0.86
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) for navigation
- [React Native SVG](https://github.com/software-mansion/react-native-svg) for the custom map
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/) for interface icons
- ESLint for code quality

## Project structure

```text
festival-green-companion/
├── assets/                  Images and application icons
├── src/
│   ├── app/                 Expo Router routes and layouts
│   │   ├── (tabs)/          Home, Travel, and Map tab routes
│   │   └── _layout.tsx      Root application layout
│   ├── components/          Reusable interface components
│   ├── context/             Shared React state
│   ├── data/                Temporary mock data
│   ├── navigation/          Bottom-tab configuration
│   ├── screens/             Screen implementations
│   ├── types/               TypeScript models
│   └── utils/               Theme and formatting helpers
├── app.json                 Expo application configuration
├── package.json             Dependencies and scripts
└── tsconfig.json            TypeScript configuration
```

Files inside `src/app/` are routes. Components, contexts, utilities, and other non-route code are kept outside that directory.

## Requirements

Install the following before running the project:

- Node.js
- npm
- Android Studio for Android development
- Android SDK Platform 36 or newer
- An Android emulator or a physical Android device with USB debugging enabled

For iOS development, macOS and Xcode are required for local simulator builds.

## Installation

Clone the repository and open a terminal in the project directory:

```bash
npm install
```

## Running the project

### Start the Expo development server

```bash
npx expo start
```

### Run on Android

Start an Android emulator from Android Studio's Device Manager. After the Android home screen appears, run:

```bash
npx expo run:android
```

After the first native build, JavaScript and TypeScript changes can usually be loaded with:

```bash
npx expo start --android
```

If an old bundle is displayed, clear the Metro cache:

```bash
npx expo start --android --clear
```

### Run on the web

```bash
npm run web
```

### Run on iOS

```bash
npx expo run:ios
```

## Windows Android environment

If Android commands are unavailable in PowerShell, configure the current terminal session:

```powershell
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:JAVA_HOME\bin;$env:Path"
```

These commands only affect the current terminal session.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Compile and run the Android application |
| `npm run ios` | Compile and run the iOS application |
| `npm run web` | Start the web version |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without producing files |

## Development workflow

1. Create screens as route files inside `src/app/`.
2. Keep reusable components and application logic outside the route directory.
3. Configure native behavior through `app.json` or Expo config plugins.
4. Do not manually edit generated native files when the same change can be made through Expo configuration.
5. Run lint and type checking before committing changes.

```bash
npm run lint
npm run typecheck
```

## Current data behavior

- Travel and arrival-point data currently comes from `src/data/mockData.ts`.
- The selected travel method is stored in `TripContext` while the application is running.
- The selected map location is temporary screen state.
- Current selections reset when the application reloads.
- Persistent storage will be implemented through the planned database integration.

## Future development

- Design and implement the database schema.
- Connect the application to a backend API or database service.
- Add authentication and user profiles.
- Replace mock travel information with database or live API data.
- Persist travel choices and user preferences.
- Add real festival map and location data.
- Add loading, empty, offline, and error states.
- Add automated component and end-to-end tests.
- Add secure environment configuration for development and production.

## Security and configuration

- Never commit database passwords, private API keys, or service credentials.
- Store secrets in ignored environment files or a secure secret-management service.
- Validate database input on the server.
- Apply authentication and authorization before exposing user data.
- Store only the information required by the application.

## License

This project is licensed under the terms provided in the repository's [LICENSE](./LICENSE) file.
