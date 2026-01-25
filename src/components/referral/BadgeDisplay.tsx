import { motion } from 'framer-motion';
import { Badge, getBadgeForReferrals, getNextBadge, getReferralsToNextBadge } from '@/lib/referral-badges';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  completedCount: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeDisplay({ completedCount, showProgress = true, size = 'md' }: BadgeDisplayProps) {
  const currentBadge = getBadgeForReferrals(completedCount);
  const nextBadge = getNextBadge(currentBadge);
  const referralsToNext = getReferralsToNextBadge(completedCount);
  
  const progressValue = nextBadge 
    ? ((completedCount - currentBadge.minReferrals) / (nextBadge.minReferrals - currentBadge.minReferrals)) * 100
    : 100;

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const containerClasses = {
    sm: 'p-2 gap-2',
    md: 'p-3 gap-3',
    lg: 'p-4 gap-4',
  };

  return (
    <div className={cn(
      "flex flex-col items-center rounded-xl border-2",
      currentBadge.bgColor,
      currentBadge.borderColor,
      containerClasses[size]
    )}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={sizeClasses[size]}
      >
        {currentBadge.icon}
      </motion.div>
      
      <div className="text-center">
        <p className={cn("font-bold", currentBadge.color, size === 'lg' ? 'text-xl' : 'text-base')}>
          {currentBadge.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {completedCount} indicação{completedCount !== 1 ? 'ões' : ''}
        </p>
      </div>

      {showProgress && nextBadge && (
        <div className="w-full space-y-1">
          <Progress value={progressValue} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Faltam {referralsToNext} para {nextBadge.icon} {nextBadge.name}
          </p>
        </div>
      )}

      {!nextBadge && currentBadge.level === 'diamond' && (
        <p className="text-xs text-center text-cyan-600 font-medium">
          🏆 Nível máximo alcançado!
        </p>
      )}
    </div>
  );
}
