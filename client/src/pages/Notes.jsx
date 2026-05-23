import { useState, useEffect } from 'react';
import { notes as notesApi } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';
import { FileText, Edit2, Trash2 } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [searchTerm]); // Assuming backend handles search, or we filter frontend

  const fetchNotes = async () => {
    try {
      const { data } = await notesApi.getAll(searchTerm);
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesApi.delete(id);
      setNotes(notes.filter((note) => note.note_id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note. Please try again.');
    }
  };

  if (loading && notes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            Notes
          </h1>
          <p className="text-slate-400 mt-1">Your personal insights and problem-solving patterns.</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchBar 
            value={searchTerm} 
            onSearch={setSearchTerm} 
            placeholder="Search notes..." 
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 text-rose-400">
          {error}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
          No notes found. Create notes on individual problem pages to see them here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div key={note.note_id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{note.problem_title || 'General Note'}</h3>
                <div className="flex gap-2">
                  <button className="text-slate-500 hover:text-emerald-400 transition-colors p-1">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(note.note_id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow text-slate-300 text-sm whitespace-pre-wrap mb-4">
                {note.content}
              </div>
              
              <div className="text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800">
                Last updated: {new Date(note.updated_at || note.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
