import { Music, Bird, Smile, Gamepad2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User, EmotionType } from '../types';

interface DashboardProps {
  user: User;
  currentEmotion: EmotionType;
  currentReason: string;
  completedActivities: string[];
  onSelectModule: (moduleName: string) => void;
  onGoToFinalCheck: () => void;
}

export default function Dashboard({
  user,
  currentEmotion,
  currentReason,
  completedActivities,
  onSelectModule,
  onGoToFinalCheck,
}: DashboardProps) {
  const modules = [
    {
      name: 'Music Therapy',
      desc: 'Relax with soothing, handpicked music tailored to your emotion.',
      icon: Music,
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/10',
      bgLight: 'bg-purple-950/20',
      badge: 'Music Therapy',
    },
    {
      name: 'AI Pet',
      desc: 'Nurture your cute AI companion pet by completing daily wellness tasks!',
      icon: Bird,
      color: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/10',
      bgLight: 'bg-indigo-950/20',
      badge: 'AI Pet Companion',
    },
    {
      name: 'Mood Memes',
      desc: 'Enjoy hilarious memes and motivational booster cards.',
      icon: Smile,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
      bgLight: 'bg-amber-950/20',
      badge: 'Enjoy Memes',
    },
    {
      name: 'Mini Games',
      desc: 'Play fun, calming classic mini-games to unwind your mind.',
      icon: Gamepad2,
      color: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/10',
      bgLight: 'bg-rose-950/20',
      badge: 'Play Games',
    },
  ];

  return (
    <div id="dashboard-container" className="max-w-4xl mx-auto py-6 px-4">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-500/20 rounded-3xl p-6 md:p-8 text-white shadow-md mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <Gamepad2 className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Active Session
          </span>
          <h2 className="text-3xl font-light mt-3 tracking-tight">
            Hello, <span className="font-semibold">{user.displayName}</span> 👋
          </h2>
          <p className="text-purple-100 text-sm mt-2 max-w-lg leading-relaxed">
            We're here to improve your mood. You started today feeling{' '}
            <strong className="underline text-white font-semibold">
              {currentEmotion}
            </strong>{' '}
            due to <span className="font-semibold text-white">"{currentReason}"</span>.
          </p>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Choose a Mood Enhancer</h3>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
          {completedActivities.length} of 4 Explored
        </span>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const IconComp = mod.icon;
          const isCompleted = completedActivities.includes(mod.name);
          return (
            <div
              key={mod.name}
              onClick={() => onSelectModule(mod.name)}
              className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.01]"
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Explored</span>
                </div>
              )}
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.color} text-white flex items-center justify-center mb-4 shadow-md ${mod.shadow} group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-all">
                  {mod.name}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{mod.desc}</p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 group-hover:text-purple-600 transition-colors">
                  {mod.badge}
                </span>
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-purple-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action to proceed to Final Mood Check */}
      <div className="mt-10 text-center">
        {completedActivities.length > 0 ? (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-purple-900 text-sm font-semibold mb-3">
              🎉 Nice job exploring the therapy modules! Ready to record your mood and check the results?
            </p>
            <button
              onClick={onGoToFinalCheck}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-purple-500/20 cursor-pointer hover:shadow-purple-500/30 transition-all active:scale-95"
            >
              <span>Submit & Check Mood Progress</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-slate-500 text-xs">
              💡 Select any module above to begin. You can explore as many as you wish before finalizing your session!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
