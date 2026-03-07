import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureAbsoluteUrl(url: string | undefined): string {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

/** Parse rich markers: **bold**, [[green-card]], **[[bold+green]]**, {{white-card}}, **{{bold+white}}** */
export function parseRichText(str: string): { text: string; bold: boolean; card: boolean; whiteCard: boolean }[] {
  if (!str) return [];
  const parts: { text: string; bold: boolean; card: boolean; whiteCard: boolean }[] = [];
  const regex = /\*\*\[\[(.+?)\]\]\*\*|\*\*\{\{(.+?)\}\}\*\*|\*\*(.+?)\*\*|\[\[(.+?)\]\]|\{\{(.+?)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(str)) !== null) {
    if (m.index > last) parts.push({ text: str.slice(last, m.index), bold: false, card: false, whiteCard: false });
    if (m[1] !== undefined) parts.push({ text: m[1], bold: true, card: true, whiteCard: false });
    else if (m[2] !== undefined) parts.push({ text: m[2], bold: true, card: false, whiteCard: true });
    else if (m[3] !== undefined) parts.push({ text: m[3], bold: true, card: false, whiteCard: false });
    else if (m[4] !== undefined) parts.push({ text: m[4], bold: false, card: true, whiteCard: false });
    else if (m[5] !== undefined) parts.push({ text: m[5], bold: false, card: false, whiteCard: true });
    last = m.index + m[0].length;
  }
  if (last < str.length) parts.push({ text: str.slice(last), bold: false, card: false, whiteCard: false });
  return parts.length ? parts : [{ text: str, bold: false, card: false, whiteCard: false }];
}
