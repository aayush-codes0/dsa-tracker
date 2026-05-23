import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { stats as statsApi } from '../api/api';
import StatsCards from '../components/dashboard/StatsCards';
import StreakDisplay from '../components/dashboard/StreakDisplay';
import Heatmap from '../components/dashboard/Heatmap';
import RecentSubmissions from '../components/dashboard/RecentSubmissions';
import DifficultyPieChart from '../components/dashboard/DifficultyPieChart';
import TopicProgressChart from '../components/dashboard/TopicProgressChart';
import WeeklyActivityChart from '../components/dashboard/WeeklyActivityChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          dashboardRes,
          heatmapRes,
          weeklyRes,
          topicRes
        ] = await Promise.all([
          statsApi.getDashboard(),
          statsApi.getHeatmap(),
          statsApi.getWeeklyActivity(),
          statsApi.getTopicProgress()
        ]);
        
        setStats(dashboardRes.data);
        setHeatmapData(heatmapRes.data);
        setWeeklyData(weeklyRes.data);
        setTopicData(topicRes.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.username}! 👋</h1>
          <p className="text-slate-400 mt-1">Here's your DSA progress overview.</p>
        </div>
        <StreakDisplay currentStreak={stats?.current_streak} maxStreak={stats?.max_streak} />
      </div>

      <StatsCards data={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Heatmap data={heatmapData} />
          <WeeklyActivityChart data={weeklyData} />
          <TopicProgressChart data={topicData} />
        </div>
        <div className="space-y-6">
          <DifficultyPieChart data={stats} />
          <RecentSubmissions />
        </div>
      </div>
    </div>
  );
}
