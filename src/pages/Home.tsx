import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Nav from '../components/Nav';
import Pitch from '../components/Pitch';
import { useLang } from '../i18n/useLang';
import { COMPETITIONS, totalPlayerCount } from '../data';
import { useGame } from '../store/game';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
  const { lang, t } = useLang();
  const setCompetition = useGame((s) => s.setCompetition);
  const slots = useGame((s) => s.slots);
  const formationId = useGame((s) => s.formationId);
  const playerCount = totalPlayerCount();

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <Nav />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Full-bleed atmospheric image */}
        <div className="absolute inset-0">
          <img
            src="/hero-stadium.jpg"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-ink-950/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 w-full pt-20 pb-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            {/* Text column */}
            <div className="max-w-xl">
              <motion.p
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="text-accent font-mono text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-5"
              >
                {t('heroEyebrow')}
              </motion.p>
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="font-display font-black tracking-tightest leading-[0.95] text-5xl sm:text-7xl lg:text-8xl text-white"
              >
                {lang === 'zh' ? (
                  <>
                    组建你的
                    <br />
                    <span className="text-accent">梦幻十一人</span>
                  </>
                ) : (
                  <>
                    Build your
                    <br />
                    <span className="text-accent">dream XI</span>
                  </>
                )}
              </motion.h1>
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-6 text-base sm:text-lg text-ink-200 leading-relaxed max-w-md"
              >
                {t('heroSub')}
              </motion.p>
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/game"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark transition-colors text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                >
                  {t('heroCta')}
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-ink-200 font-medium rounded-full border border-ink-600 hover:border-ink-300 hover:text-ink-100 transition-colors text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                >
                  {t('heroCtaAlt')}
                </a>
              </motion.div>
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-10 flex items-center gap-6 text-xs text-ink-400 font-mono"
              >
                <span>
                  <span className="text-ink-100 font-bold">{playerCount}+</span>{' '}
                  {lang === 'zh' ? '球员赛季' : 'player seasons'}
                </span>
                <span className="h-3 w-px bg-ink-700" />
                <span>
                  <span className="text-ink-100 font-bold">5</span>{' '}
                  {lang === 'zh' ? '大赛事' : 'competitions'}
                </span>
                <span className="h-3 w-px bg-ink-700" />
                <span>
                  <span className="text-ink-100 font-bold">1992–2024</span>
                </span>
              </motion.div>
            </div>

            {/* Pitch visual column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-8 bg-accent/10 blur-3xl rounded-full" />
                <Pitch formationId={formationId} slots={slots} showRatings compact />
              </div>
            </motion.div>
          </div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-400 text-xs font-mono tracking-widest"
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </section>

      {/* ===== HOW TO PLAY ===== */}
      <section id="how" className="py-24 sm:py-32 border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl sm:text-6xl tracking-tightest text-ink-100 mb-16"
          >
            {t('howTitle')}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-800 rounded-2xl overflow-hidden">
            {[
              { n: '01', title: t('step1Title'), body: t('step1Body') },
              { n: '02', title: t('step2Title'), body: t('step2Body') },
              { n: '03', title: t('step3Title'), body: t('step3Body') },
              { n: '04', title: t('step4Title'), body: t('step4Body') },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-ink-900 p-7 sm:p-8 group hover:bg-ink-800 transition-colors"
              >
                <div className="font-mono text-accent text-sm font-bold mb-6">{s.n}</div>
                <h3 className="font-display font-bold text-xl text-ink-100 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-ink-300 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPETITIONS ===== */}
      <section className="py-24 sm:py-32 border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tightest text-ink-100 mb-4">
              {t('compsTitle')}
            </h2>
            <p className="text-lg text-ink-300">{t('compsSub')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPETITIONS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  to="/game"
                  onClick={() => setCompetition(c.id)}
                  className="block relative overflow-hidden rounded-2xl border border-ink-700 hover:border-ink-500 transition-colors group h-full"
                  style={{ background: `linear-gradient(160deg, ${c.accent}33, var(--color-ink-900) 60%)` }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
                    style={{ background: c.accent }}
                  />
                  <div className="relative p-7 flex flex-col h-full min-h-[200px]">
                    <div className="flex items-start justify-between mb-auto">
                      <div>
                        <div className="text-xs font-mono text-ink-400 mb-1">
                          {lang === 'zh' ? c.regionZh : c.region}
                        </div>
                        <h3 className="font-display font-black text-2xl text-ink-100">
                          {lang === 'zh' ? c.nameZh : c.name}
                        </h3>
                      </div>
                      <span
                        className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-full border"
                        style={{ borderColor: `${c.accent}88`, color: c.accent }}
                      >
                        {c.type === 'league'
                          ? lang === 'zh'
                            ? '联赛'
                            : 'League'
                          : lang === 'zh'
                            ? '杯赛'
                            : 'Cup'}
                      </span>
                    </div>
                    <p className="text-sm text-ink-300 mt-4 mb-5 leading-relaxed">
                      {lang === 'zh' ? c.blurbZh : c.blurb}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-ink-400">
                      <span>
                        {c.matches} {lang === 'zh' ? '场' : 'games'}
                      </span>
                      <span className="text-accent font-bold group-hover:translate-x-1 transition-transform">
                        {lang === 'zh' ? '开始 →' : 'Play →'}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHALLENGES ===== */}
      <section className="py-24 sm:py-32 border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl sm:text-6xl tracking-tightest text-ink-100 mb-12"
          >
            {t('challengesTitle')}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              t('challengeUnbeaten'),
              t('challengePerfect'),
              t('challengeTitle'),
              t('challengeModern'),
              t('challengeAllTime'),
              t('challengeHard'),
            ].map((ch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center gap-3 py-4 border-b border-ink-800 text-ink-200 hover:text-ink-100 transition-colors"
              >
                <span className="text-accent">▸</span>
                <span className="text-base">{ch}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 sm:py-32 border-t border-ink-800">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-black text-4xl sm:text-6xl tracking-tightest text-ink-100 mb-6"
          >
            {lang === 'zh' ? '能组建最强十一人吗？' : 'Can you build the ultimate XI?'}
          </motion.h2>
          <p className="text-lg text-ink-300 mb-10 max-w-xl mx-auto">
            {lang === 'zh'
              ? '选秀组队，模拟赛季，看看你的球队能否创造奇迹。'
              : 'Draft your XI, simulate the season, and see whether your team can achieve the impossible.'}
          </p>
          <Link
            to="/game"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark transition-colors text-base"
          >
            {t('heroCta')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-ink-800 py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-4">
          <div className="font-display font-black text-lg text-ink-100">
            Dream<span className="text-accent">XI</span>
          </div>
          <p className="text-xs text-ink-400 leading-relaxed max-w-2xl">
            {t('footerNote')}
          </p>
          <p className="text-xs text-ink-500">{t('inspiredBy')}</p>
          <p className="text-xs text-ink-500">© 2026 DreamXI</p>
        </div>
      </footer>
    </div>
  );
}
