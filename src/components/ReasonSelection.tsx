import { ArrowLeft, ChevronRight, GraduationCap, Briefcase, Heart, Moon, User as UserIcon, AlertCircle, Smile, Flame, ShieldCheck, Sun, Music, Trees } from 'lucide-react';
import { EmotionType } from '../types';

interface ReasonSelectionProps {
  emotion: EmotionType;
  onSelectReason: (reason: string) => void;
  onBack: () => void;
}

export default function ReasonSelection({ emotion, onSelectReason, onBack }: ReasonSelectionProps) {
  // Define reason options for each emotion
  const getReasonsForEmotion = (emo: EmotionType) => {
    switch (emo) {
      case 'Sad':
        return [
          { text: 'Study Pressure', icon: GraduationCap, color: 'text-amber-400 bg-amber-500/10' },
          { text: 'Work Stress', icon: Briefcase, color: 'text-sky-400 bg-sky-500/10' },
          { text: 'Relationship Issues', icon: Heart, color: 'text-rose-400 bg-rose-500/10' },
          { text: 'Lack of Sleep', icon: Moon, color: 'text-violet-400 bg-violet-500/10' },
          { text: 'Personal Problems', icon: UserIcon, color: 'text-slate-400 bg-slate-500/10' },
          { text: 'Other', icon: AlertCircle, color: 'text-emerald-400 bg-emerald-500/10' },
        ];
      case 'Stressed':
        return [
          { text: 'Overwhelming Workload', icon: Briefcase, color: 'text-indigo-400 bg-indigo-500/10' },
          { text: 'Upcoming Exams / Deadlines', icon: GraduationCap, color: 'text-violet-400 bg-violet-500/10' },
          { text: 'Financial Worry', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10' },
          { text: 'Health Concerns', icon: Heart, color: 'text-rose-400 bg-rose-500/10' },
          { text: 'Family Matters', icon: UserIcon, color: 'text-amber-400 bg-amber-500/10' },
          { text: 'Other', icon: AlertCircle, color: 'text-slate-400 bg-slate-500/10' },
        ];
      case 'Angry':
        return [
          { text: 'Unfair Treatment', icon: AlertCircle, color: 'text-rose-400 bg-rose-500/10' },
          { text: 'Disappointment / Let Down', icon: Heart, color: 'text-pink-400 bg-pink-500/10' },
          { text: 'Traffic or Delays', icon: Flame, color: 'text-orange-400 bg-orange-500/10' },
          { text: 'Argument with Someone', icon: UserIcon, color: 'text-red-400 bg-red-500/10' },
          { text: 'Technology / Bug Annoyances', icon: Flame, color: 'text-slate-400 bg-slate-500/10' },
          { text: 'Other', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10' },
        ];
      case 'Happy':
        return [
          { text: 'Accomplished a Goal', icon: ShieldCheck, color: 'text-yellow-400 bg-yellow-500/10' },
          { text: 'Good News / Event', icon: Smile, color: 'text-green-400 bg-green-500/10' },
          { text: 'Quality Time with Loved Ones', icon: Heart, color: 'text-rose-400 bg-rose-500/10' },
          { text: 'Restful Sleep', icon: Moon, color: 'text-indigo-400 bg-indigo-500/10' },
          { text: 'Perfect Weather', icon: Sun, color: 'text-orange-400 bg-orange-500/10' },
          { text: 'Other', icon: Smile, color: 'text-slate-400 bg-slate-500/10' },
        ];
      case 'Relaxed':
        return [
          { text: 'Listening to Music', icon: Music, color: 'text-violet-400 bg-violet-500/10' },
          { text: 'Nature Connection', icon: Trees, color: 'text-emerald-400 bg-emerald-500/10' },
          { text: 'Completed All Work/Tasks', icon: ShieldCheck, color: 'text-indigo-400 bg-indigo-500/10' },
          { text: 'Mindfulness or Meditation', icon: Smile, color: 'text-teal-400 bg-teal-500/10' },
          { text: 'Leisure Activity / Hobby', icon: Music, color: 'text-purple-400 bg-purple-500/10' },
          { text: 'Other', icon: Smile, color: 'text-slate-400 bg-slate-500/10' },
        ];
    }
  };

  const reasons = getReasonsForEmotion(emotion);

  return (
    <div id="reason-selection-container" className="max-w-md mx-auto py-8 px-4">
      {/* Back button and page status header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 cursor-pointer transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1">
          <div className="w-3 h-1.5 bg-slate-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
          <div className="w-3 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
        <div className="w-10"></div> {/* Spacer to keep header centered */}
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-light text-slate-900 tracking-tight">
          Why are you feeling <span className="font-semibold text-purple-600">{emotion}</span>?
        </h3>
        <p className="text-sm text-slate-600 mt-2">Select the closest reason below.</p>
      </div>

      {/* Lists of reason selectors */}
      <div className="space-y-3">
        {reasons.map((reason, idx) => {
          const IconComponent = reason.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectReason(reason.text)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${reason.color} transition-all`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 text-sm group-hover:text-purple-950">
                  {reason.text}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
