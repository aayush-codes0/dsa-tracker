import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Skeleton } from '../common/LoadingSpinner';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-dark-100 mb-1">{label}</p>
      <p className="text-xs text-emerald-400">Solved: {payload[0]?.value}</p>
      {payload[1] && <p className="text-xs text-dark-400">Total: {payload[1]?.value}</p>}
    </div>
  );
};

export default function TopicProgressChart({ data = [], loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const chartData = data.map((t) => ({
    name: t.topic_name || t.name,
    solved: t.solved_count || 0,
    total: t.total_count || 0,
    color: t.color_hex || '#10b981',
  }));

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-dark-100 mb-6">Topic Progress</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-dark-500 text-center py-12">No topic data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 42)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
            <Bar dataKey="solved" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
