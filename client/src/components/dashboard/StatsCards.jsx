import { useEffect, useState } from 'react';
import { Target, Flame, BarChart3, Send } from 'lucide-react';
import { CardSkeleton } from '../common/LoadingSpinner';

/** Animated counter hook */
function useAnimatedCounter(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ icon: Icon, label, value, gradient, delay = 0, children }) {
  const animatedValue = useAnimatedCounter(value);

  return (
    <div
      className="stat-card group hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background glow */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-20
        group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-dark-100">
            {children || animatedValue}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  const totalSolved = data?.total_solved ?? 0;
  const currentStreak = data?.current_streak ?? 0;
  const totalSubmissions = data?.total_submissions ?? 0;
  const easy = data?.easy_count ?? 0;
  const medium = data?.medium_count ?? 0;
  const hard = data?.hard_count ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard
        icon={Target}
        label="Total Solved"
        value={totalSolved}
        gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
        delay={0}
      />

      <StatCard
        icon={Flame}
        label="Current Streak"
        value={currentStreak}
        gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        delay={100}
      />

      <StatCard
        icon={BarChart3}
        label="Difficulty Breakdown"
        gradient="bg-gradient-to-br from-violet-500 to-purple-700"
        delay={200}
        value={0}
      >
        <div className="flex items-center gap-3 mt-1">
          <div className="text-center">
            <span className="text-lg font-bold text-emerald-400">{easy}</span>
            <p className="text-[10px] text-dark-500">Easy</p>
          </div>
          <div className="w-px h-6 bg-dark-700" />
          <div className="text-center">
            <span className="text-lg font-bold text-amber-400">{medium}</span>
            <p className="text-[10px] text-dark-500">Med</p>
          </div>
          <div className="w-px h-6 bg-dark-700" />
          <div className="text-center">
            <span className="text-lg font-bold text-rose-400">{hard}</span>
            <p className="text-[10px] text-dark-500">Hard</p>
          </div>
        </div>
      </StatCard>

      <StatCard
        icon={Send}
        label="Total Submissions"
        value={totalSubmissions}
        gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
        delay={300}
      />
    </div>
  );
}
