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
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-ink-950/70 border-b border-ink-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="font-display font-black text-xl sm:text-2xl tracking-tightest text-ink-100">
            Dream<span className="text-accent">XI</span>
          </span>
          <span className="hidden md:inline text-sm text-ink-400 font-medium tracking-wide uppercase">
            {t('brandTagline')}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors ${
              !onGame ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'
            }`}
          >
            {t('navHome')}
          </Link>
          <Link
            to="/game"
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors ${
              onGame ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'
            }`}
          >
            {t('navPlay')}
          </Link>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 px-2.5 sm:px-3 py-2 text-base font-mono font-bold text-ink-200 border border-ink-700 rounded-md hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={theme === 'dark' ? (lang === 'zh' ? '切换到亮色模式' : 'Switch to light mode') : (lang === 'zh' ? '切换到暗色模式' : 'Switch to dark mode')}
            title={theme === 'dark' ? (lang === 'zh' ? '亮色模式' : 'Light mode') : (lang === 'zh' ? '暗色模式' : 'Dark mode')}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="ml-1 px-2.5 sm:px-3 py-2 text-sm sm:text-base font-mono font-bold text-ink-200 border border-ink-700 rounded-md hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
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
