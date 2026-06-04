import { useState } from 'react';
import './App.css'
import { useServiceWorker } from './hooks/useServiceWorker'
// import package.json to display current version in the UI
import pkg from '../package.json'
import IOSInstallModal from './components/IOSInstallModal';
import './components/IOSInstallModal.css';

function App() {
  const { isInstallable, isInstalled, swActive, manifestLoaded } =
    useServiceWorker()

  const getPlatform = (): string => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('win')) return 'Windows';
    if (ua.includes('linux')) return 'Linux';
    return 'Unknown';
  }

  const platform = getPlatform();
  const isIOS = platform === 'iOS';
  const isAndroid = platform === 'Android';
  const version = pkg?.version ?? '0.0.0';
  const rawBuildTimestamp = (import.meta as any).env?.VITE_BUILD_TIMESTAMP ?? new Date().toISOString();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  const formatUTC8 = (timestamp: string) => {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) {
      return timestamp
    }

    const utc8 = new Date(date.getTime() + 8 * 60 * 60 * 1000)
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${utc8.getUTCFullYear()}-${pad(utc8.getUTCMonth() + 1)}-${pad(utc8.getUTCDate())} ${pad(utc8.getUTCHours())}:${pad(utc8.getUTCMinutes())}:${pad(utc8.getUTCSeconds())} +08:00`
  }

  const buildTimestamp = formatUTC8(rawBuildTimestamp)


  const clearCache = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      registrations.forEach((reg) => {
        const channel = new MessageChannel()
        reg.active?.postMessage({ type: 'CLEAR_CACHE' }, [channel.port2])
        channel.port1.onmessage = () => {
          alert('Cache cleared successfully!')
        }
      })
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 PWA Installation Testing Dashboard</h1>
        <p>Test PWA installation prompts across platforms</p>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>📱 Platform & App Status</h2>
          <div className="status-grid">
            <div className="status-card">
              <label>Platform</label>
              <div className="value">{getPlatform()}</div>
            </div>
            <div className="status-card">
              <label>PWA Installable</label>
              <div className={`value ${isInstallable ? 'success' : 'error'}`}>
                {isInstallable ? '✓ Yes' : '✗ No'}
              </div>
            </div>
            <div className="status-card">
              <label>PWA Installed</label>
              <div className={`value ${isInstalled ? 'success' : 'warning'}`}>
                {isInstalled ? '✓ Yes' : '⏳ Not yet'}
              </div>
            </div>
            <div className="status-card">
              <label>Service Worker</label>
              <div className={`value ${swActive ? 'success' : 'error'}`}>
                {swActive ? '✓ Active' : '✗ Inactive'}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>🎯 Installation & Actions</h2>
          <div className="actions">
            <div>
              <p>ℹ️ Installation not currently available</p>
              <div>Try using Chrome/Edge on Android, or Safari on iOS to test installation</div>
            </div>
            <div className="action-buttons" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              width: '100%'
            }}>
              <div style={{width: '100%'}}>
                {isIOS && (
                  <button className="btn btn-primary" onClick={() => setShowIOSModal(true)}>
                    📤 How to Add to Home Screen
                  </button>
                )}
                {isAndroid && (
                  <button className="btn btn-primary" onClick={handleInstall}>
                    🔽 Install App
                  </button>
                )}
                <IOSInstallModal
                  isOpen={showIOSModal}
                  onClose={() => setShowIOSModal(false)}
                />
              </div>
              <div style={{width: '100%'}}>
                <button className="btn" onClick={clearCache}>🗑️ Clear Cache</button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>📋 Manifest & Service Worker</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Manifest Status</h3>
              <div className="status-indicator">
                <span
                  className={`indicator ${manifestLoaded ? 'loaded' : 'unloaded'}`}
                ></span>
                <span>{manifestLoaded ? 'Loaded' : 'Not Loaded'}</span>
              </div>
              {manifestLoaded && (
                <div className="manifest-details">
                  <p>
                    <strong>Name:</strong> PWA Installation Testing
                  </p>
                  <p>
                    <strong>Short Name:</strong> PWA Test
                  </p>
                  <p>
                    <strong>Display:</strong> standalone
                  </p>
                  <p>
                    <strong>Start URL:</strong> /
                  </p>
                  <p>
                    <strong>Icons:</strong> 192x192, 512x512, 180x180
                  </p>
                </div>
              )}
            </div>

            <div className="info-card">
              <h3>Service Worker</h3>
              <div className="status-indicator">
                <span className={`indicator ${swActive ? 'active' : 'inactive'}`}></span>
                <span>{swActive ? 'Active' : 'Inactive'}</span>
              </div>
              {swActive && (
                <div className="sw-details">
                  <p>✓ Service Worker is running</p>
                  <p>✓ Offline support enabled</p>
                  <p>✓ Asset caching active</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>🔍 Testing Guide</h2>
          <div className="guide">
            <div className="guide-item">
              <h4>Chrome/Edge (Android/Desktop)</h4>
              <ul>
                <li>
                  1. Open DevTools (F12) → Application → Manifest tab to verify
                  manifest
                </li>
                <li>2. Check Application → Service Workers for registration</li>
                <li>3. Click "Install App" button to trigger install dialog</li>
                <li>4. After install, app appears in home screen or start menu</li>
              </ul>
            </div>
            <div className="guide-item">
              <h4>Safari (iOS/macOS)</h4>
              <ul>
                <li>1. Tap Share → Add to Home Screen (no automatic prompt)</li>
                <li>2. Manifest is validated via DevTools Web Inspector</li>
                <li>3. Install icon appears on home screen</li>
                <li>4. Opens in standalone mode when tapped</li>
              </ul>
            </div>
            <div className="guide-item">
              <h4>Development Tips</h4>
              <ul>
                <li>• Use Chrome DevTools → Application to simulate install</li>
                <li>• Test on different devices: mobile, tablet, desktop</li>
                <li>• Check browser compatibility for beforeinstallprompt event</li>
                <li>• Use manifest validator: web.dev/check</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section info-section">
          <h2>ℹ️ App Info</h2>
          <div className="app-info">
            <p>
              <strong>Manifest:</strong>{' '}
              <a href="manifest.json" target="_blank" rel="noopener noreferrer">
                manifest.json
              </a>
            </p>
            <p>
              <strong>Service Worker:</strong> Auto-registered by PWA plugin
            </p>
            <p>
              <strong>Build Tool:</strong> Vite with vite-plugin-pwa
            </p>
            <p>
              <strong>Framework:</strong> React + TypeScript
            </p>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>PWA Installation Testing • Open DevTools to inspect PWA components</p>
        <p className="app-version">Version: {version} • Build: {buildTimestamp}</p>
      </footer>
    </div>
  )
}

export default App
