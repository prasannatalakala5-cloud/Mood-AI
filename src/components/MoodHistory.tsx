import { useEffect, useState } from 'react';
import { EmotionType, MoodRecord } from '../types';
import { Calendar, Search, RefreshCw, Sparkles, TrendingUp, Filter } from 'lucide-react';

interface MoodHistoryProps {
  authToken: string;
}

export default function MoodHistory({ authToken }: MoodHistoryProps) {
  const [history, setHistory] = useState<MoodRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('All');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mood/history', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load mood logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [authToken]);

  // Map emotions to emojis
  const emojiMap: Record<EmotionType, string> = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😡',
    Stressed: '😰',
    Relaxed: '😌',
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.activities.some((act) => act.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterMood === 'All' || item.beforeMood === filterMood || item.afterMood === filterMood;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="mood-history-container" className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Header Card */}
      <div className="bg-gradient-to-tr from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 text-white shadow-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-light flex items-center gap-2">
            Your Mood <span className="font-semibold">History</span> <TrendingUp className="w-6 h-6 text-purple-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review your healing progress over past sessions.</p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-white/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by reason or therapy activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#140C24] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Filter className="w-4 h-4" />
          </span>
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="w-full bg-[#140C24] border border-white/5 pl-10 pr-4 py-2.5 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            <option value="All">All Moods</option>
            <option value="Happy">Happy</option>
            <option value="Sad">Sad</option>
            <option value="Angry">Angry</option>
            <option value="Stressed">Stressed</option>
            <option value="Relaxed">Relaxed</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-xs">Loading your emotional data ledger...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-[#140C24] border border-white/5 rounded-2xl py-12 px-4 text-center space-y-3">
          <span className="text-4xl">🗒️</span>
          <h4 className="font-semibold text-slate-200 text-sm">No Mood Logs Found</h4>
          <p className="text-slate-400 text-xs max-w-xs mx-auto">
            Once you complete a full session and click Submit, your logged evaluations will display here.
          </p>
        </div>
      ) : (
        <div className="bg-[#140C24] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-4">Before Mood</th>
                  <th className="py-4 px-4">After Mood</th>
                  <th className="py-4 px-4">Improvement</th>
                  <th className="py-4 px-6">Activities Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium text-slate-300">
                {filteredHistory.map((item, idx) => {
                  const itemDate = new Date(item.date).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-2 text-slate-300 whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{itemDate}</span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <span className="text-lg">{emojiMap[item.beforeMood]}</span>
                          <span>{item.beforeMood}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <span className="text-lg">{emojiMap[item.afterMood]}</span>
                          <span>{item.afterMood}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-emerald-950/40 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/20">
                          +{item.improvement}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                        {item.activities.join(', ') || 'General therapy'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
