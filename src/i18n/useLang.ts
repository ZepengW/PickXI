import { useGame } from '../store/game';
import { t as translate, type StringKey } from './strings';

export function useLang() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const t = (key: StringKey) => translate(key, lang);
  return { lang, setLang, t };
}
