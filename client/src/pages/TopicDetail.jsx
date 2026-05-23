import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { topics as topicsApi, problems as problemsApi } from '../api/api';
import DifficultyBadge from '../components/common/DifficultyBadge';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ExternalLink, Bookmark, CheckCircle, ArrowLeft } from 'lucide-react';
import AddSubmissionModal from '../components/common/AddSubmissionModal';

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTopicDetails();
  }, [id]);

  const fetchTopicDetails = async () => {
    try {
      const { data } = await topicsApi.getById(id);
      setTopic(data);
      setProblems(data.problems || []);
    } catch (err) {
      setError('Failed to load topic details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (problemId) => {
    try {
      await problemsApi.toggleBookmark(problemId);
      // Optimistic update could go here
      fetchTopicDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
        {error || 'Topic not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/topics" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {topic.icon || '📚'} {topic.topic_name}
          </h1>
          <p className="text-slate-400 mt-1">{topic.description}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {problems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No problems in this topic yet.
                  </td>
                </tr>
              ) : (
                problems.map((problem) => (
                  <tr key={problem.problem_id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <StatusBadge status={problem.user_status || 'UNSOLVED'} />
                    </td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                      {problem.title}
                      {problem.problem_url && (
                        <a href={problem.problem_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedProblem(problem); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                          title="Mark Solved"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleBookmark(problem.problem_id)}
                          className={`p-1.5 rounded-lg transition-colors ${problem.is_bookmarked ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                          title="Bookmark"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddSubmissionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProblem(null); }}
        problem={selectedProblem}
        onSuccess={fetchTopicDetails}
      />
    </div>
  );
}
