# PWA Installation Testing Dashboard

A comprehensive testing application for Progressive Web App (PWA) installation prompts across different platforms and browsers.

## 🚀 Features

- **Platform Detection**: Automatically detects the current platform (iOS, Android, macOS, Windows, Linux)
- **Installation Status Tracking**: Displays whether the PWA is installable and if it's already installed
- **Service Worker Monitoring**: Shows active service worker registration status
- **Manifest Validation**: Displays manifest loading status and metadata
- **Cross-Platform Testing**: Provides platform-specific testing guides for:
  - Chrome/Edge (Android & Desktop)
  - Safari (iOS & macOS)
- **Cache Management**: Button to manually clear the service worker cache
- **Testing Guide**: Built-in documentation for testing PWA installation on different platforms

## 📋 Project Structure

```
tlb/
├── src/
│   ├── App.tsx              # Main dashboard component
│   ├── App.css              # Dashboard styles
│   ├── main.tsx             # Application entry point
│   ├── hooks/
│   │   └── useServiceWorker.ts  # Service worker state management hook
│   ├── workers/
│   │   └── sw.ts            # Service worker implementation
│   └── index.css            # Global styles
├── public/
│   ├── manifest.json        # PWA manifest (auto-generated)
│   ├── icon-192x192.png    # App icon (192x192)
│   ├── icon-512x512.png    # App icon (512x512)
│   └── apple-touch-icon.png # iOS app icon (180x180)
├── vite.config.ts           # Vite configuration with vite-plugin-pwa
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 8
- **PWA Plugin**: vite-plugin-pwa
- **Service Worker**: Custom implementation with cache-first/network-first strategies
- **Styling**: Pure CSS with responsive design

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Generate placeholder icons (already done):
```bash
node scripts/generate-icons.mjs
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Development Notes
- Hot Module Replacement (HMR) is enabled for fast iteration
- Service Worker and manifest are generated on build, not in dev mode (by design of vite-plugin-pwa)
- Use Chrome DevTools to simulate PWA installation in dev mode

## 🔨 Building for Production

Build the production version:
```bash
npm run build
```

This will:
- Generate optimized production bundle
- Create the service worker file
- Generate the manifest.json
- Bundle all assets with versioning

Preview production build locally:
```bash
npm run preview
```

## ✅ Testing Checklist

### Development Testing
- [ ] Run `npm run dev` and verify app loads
- [ ] Open DevTools (F12) → Application → Manifest tab
- [ ] Verify manifest.json is accessible at `/manifest.json`
- [ ] Check Service Worker tab (will show as inactive in dev mode, which is normal)
- [ ] Test responsive design on different screen sizes

### Production Build Testing
1. Run `npm run build`
2. Run `npm run preview`
3. Open DevTools Application tab and verify:
   - [ ] Manifest.json is loaded and valid
   - [ ] Service Worker is registered and active
   - [ ] All icons are accessible
4. Simulate PWA installation:
   - [ ] In Chrome: DevTools → Application → Manifest → "Add to homescreen"
   - [ ] Verify "Install App" button appears if supported

### Cross-Platform Testing
- **Chrome/Chromium (Desktop/Android)**:
  - [ ] Open Chrome DevTools
  - [ ] Check Application → Manifest tab
  - [ ] Click "Add to homescreen" in manifest section
  - [ ] Verify native install dialog appears
  - [ ] Click "Install App" button in the UI

- **Safari (macOS/iOS)**:
  - [ ] Open Safari DevTools (Develop menu)
  - [ ] Check Web Inspector → Resources → Manifest
  - [ ] On iOS: Tap Share → Add to Home Screen
  - [ ] On macOS: Click install button if available

- **Edge (Windows)**:
  - [ ] Follow same steps as Chrome
  - [ ] Verify app appears in Start menu after installation

## 🔍 Key Files

### [App.tsx](src/App.tsx)
Main React component rendering the testing dashboard with:
- Platform detection
- Installation status display
- Cache clearing functionality
- Testing guide sections

### [useServiceWorker.ts](src/hooks/useServiceWorker.ts)
Custom React hook that:
- Listens to `beforeinstallprompt` event
- Tracks installation state
- Manages deferred installation prompts
- Checks service worker registration
- Validates manifest loading

### [sw.ts](src/workers/sw.ts)
Service Worker implementation with:
- Cache-first strategy for static assets
- Network-first strategy for API calls
- Offline fallback support
- Cache clearing message handler

### [vite.config.ts](vite.config.ts)
Vite configuration with vite-plugin-pwa setup:
- Manifest auto-generation
- Service worker bundling (inject manifest strategy)
- Icon registration
- Auto-update configuration

## 📱 Manifest Details

The generated manifest includes:
- **Name**: PWA Installation Testing
- **Short Name**: PWA Test
- **Display Mode**: standalone (full-screen app experience)
- **Start URL**: / (app root)
- **Scope**: / (entire domain)
- **Icons**: 192x192, 512x512, 180x180 PNG files
- **Theme Color**: #000000 (black)
- **Background Color**: #ffffff (white)

## 🔄 Service Worker Features

- **Cache Strategies**:
  - Cache-first: For JS, CSS, images, fonts, SVGs
  - Network-first: For HTML and API calls
- **Offline Support**: Returns offline page when network fails
- **Auto-update**: Configured with `registerType: 'autoUpdate'`
- **Cache Versioning**: Uses version string for cache busting

## 🌐 Browser Support

- **Chrome/Edge 40+**: Full PWA support with beforeinstallprompt
- **Firefox 55+**: PWA support (no automatic install prompt)
- **Safari 11.1+**: PWA support (iOS 13.3+ for full app mode)
- **Android 5+**: Full PWA support on Chrome/Firefox

## 📝 Notes

- The manifest is accessible at `/manifest.json` after build
- Service worker is auto-registered by vite-plugin-pwa
- In development mode, the service worker may not be active (normal behavior)
- For production deployment, ensure the server is HTTPS-enabled (required for service workers)
- Test on actual devices or use browser simulators for best results

## 🎯 Next Steps

1. Replace placeholder icons with your branded icons
2. Customize colors and styling in `App.css`
3. Add additional testing features (e.g., offline mode simulator, version display)
4. Deploy to a server with HTTPS support
5. Test on real devices (iOS, Android, Desktop)

## 📄 License

MIT
