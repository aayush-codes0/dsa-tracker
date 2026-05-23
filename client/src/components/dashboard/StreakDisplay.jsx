import { Flame, TrendingUp } from 'lucide-react';

export default function StreakDisplay({ currentStreak = 0, maxStreak = 0 }) {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
          <Flame className="w-10 h-10 text-amber-400 animate-pulse-slow" />
        </div>
        {currentStreak > 0 && (
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-dark-950">
            {currentStreak}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-dark-100 mb-1">Current Streak</h3>
      <p className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
        {currentStreak} <span className="text-lg">days</span>
      </p>

      <div className="flex items-center gap-2 mt-4 text-dark-400 text-sm">
        <TrendingUp className="w-4 h-4" />
        <span>Best: <strong className="text-dark-200">{maxStreak} days</strong></span>
      </div>
    </div>
  );
}
