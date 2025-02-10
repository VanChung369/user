import { UNDEFINED } from '@/constants/type';
import { IObject, OpenCloseCharacter } from './typings';

export const IS_WINDOW = typeof window !== UNDEFINED;

const doc = (typeof document !== UNDEFINED && document) as Document;

export { doc as document };

const prefixes: string[] = ['webkit', 'ms', 'moz', 'o'];

export const getCrossBrowserProperty = (property: string) => {
  if (!doc) {
    return '';
  }
  const styles = (doc.body || doc.documentElement).style as any;
  const length = prefixes.length;

  if (typeof styles[property] !== UNDEFINED) {
    return property;
  }
  for (let i = 0; i < length; ++i) {
    const name = `-${prefixes[i]}-${property}`;

    if (typeof styles[name] !== UNDEFINED) {
      return name;
    }
  }
  return '';
};

export const TRANSFORM = getCrossBrowserProperty('transform');

export const FILTER = getCrossBrowserProperty('filter');

export const ANIMATION = getCrossBrowserProperty('animation');

export const KEYFRAMES = ANIMATION.replace('animation', 'keyframes');

export const OPEN_CLOSED_CHARACTERS: OpenCloseCharacter[] = [
  { open: '(', close: ')' },
  { open: `"`, close: `"` },
  { open: `'`, close: `'` },
  { open: `\\"`, close: `\\"` },
  { open: `\\'`, close: `\\'` },
];
export const TINY_NUM = 0.0000001;

export const REVERSE_TINY_NUM = 1 / TINY_NUM;

export const DEFAULT_UNIT_PRESETS: IObject<(pos: number, size?: number) => number> = {
  cm: (pos) => (pos * 96) / 2.54,
  mm: (pos) => (pos * 96) / 254,
  in: (pos) => pos * 96,
  pt: (pos) => (pos * 96) / 72,
  pc: (pos) => (pos * 96) / 6,
  '%': (pos, size) => (pos * size!) / 100,
  vw: (pos, size = window.innerWidth) => (pos / 100) * size,
  vh: (pos, size = window.innerHeight) => (pos / 100) * size,
  vmax: (pos, size = Math.max(window.innerWidth, window.innerHeight)) => (pos / 100) * size,
  vmin: (pos, size = Math.min(window.innerWidth, window.innerHeight)) => (pos / 100) * size,
};
