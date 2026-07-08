import type { Club } from '../types';
import { getClub } from '../data';
import { useLang } from '../i18n/useLang';

/** Manual abbreviation overrides for well-known club IDs. */
const ABBR_OVERRIDES: Record<string, string> = {
  muni: 'MUN',
  whu: 'WHU',
  wlv: 'WOL',
  bri: 'BHA',
  ast: 'AVL',
  nfo: 'NFO',
  shu: 'SHU',
  wba: 'WBA',
  blc: 'BLB',
};

/**
 * Pick a readable text colour for a given background colour.
 * Returns '#000' for bright backgrounds (e.g. yellow), '#fff' otherwise.
 */
export function getContrastColor(hex: string): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    const expanded = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
    return getContrastColor('#' + expanded);
  }
  if (cleaned.length !== 6) return '#fff'; // hsl / named colours — default to white
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '#fff';
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#000' : '#fff';
}

/** Generate a 2-3 letter abbreviation from a club's short name. */
function generateAbbr(club: Club, lang: 'zh' | 'en'): string {
  if (ABBR_OVERRIDES[club.id]) return ABBR_OVERRIDES[club.id];

  if (lang === 'zh') {
    return club.shortNameZh.slice(0, 2);
  }

  const shortName = club.shortName;
  const words = shortName.split(/\s+/).filter(Boolean);

  if (words.length >= 3) {
    return words
      .slice(0, 3)
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase();
  }
  if (words.length === 2) {
    // First letter of word 1 + first two letters of word 2
    const a = words[0][0] ?? '';
    const b = words[1].slice(0, 2);
    return (a + b).toUpperCase();
  }
  return shortName.slice(0, 3).toUpperCase();
}

interface ClubBadgeProps {
  clubId?: string;
  club?: Club;
  size?: number;
  className?: string;
}

export default function ClubBadge({
  clubId,
  club,
  size = 32,
  className,
}: ClubBadgeProps) {
  const { lang } = useLang();
  const resolvedClub = club ?? (clubId ? getClub(clubId) : undefined);

  if (!resolvedClub) return null;

  const abbr = generateAbbr(resolvedClub, lang);
  const textColor = getContrastColor(resolvedClub.color);
  const strokeColor = resolvedClub.color2 || 'rgba(255,255,255,0.3)';
  const fontSize = abbr.length >= 3 ? 12 : 14;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label={resolvedClub.name}
    >
      <circle
        cx="20"
        cy="20"
        r="19"
        fill={resolvedClub.color}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <text
        x="20"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="700"
        fill={textColor}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {abbr}
      </text>
    </svg>
  );
}
