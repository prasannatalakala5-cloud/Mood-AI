import { EmotionType } from '../types';

interface EmotionSelectionProps {
  onSelect: (emotion: EmotionType) => void;
}

export default function EmotionSelection({ onSelect }: EmotionSelectionProps) {
  const emotions: { type: EmotionType; emoji: string; textStyle: string; hoverStyle: string }[] = [
    {
      type: 'Happy',
      emoji: '😊',
      textStyle: 'group-hover:text-amber-400',
      hoverStyle: 'hover:bg-amber-500/10 hover:border-amber-500/30'
    },
    {
      type: 'Sad',
      emoji: '😢',
      textStyle: 'group-hover:text-blue-400',
      hoverStyle: 'hover:bg-blue-500/10 hover:border-blue-500/30'
    },
    {
      type: 'Angry',
      emoji: '😡',
      textStyle: 'group-hover:text-rose-400',
      hoverStyle: 'hover:bg-rose-500/10 hover:border-rose-500/30'
    },
    {
      type: 'Stressed',
      emoji: '😰',
      textStyle: 'group-hover:text-purple-400',
      hoverStyle: 'hover:bg-purple-500/10 hover:border-purple-500/30'
    },
    {
      type: 'Relaxed',
      emoji: '😌',
      textStyle: 'group-hover:text-emerald-400',
      hoverStyle: 'hover:bg-emerald-500/10 hover:border-emerald-500/30'
    }
  ];

  return (
    <div id="emotion-selection-container" className="max-w-2xl mx-auto py-10 px-4 text-center">
      {/* Step Indicators */}
      <div className="flex justify-center items-center gap-2 mb-8 text-xs font-semibold text-slate-500">
        <span className="text-purple-400 font-bold">Select Emotion</span>
        <span>&rarr;</span>
        <span>Select Reason</span>
        <span>&rarr;</span>
        <span>Dashboard</span>
      </div>

      <h2 className="text-3xl font-light text-white tracking-tight mb-2">
        How are you feeling <span className="font-semibold">at this moment?</span>
      </h2>
      <p className="text-slate-400 text-sm mb-10 max-w-md mx-auto">
        Select the emotion that best describes your current state so we can tailor the perfect wellness experience.
      </p>

      {/* Grid containing 5 emotions. */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {emotions.slice(0, 4).map((emo) => (
          <button
            key={emo.type}
            onClick={() => onSelect(emo.type)}
            className={`flex flex-col items-center justify-center p-6 bg-[#140C24] border border-white/5 ${emo.hoverStyle} rounded-3xl shadow-lg hover:shadow-purple-950/20 cursor-pointer transition-all duration-300 hover:scale-[1.03] group`}
          >
            <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
              {emo.emoji}
            </span>
            <span className={`font-bold text-slate-300 text-lg transition-colors ${emo.textStyle}`}>{emo.type}</span>
          </button>
        ))}

        {/* Central/Large Relaxed emoji */}
        <button
          onClick={() => onSelect('Relaxed')}
          className={`col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 bg-[#140C24] border border-white/5 ${emotions[4].hoverStyle} rounded-3xl shadow-lg hover:shadow-purple-950/20 cursor-pointer transition-all duration-300 hover:scale-[1.03] group`}
        >
          <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
            {emotions[4].emoji}
          </span>
          <span className={`font-bold text-slate-300 text-lg transition-colors ${emotions[4].textStyle}`}>{emotions[4].type}</span>
        </button>
      </div>
    </div>
  );
}
