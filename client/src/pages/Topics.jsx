import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topics as topicsApi, stats as statsApi } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const [topicsRes, progressRes] = await Promise.all([
        topicsApi.getAll(),
        statsApi.getTopicProgress().catch(() => ({ data: [] }))
      ]);
      
      const progressMap = {};
      progressRes.data.forEach(p => {
        progressMap[p.topic_name] = p.solved_count;
      });

      const mergedTopics = topicsRes.data.map(topic => ({
        ...topic,
        solved_count: progressMap[topic.topic_name] || 0
      }));

      setTopics(mergedTopics);
    } catch (err) {
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Topics</h1>
        <p className="text-slate-400 mt-1">Master data structures and algorithms by topic.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link 
            key={topic.topic_id} 
            to={`/topics/${topic.topic_id}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 hover:shadow-lg transition-all block cursor-pointer group"
          >
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {topic.icon || '📚'} {topic.topic_name}
            </h3>
            {topic.description && (
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{topic.description}</p>
            )}
            
            <div className="space-y-2 mt-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-emerald-500 font-medium">
                  {topic.solved_count || 0} / {topic.total_problems || 0}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${topic.total_problems ? ((topic.solved_count || 0) / topic.total_problems) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
