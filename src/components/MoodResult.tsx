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

  // Determine accurate feedback text based on before & after emotions
  const getFeedbackMessage = (before: EmotionType, after: EmotionType, percent: number) => {
    if (before === 'Happy') {
      if (after === 'Happy') {
        return 'Awesome! You maintained your joyful and cheerful mood throughout the session!';
      } else if (after === 'Relaxed') {
        return 'Wonderful! You transitioned from energetic happiness into a calm and peaceful state.';
      } else {
        return 'We notice your mood took a dip during this session. Take it easy, breathe deeply, and try a soothing activity when you are ready.';
      }
    }

    if (before === 'Relaxed') {
      if (after === 'Happy') {
        return 'Great! Your peaceful state bloomed into bright joy and positive energy!';
      } else if (after === 'Relaxed') {
        return 'Splendid! You maintained a serene and tranquil state of mind throughout.';
      } else {
        return "If your mood dipped, don't worry. Self-care is a continuous journey—take some quiet rest.";
      }
    }

    // Started Sad, Angry, or Stressed
    if (after === 'Happy' || after === 'Relaxed') {
      return 'Wonderful! Your mood improved significantly after your self-care session. Keep up the great work!';
    } else if (after === before) {
      return 'Thank you for taking time for self-care today. Even small pauses help gently realign your thoughts.';
    } else {
      return 'Emotional healing takes time. Be gentle with yourself and feel free to revisit calming music or mini games.';
    }
  };

  // SVG circular properties
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const clampedGaugeVal = Math.max(0, Math.min(100, Math.abs(improvementPercent)));
  const strokeDashoffset = circumference - (clampedGaugeVal / 100) * circumference;
  
  // Dynamic color for ring: green for positive, indigo for neutral/maintained, rose for negative
  const strokeColor = improvementPercent > 0 ? '#10b981' : improvementPercent === 0 ? '#6366f1' : '#f43f5e';
  const bannerBg = improvementPercent >= 0 ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-rose-50 border-rose-200 text-rose-900';

  return (
    <div id="mood-result-container" className="max-w-md mx-auto py-8 px-4 text-center space-y-8 animate-fade-in">
      <div>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center justify-center gap-1.5 w-max mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Session Completed</span>
        </span>
        <h3 className="text-3xl font-light text-slate-900 tracking-tight mt-4">
          Your Mood <span className="font-semibold">Analysis</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">Here is how your emotional state evolved today.</p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-3 items-center gap-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Before */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Before</span>
          <div className="text-5xl">{emojiMap[beforeMood]}</div>
          <span className="text-sm font-semibold text-slate-800">{beforeMood}</span>
        </div>

        {/* Transition arrow */}
        <div className="flex justify-center text-slate-400">
          <ArrowRight className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* After */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">After</span>
          <div className="text-5xl">{emojiMap[afterMood]}</div>
          <span className="text-sm font-semibold text-slate-800">{afterMood}</span>
        </div>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative flex flex-col items-center justify-center py-4">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#e2e8f0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={strokeColor}
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
          <span className="text-2xl font-black text-slate-900">
            {improvementPercent > 0 ? `+${improvementPercent}%` : `${improvementPercent}%`}
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Progress
          </span>
        </div>
      </div>

      {/* Encouraging advice block */}
      <div className={`${bannerBg} border p-5 rounded-2xl`}>
        <p className="text-sm font-medium leading-relaxed">
          "{getFeedbackMessage(beforeMood, afterMood, improvementPercent)}"
        </p>
      </div>

      {/* Persistent Button */}
      <button
        onClick={onGoToHistory}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all cursor-pointer"
      >
        <History className="w-5 h-5" />
        <span>View Mood History</span>
      </button>
    </div>
  );
}
