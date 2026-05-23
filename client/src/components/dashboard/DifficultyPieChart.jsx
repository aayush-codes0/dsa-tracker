import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '../common/LoadingSpinner';

const COLORS = {
  Easy: '#10b981',
  Medium: '#f59e0b',
  Hard: '#f43f5e',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 shadow-xl">
      <p className="text-sm text-dark-100">
        <span style={{ color: COLORS[name] }}>{name}</span>: {value}
      </p>
    </div>
  );
};

export default function DifficultyPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="flex justify-center"><Skeleton className="h-48 w-48 rounded-full" /></div>
      </div>
    );
  }

  // Expect data from dashboard stats api
  const chartData = [
    { name: 'Easy', value: data?.easy_count || 0 },
    { name: 'Medium', value: data?.medium_count || 0 },
    { name: 'Hard', value: data?.hard_count || 0 },
  ].filter((d) => d.value > 0);

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-dark-100 mb-4">Difficulty Distribution</h3>
      {total === 0 ? (
        <p className="text-sm text-dark-500 text-center py-12">No data yet</p>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold text-dark-100">{total}</p>
              <p className="text-xs text-dark-500">Solved</p>
            </div>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-5 mt-2">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[d.name] }} />
                <span className="text-xs text-dark-400">
                  {d.name} ({d.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
