import { useState } from 'react';
import { EmotionType } from '../types';

interface FinalMoodCheckProps {
  onSubmit: (finalEmotion: EmotionType) => void;
}

export default function FinalMoodCheck({ onSubmit }: FinalMoodCheckProps) {
  const [selected, setSelected] = useState<EmotionType | null>(null);

  const options: { type: EmotionType; emoji: string; color: string; border: string; bg: string }[] = [
    { type: 'Happy', emoji: '😊', color: 'text-amber-500', border: 'border-white/5', bg: 'bg-[#140C24]' },
    { type: 'Sad', emoji: '😢', color: 'text-blue-500', border: 'border-white/5', bg: 'bg-[#140C24]' },
    { type: 'Angry', emoji: '😡', color: 'text-rose-500', border: 'border-white/5', bg: 'bg-[#140C24]' },
    { type: 'Stressed', emoji: '😰', color: 'text-purple-500', border: 'border-white/5', bg: 'bg-[#140C24]' },
    { type: 'Relaxed', emoji: '😌', color: 'text-emerald-500', border: 'border-white/5', bg: 'bg-[#140C24]' },
  ];

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

  return (
    <div id="final-mood-check-container" className="max-w-md mx-auto py-10 px-4 text-center animate-fade-in">
      {/* Indicator */}
      <div className="flex gap-1 justify-center mb-6">
        <div className="w-3 h-1.5 bg-slate-200 rounded-full"></div>
        <div className="w-3 h-1.5 bg-slate-200 rounded-full"></div>
        <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
      </div>

      <h3 className="text-3xl font-light text-slate-900 tracking-tight mb-2">
        How are you feeling <span className="font-semibold">now?</span>
      </h3>
      <p className="text-sm text-slate-600 mb-8">Select your current mood to measure your progress.</p>

      {/* Row of Emojis */}
      <div className="grid grid-cols-5 gap-2.5 mb-10">
        {options.map((opt) => {
          const isSelected = selected === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setSelected(opt.type)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 border-transparent shadow-md shadow-purple-500/20 text-white scale-105'
                  : 'bg-white border-slate-200 hover:border-purple-300 text-slate-600 shadow-sm'
              }`}
            >
              <span className={`text-4xl mb-2`}>{opt.emoji}</span>
              <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                {opt.type}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-30 text-white font-bold rounded-2xl shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer"
      >
        Submit final evaluation
      </button>
    </div>
  );
}
