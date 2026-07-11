import { EmotionType } from '../types';
import { ArrowRight, Sparkles, History } from 'lucide-react';

interface MoodResultProps {
  beforeMood: EmotionType;
  afterMood: EmotionType;
  improvementPercent: number;
  onGoToHistory: () => void;
}

export default function MoodResult({
  beforeMood,
  afterMood,
  improvementPercent,
  onGoToHistory,
}: MoodResultProps) {
  // Map emotions to emojis
  const emojiMap: Record<EmotionType, string> = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😡',
    Stressed: '😰',
    Relaxed: '😌',
  };

  // Determine feedback text
  const getFeedbackMessage = (percent: number) => {
    if (percent > 50) {
      return 'Great! Your mood has improved significantly. Keep smiling and stay positive!';
    } else if (percent > 0) {
      return 'Wonderful! You are feeling better after your therapy sessions. Keep up the good work!';
    } else {
      return 'Thank you for taking time for your wellness. Even a small pause helps realign your energy!';
    }
  };

  // SVG circular properties
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Make sure percent doesn't break rendering
  const clampedPercent = Math.max(0, Math.min(100, improvementPercent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div id="mood-result-container" className="max-w-md mx-auto py-8 px-4 text-center space-y-8 animate-fade-in">
      <div>
        <span className="bg-emerald-950/40 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center justify-center gap-1.5 w-max mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Session Completed</span>
        </span>
        <h3 className="text-3xl font-light text-white tracking-tight mt-4">
          Your Mood <span className="font-semibold">Analysis</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">Here is how your emotional state evolved today.</p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-3 items-center gap-2 bg-[#140C24] p-6 rounded-3xl border border-white/5 shadow-lg shadow-black/25">
        {/* Before */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Before</span>
          <div className="text-5xl">{emojiMap[beforeMood]}</div>
          <span className="text-sm font-semibold text-slate-200">{beforeMood}</span>
        </div>

        {/* Transition arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowRight className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* After */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">After</span>
          <div className="text-5xl">{emojiMap[afterMood]}</div>
          <span className="text-sm font-semibold text-slate-200">{afterMood}</span>
        </div>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative flex flex-col items-center justify-center py-4">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={clampedPercent > 0 ? '#a78bfa' : '#6366f1'}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">
            {improvementPercent >= 0 ? `+${clampedPercent}%` : `${clampedPercent}%`}
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Progress
          </span>
        </div>
      </div>

      {/* Encouraging advice block */}
      <div className="bg-[#1C162E] border border-purple-500/10 p-5 rounded-2xl">
        <p className="text-sm font-medium text-purple-200 leading-relaxed">
          "{getFeedbackMessage(improvementPercent)}"
        </p>
      </div>

      {/* Persistent Button */}
      <button
        onClick={onGoToHistory}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all cursor-pointer"
      >
        <History className="w-5 h-5" />
        <span>View Mood History</span>
      </button>
    </div>
  );
}
