export interface DomainScore {
  total: number;
  length: number;
  pronounce: number;
  memory: number;
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function lengthScore(name: string): number {
  if (name.length === 3) return 100;
  if (name.length === 4) return 75;
  return 50;
}

function pronounceScore(name: string): number {
  const chars = name.split('');
  const vowelRatio = chars.filter(c => VOWELS.has(c)).length / name.length;

  let maxConsecutiveConsonants = 0;
  let run = 0;
  for (const c of chars) {
    run = VOWELS.has(c) ? 0 : run + 1;
    maxConsecutiveConsonants = Math.max(maxConsecutiveConsonants, run);
  }

  const vowelScore = Math.min(100, vowelRatio * 250);
  const penalty = Math.max(0, (maxConsecutiveConsonants - 2) * 20);
  return Math.max(0, Math.round(vowelScore - penalty));
}

function memoryScore(name: string): number {
  const chars = name.split('');
  const hasRepeat = chars.some((c, i) => i > 0 && c === chars[i - 1]);

  const isCvc =
    name.length === 3 &&
    !VOWELS.has(name[0]) && VOWELS.has(name[1]) && !VOWELS.has(name[2]);
  const isCvcv =
    name.length === 4 &&
    !VOWELS.has(name[0]) && VOWELS.has(name[1]) &&
    !VOWELS.has(name[2]) && VOWELS.has(name[3]);

  let score = 70;
  if (isCvc || isCvcv) score = 100;
  if (hasRepeat) score -= 15;
  return Math.max(0, score);
}

export function scoreDomain(domain: string): DomainScore {
  const name = domain.replace(/\.com$/, '');
  const length = lengthScore(name);
  const pronounce = pronounceScore(name);
  const memory = memoryScore(name);
  const total = Math.round(length * 0.5 + pronounce * 0.35 + memory * 0.15);
  return { total, length, pronounce, memory };
}
