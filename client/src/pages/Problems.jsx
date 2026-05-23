import { useState, useEffect } from 'react';
import { problems as problemsApi } from '../api/api';
import DifficultyBadge from '../components/common/DifficultyBadge';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';
import { ExternalLink, Bookmark, Plus, CheckCircle, FileText } from 'lucide-react';
import AddSubmissionModal from '../components/common/AddSubmissionModal';
import AddNoteModal from '../components/common/AddNoteModal';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await problemsApi.getAll();
      setProblems(data.problems || data);
    } catch (err) {
      setError('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (id) => {
    try {
      await problemsApi.toggleBookmark(id);
      // Optimistic update could go here
      fetchProblems();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Problems</h1>
          <p className="text-slate-400 mt-1">Practice and track your DSA problems.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar 
            value={searchTerm} 
            onSearch={setSearchTerm} 
            placeholder="Search problems..." 
          />
          {/* Admin only button placeholder */}
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Problem</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium">Topic</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No problems found.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => (
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
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {problem.topic_name || 'General'}
                      </span>
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
                        <button 
                          onClick={() => { setSelectedProblem(problem); setIsNoteModalOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                          title="Add Note"
                        >
                          <FileText className="w-4 h-4" />
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
        onSuccess={fetchProblems}
      />
      
      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => { setIsNoteModalOpen(false); setSelectedProblem(null); }}
        problem={selectedProblem}
        onSuccess={() => {}}
      />
    </div>
  );
}
