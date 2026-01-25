export type BadgeLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Badge {
  level: BadgeLevel;
  name: string;
  minReferrals: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const BADGES: Record<BadgeLevel, Badge> = {
  none: {
    level: 'none',
    name: 'Iniciante',
    minReferrals: 0,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-muted',
    icon: '🌱',
  },
  bronze: {
    level: 'bronze',
    name: 'Bronze',
    minReferrals: 1,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    icon: '🥉',
  },
  silver: {
    level: 'silver',
    name: 'Prata',
    minReferrals: 3,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    icon: '🥈',
  },
  gold: {
    level: 'gold',
    name: 'Ouro',
    minReferrals: 5,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    icon: '🥇',
  },
  diamond: {
    level: 'diamond',
    name: 'Diamante',
    minReferrals: 10,
    color: 'text-cyan-600',
    bgColor: 'bg-gradient-to-r from-cyan-100 to-blue-100',
    borderColor: 'border-cyan-400',
    icon: '💎',
  },
};

export function getBadgeForReferrals(completedCount: number): Badge {
  if (completedCount >= BADGES.diamond.minReferrals) return BADGES.diamond;
  if (completedCount >= BADGES.gold.minReferrals) return BADGES.gold;
  if (completedCount >= BADGES.silver.minReferrals) return BADGES.silver;
  if (completedCount >= BADGES.bronze.minReferrals) return BADGES.bronze;
  return BADGES.none;
}

export function getNextBadge(currentBadge: Badge): Badge | null {
  const levels: BadgeLevel[] = ['none', 'bronze', 'silver', 'gold', 'diamond'];
  const currentIndex = levels.indexOf(currentBadge.level);
  if (currentIndex < levels.length - 1) {
    return BADGES[levels[currentIndex + 1]];
  }
  return null;
}

export function getReferralsToNextBadge(completedCount: number): number {
  const currentBadge = getBadgeForReferrals(completedCount);
  const nextBadge = getNextBadge(currentBadge);
  if (nextBadge) {
    return nextBadge.minReferrals - completedCount;
  }
  return 0;
}
