import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/useLang';
import { useGame } from '../store/game';

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const theme = useGame((s) => s.theme);
  const setTheme = useGame((s) => s.setTheme);
  const onGame = location.pathname.startsWith('/game');

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="font-display font-black text-2xl tracking-tightest text-ink-100">
            Dream<span className="text-accent">XI</span>
          </span>
          <span className="hidden sm:inline text-sm text-ink-400 font-medium tracking-wide uppercase">
            {t('brandTagline')}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-4 py-2 text-base font-medium rounded-md transition-colors ${
              !onGame ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'
            }`}
          >
            {t('navHome')}
          </Link>
          <Link
            to="/game"
            className={`px-4 py-2 text-base font-medium rounded-md transition-colors ${
              onGame ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'
            }`}
          >
            {t('navPlay')}
          </Link>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 px-3 py-2 text-base font-mono font-bold text-ink-200 border border-ink-700 rounded-md hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="ml-1 px-3 py-2 text-base font-mono font-bold text-ink-200 border border-ink-700 rounded-md hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
          >
            {t('langToggle')}
          </button>
        </nav>
      </div>
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-ink-700 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
    </header>
  );
}
