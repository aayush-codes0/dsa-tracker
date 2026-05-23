import { useMemo, useState } from 'react';
import { Skeleton } from '../common/LoadingSpinner';

/**
 * GitHub-style contribution heatmap calendar.
 * Displays 52 weeks × 7 days of activity squares with intensity-based coloring.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getIntensity(count) {
  if (!count || count === 0) return 'bg-dark-800 border-dark-700/50';
  if (count <= 1) return 'bg-emerald-900/70 border-emerald-800/50';
  if (count <= 2) return 'bg-emerald-700/70 border-emerald-600/50';
  if (count <= 4) return 'bg-emerald-600/80 border-emerald-500/50';
  return 'bg-emerald-500 border-emerald-400/50';
}

export default function Heatmap({ data = [], loading }) {
  const [tooltip, setTooltip] = useState(null);

  // Build a map of date → count from the API data
  const dateMap = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      let key = d.date || d.activity_date;
      if (key) {
        // If key is a Date object or ISO string, extract just the YYYY-MM-DD part
        if (typeof key === 'string' && key.includes('T')) {
          key = key.split('T')[0];
        } else if (key instanceof Date) {
          key = key.toISOString().split('T')[0];
        }
        map[key] = d.problems_solved ?? d.count ?? 0;
      }
    });
    return map;
  }, [data]);

  // Generate 52 weeks of date cells ending today
  const cells = useMemo(() => {
    const today = new Date();
    const weeks = [];
    // Go back ~364 days to fill 52 full weeks
    const start = new Date(today);
    start.setDate(start.getDate() - 363 - start.getDay()); // align to Sunday

    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const key = date.toISOString().split('T')[0];
        week.push({
          date: key,
          count: dateMap[key] || 0,
          isToday: key === today.toISOString().split('T')[0],
          isFuture: date > today,
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [dateMap]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    cells.forEach((week, i) => {
      const month = new Date(week[0].date).getMonth();
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], col: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [cells]);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in overflow-x-auto">
      <h3 className="text-lg font-semibold text-dark-100 mb-4">Contribution Activity</h3>

      <div className="inline-flex flex-col gap-0 min-w-[720px]">
        {/* Month labels */}
        <div className="flex ml-8 mb-1">
          {monthLabels.map(({ label, col }, i) => (
            <span
              key={i}
              className="text-[10px] text-dark-500 absolute"
              style={{ marginLeft: `${col * 14}px`, position: 'relative' }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-2 pt-0">
            {DAY_LABELS.map((label, i) => (
              <span key={i} className="text-[10px] text-dark-500 h-[11px] leading-[11px]">
                {label}
              </span>
            ))}
          </div>

          {/* Grid of squares */}
          <div className="flex gap-[3px]">
            {cells.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    className={`w-[11px] h-[11px] rounded-[2px] border cursor-pointer
                      transition-all duration-150 hover:scale-150 hover:z-10 relative
                      ${cell.isFuture ? 'bg-dark-900/30 border-transparent' : getIntensity(cell.count)}
                      ${cell.isToday ? 'ring-1 ring-emerald-400' : ''}`}
                    onMouseEnter={(e) => {
                      const rect = e.target.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        date: cell.date,
                        count: cell.count,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 ml-8">
          <span className="text-[10px] text-dark-500 mr-1">Less</span>
          {[0, 1, 2, 4, 5].map((count) => (
            <div
              key={count}
              className={`w-[11px] h-[11px] rounded-[2px] border ${getIntensity(count)}`}
            />
          ))}
          <span className="text-[10px] text-dark-500 ml-1">More</span>
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg
            shadow-xl text-xs text-dark-200 pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <strong>{tooltip.count} problem{tooltip.count !== 1 ? 's' : ''}</strong> on{' '}
          {new Date(tooltip.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
    </div>
  );
}
