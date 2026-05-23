import { useState, useEffect } from 'react';
import { sheets as sheetsApi } from '../api/api';
import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Sheets() {
  const [sheetsList, setSheetsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sheetsApi.getAll()
      .then(res => setSheetsList(res.data.sheets))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Practice Sheets</h1>
        <p className="text-dark-400">Curated problem lists to guide your preparation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheetsList.map(sheet => (
          <Link key={sheet.sheet_id} to={`/sheets/${sheet.sheet_id}`} className="glass-card p-6 flex flex-col hover:border-emerald-500/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl group-hover:bg-emerald-500/20 transition-colors">
                {sheet.icon || '📄'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-100">{sheet.name}</h3>
                <p className="text-sm text-dark-400">{sheet.total_problems} problems</p>
              </div>
            </div>
            
            <p className="text-sm text-dark-300 mb-6 flex-1">{sheet.description}</p>
            
            <div className="mt-auto">
              <div className="flex justify-between text-xs text-dark-400 mb-2">
                <span>Progress</span>
                <span>{sheet.user_solved_count} / {sheet.total_problems}</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${sheet.total_problems ? (sheet.user_solved_count / sheet.total_problems) * 100 : 0}%` }}
                />
              </div>
              <div className="mt-4 flex items-center text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Sheet <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
