const GRADIENT_PAIRS: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#ff9a9e', '#fecfef'],
  ['#a1c4fd', '#c2e9fb'],
  ['#d4fc79', '#96e6a1'],
  ['#84fab0', '#8fd3f4'],
  ['#a6c0fe', '#f68084'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
  ['#89f7fe', '#66a6ff'],
  ['#fddb92', '#d1fdff'],
  ['#c1dfc4', '#deecdd'],
  ['#0ba360', '#3cba92'],
  ['#cd9cf2', '#f6f3ff'],
  ['#e8198b', '#c7eafd'],
  ['#f794a4', '#fdd6bd'],
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateGradient(seed: string): string {
  const hash = hashCode(seed);
  const pair = GRADIENT_PAIRS[hash % GRADIENT_PAIRS.length]!;
  const angle = (hash * 37) % 360;
  return `linear-gradient(${angle}deg, ${pair[0]}, ${pair[1]})`;
}

export function generateAvatarGradient(seed: string): string {
  const hash = hashCode(seed + '_avatar');
  const pair = GRADIENT_PAIRS[hash % GRADIENT_PAIRS.length]!;
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}
