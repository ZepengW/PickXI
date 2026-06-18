import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Version check: periodically fetch version.json and reload if the build has changed.
// This ensures users always get the latest version after a deployment.
const VERSION_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function checkVersion() {
  try {
    const base = import.meta.env.BASE_URL || '/';
    const res = await fetch(`${base}version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const currentVersion = (window as any).__BUILD_VERSION__;
    if (currentVersion && currentVersion !== data.version) {
      window.location.reload();
    }
    (window as any).__BUILD_VERSION__ = data.version;
  } catch {
    // Silently ignore — offline or version.json missing
  }
}

// Stamp the initial version
checkVersion();
// Check periodically
setInterval(checkVersion, VERSION_CHECK_INTERVAL);
// Also check when the tab regains focus (user comes back later)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkVersion();
});
