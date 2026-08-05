import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Sparkles, X, Maximize2 } from 'lucide-react';
import { EmotionType } from '../types';

interface MemesModuleProps {
  emotion: EmotionType;
  reason?: string;
  onFeedbackSubmit: (improved: boolean) => void;
  onBackToDashboard: () => void;
}

export default function MemesModule({ emotion, reason, onFeedbackSubmit, onBackToDashboard }: MemesModuleProps) {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [copiedMemeId, setCopiedMemeId] = useState<string | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<{
    id: string;
    title: string;
    desc: string;
    imageUrl: string;
    emotions: string[];
    reasons: string[];
  } | null>(null);

  // Helper to dynamically resolve images from src/assets/images or fall back to public
  const resolveMemeImage = (imageUrl: string) => {
    const filename = imageUrl.split('/').pop() || '';
    try {
      return new URL(`../assets/images/${filename}`, import.meta.url).href;
    } catch (e) {
      return imageUrl;
    }
  };

  const memes = [
    {
      id: 'meme-pdf-1',
      title: 'Mental Health in Your Hands 👐',
      desc: 'Me: (wearing extra long sleeves flapping around looking completely helpless)',
      imageUrl: '/assets/images/mental_health_sleeves_meme_1783177121247.jpg',
      emotions: ['Sad', 'Stressed'],
      reasons: ['Study Pressure', 'Work Stress', 'Overwhelming Workload', 'Upcoming Exams / Deadlines', 'Personal Problems', 'Health Concerns', 'Family Matters']
    },
    {
      id: 'meme-pdf-2',
      title: 'Relax Shawty 🐕',
      desc: 'The wise Shibe dog raising its paws to tell you: "Relax shawty, it is fine."',
      imageUrl: '/assets/images/relax_shawty_meme_1783177100834.jpg',
      emotions: ['Stressed', 'Angry', 'Sad'],
      reasons: ['Study Pressure', 'Work Stress', 'Overwhelming Workload', 'Upcoming Exams / Deadlines', 'Relationship Issues', 'Unfair Treatment', 'Disappointment / Let Down', 'Argument with Someone', 'Technology / Bug Annoyances', 'Traffic or Delays']
    },
    {
      id: 'meme-pdf-10',
      title: 'Asthma vs Depression 💬',
      desc: '"Why are you depressed? Life is beautiful!" vs "Why do you have asthma? There is so much air!"',
      imageUrl: '/assets/images/asthma_depression_meme_1783177139433.jpg',
      emotions: ['Sad', 'Stressed'],
      reasons: ['Personal Problems', 'Relationship Issues', 'Study Pressure', 'Work Stress', 'Family Matters', 'Health Concerns', 'Other']
    },
    {
      id: 'meme-pdf-11',
      title: 'Elaichi in Biryani 🍛',
      desc: 'Me eating biryani peacefully vs Elaichi smiling like Champaklal.',
      imageUrl: '/assets/images/elaichi_in_biryani_meme_1783177155109.jpg',
      emotions: ['Angry', 'Stressed'],
      reasons: ['Argument with Someone', 'Technology / Bug Annoyances', 'Disappointment / Let Down', 'Unfair Treatment', 'Traffic or Delays', 'Other']
    },
    {
      id: 'meme-pdf-12',
      title: 'Leaving Exam Hall Transformation 🧟',
      desc: 'Going to Exam Hall (Vidya Balan dancing) vs Leaving Exam Hall (Manjulika possessed)',
      imageUrl: '/assets/images/exam_hall_manjulika_meme_1783177257593.jpg',
      emotions: ['Stressed', 'Sad', 'Angry'],
      reasons: ['Upcoming Exams / Deadlines', 'Study Pressure', 'Overwhelming Workload', 'Other']
    },
    {
      id: 'meme-pdf-13',
      title: 'Exam Week Charging ⚡',
      desc: 'Boy sleeping peacefully with multi-port charger cables taped to his forehead connected to textbooks.',
      imageUrl: '/assets/images/exam_week_charging_meme_1783177170624.jpg',
      emotions: ['Stressed', 'Sad'],
      reasons: ['Upcoming Exams / Deadlines', 'Study Pressure', 'Overwhelming Workload']
    },
    {
      id: 'meme-pdf-14',
      title: 'When Life Hurts... Thoonguu! 😴',
      desc: 'Tamil style stress relief rule: When life hurts, just go to sleep! (Thoonguu!)',
      imageUrl: '/assets/images/thoonguu_sleep_meme_1783177291722.jpg',
      emotions: ['Sad', 'Stressed', 'Angry'],
      reasons: ['Lack of Sleep', 'Overwhelming Workload', 'Work Stress', 'Family Matters', 'Relationship Issues', 'Personal Problems', 'Other']
    },
    {
      id: 'meme-pdf-15',
      title: 'Inka Chalu... Paduko Chinna 🛌',
      desc: 'Junior NTR sweet-smiling comfort template: "Inka Chalu... Paduko Chinna" (Enough now, sleep dear).',
      imageUrl: '/assets/images/paduko_chinna_meme_1783177311276.jpg',
      emotions: ['Sad', 'Stressed', 'Angry', 'Relaxed'],
      reasons: ['Lack of Sleep', 'Upcoming Exams / Deadlines', 'Overwhelming Workload', 'Study Pressure', 'Personal Problems', 'Argument with Someone', 'Other', 'Listening to Music', 'Leisure Activity / Hobby']
    },
    {
      id: 'meme-pdf-16',
      title: 'Jeevitham Chala Nerpistundi... 🧠',
      desc: 'Brahmanandam: "Jeevitham chala nerpistundi... kani nake gurtundadu..!!" (Life teaches lessons, but I never remember!)',
      imageUrl: '/assets/images/brahmi_lessons_meme_1783177208311.jpg',
      emotions: ['Sad', 'Stressed', 'Angry'],
      reasons: ['Study Pressure', 'Work Stress', 'Upcoming Exams / Deadlines', 'Overwhelming Workload', 'Technology / Bug Annoyances', 'Personal Problems', 'Other']
    },
    {
      id: 'meme-pdf-17',
      title: 'Pora Chippu Muthoda 🐱',
      desc: 'Tom waving hand: "Pora Chippu Muthoda" (angry dismissive style).',
      imageUrl: '/assets/images/tom_telugu_meme_1783177224674.jpg',
      emotions: ['Angry', 'Stressed'],
      reasons: ['Argument with Someone', 'Unfair Treatment', 'Disappointment / Let Down', 'Technology / Bug Annoyances', 'Traffic or Delays', 'Other']
    },
    {
      id: 'meme-pdf-18',
      title: 'What a Sudden Suppai 😎',
      desc: 'Hai Sagar, what a sudden surprise!',
      imageUrl: '/assets/images/sudden_surprise_meme_1783177241360.jpg',
      emotions: ['Happy', 'Relaxed'],
      reasons: ['Good News / Event', 'Accomplished a Goal', 'Leisure Activity / Hobby', 'Quality Time with Loved Ones', 'Listening to Music', 'Nature Connection', 'Completed All Work/Tasks', 'Mindfulness or Meditation', 'Other']
    },
    {
      id: 'meme-pdf-19',
      title: 'Eyy Evadra Nuvvu.. 😡',
      desc: 'Brahmanandam highly annoyed: "Eyy evadra nuvvu.."',
      imageUrl: '/assets/images/brahmi_evadra_nuvvu_meme_1783177277385.jpg',
      emotions: ['Angry', 'Stressed'],
      reasons: ['Argument with Someone', 'Unfair Treatment', 'Disappointment / Let Down', 'Technology / Bug Annoyances', 'Traffic or Delays', 'Other']
    },
    {
      id: 'meme-pdf-20',
      title: 'Sem Nunchi Chadavali... 📚',
      desc: 'Me: "Naku enduko ee Sem nunchi chadavali anipistundi" vs My Brain laughing.',
      imageUrl: '/assets/images/study_next_sem_meme_1783177332906.jpg',
      emotions: ['Stressed', 'Sad', 'Happy'],
      reasons: ['Upcoming Exams / Deadlines', 'Study Pressure', 'Accomplished a Goal', 'Other']
    },
    {
      id: 'meme-pdf-21',
      title: 'Depressed But Well Dressed 🦫',
      desc: 'Super stylish and glamorous chinchilla looking incredibly fancy.',
      imageUrl: '/assets/images/depressed_but_well_dressed_meme_1783177188930.jpg',
      emotions: ['Sad', 'Stressed', 'Happy', 'Relaxed'],
      reasons: ['Personal Problems', 'Work Stress', 'Study Pressure', 'Restful Sleep', 'Leisure Activity / Hobby', 'Good News / Event', 'Accomplished a Goal', 'Other']
    }
  ];

  // Dynamic Filtering Logic:
  // 1. First, find memes that match both current emotion and current reason (if provided)
  // 2. If we find at least 2, use those.
  // 3. Otherwise, fallback to memes matching the selected emotion.
  // 4. In any case, we display highly tailored memes rather than all of them!
  const getFilteredMemes = () => {
    let matchesBoth = memes.filter(m => 
      m.emotions.includes(emotion) && 
      (!reason || m.reasons.some(r => r.toLowerCase() === reason.toLowerCase() || reason.toLowerCase().includes(r.toLowerCase())))
    );

    if (matchesBoth.length >= 2) {
      return matchesBoth;
    }

    // Fallback to emotion match only
    const matchesEmotion = memes.filter(m => m.emotions.includes(emotion));
    if (matchesEmotion.length > 0) {
      return matchesEmotion;
    }

    // Ultimate fallback (should not happen, but just in case)
    return memes.slice(0, 4);
  };

  const filteredMemes = getFilteredMemes();

  const handleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
    setShowFeedback(true);
  };

  const handleShare = (id: string) => {
    setCopiedMemeId(id);
    setTimeout(() => {
      setCopiedMemeId(null);
    }, 2000);
  };

  return (
    <div id="memes-module-container" className="max-w-md mx-auto py-6 px-4">
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToDashboard}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Booster Memes
        </span>
        <div className="w-10"></div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 mb-2">
          <Sparkles className="w-5 h-5 animate-pulse text-amber-600" />
        </div>
        <h3 className="text-2xl font-light text-slate-900 tracking-tight">
          Mood Booster <span className="font-semibold">Memes</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Enjoy funny memes tailored to your mood <strong>({emotion})</strong>
          {reason && <span> and reason: <strong className="text-purple-700">"{reason}"</strong></span>}.
        </p>
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {filteredMemes.map((m) => {
          const isLiked = !!likes[m.id];
          const isCopied = copiedMemeId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMeme(m)}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:border-purple-300 hover:scale-[1.02] active:scale-95 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
              title="Click to view full size"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={resolveMemeImage(m.imageUrl)}
                  alt={m.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                
                {/* Click to zoom indicator overlay */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-purple-600/95 text-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 text-[10px] font-bold tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Maximize2 className="w-3 h-3" />
                    <span>View Large 🔍</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-extrabold text-xs tracking-tight">{m.title}</h4>
                  <p className="text-[9px] text-slate-200 mt-0.5 line-clamp-2">{m.desc}</p>
                </div>
                {isCopied && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs font-bold text-purple-300 animate-fade-in">
                    Link Copied! 🔮
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(m.id);
                  }}
                  className={`flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors ${
                    isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isLiked ? 'Loved' : 'Love'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(m.id);
                    }}
                    className="text-slate-400 hover:text-purple-600 cursor-pointer transition-colors p-1 hover:bg-slate-100 rounded-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meme Zoom Overlay Modal */}
      {selectedMeme && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedMeme(null)}
        >
          <div 
            className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <h4 className="font-bold text-slate-900 text-sm tracking-tight">{selectedMeme.title}</h4>
              </div>
              <button
                onClick={() => setSelectedMeme(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Area */}
            <div className="p-4 bg-slate-900 flex items-center justify-center overflow-auto flex-1 min-h-[300px]">
              <img
                src={resolveMemeImage(selectedMeme.imageUrl)}
                alt={selectedMeme.title}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] max-w-full object-contain rounded-xl shadow-lg border border-slate-700"
              />
            </div>

            {/* Modal Footer / Description & Actions */}
            <div className="p-5 border-t border-slate-100 bg-white space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">Meme Context / Meaning</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                  {selectedMeme.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleLike(selectedMeme.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    likes[selectedMeme.id] 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likes[selectedMeme.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{likes[selectedMeme.id] ? 'Loved!' : 'Love Meme'}</span>
                </button>

                <button
                  onClick={() => handleShare(selectedMeme.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    copiedMemeId === selectedMeme.id
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedMemeId === selectedMeme.id ? 'Copied Link! 🔮' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Button to rate mood if feedback not showing yet */}
      {!showFeedback && (
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 cursor-pointer mb-6 transition-all active:scale-95"
        >
          Rate My Experience
        </button>
      )}

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm text-center space-y-4">
          <div className="text-4xl animate-bounce">😂</div>
          <div className="space-y-1">
            <h4 className="text-lg font-light text-slate-900 tracking-tight">
              Do you feel better <span className="font-semibold">after watching memes?</span>
            </h4>
            <p className="text-xs text-slate-500">Your feedback helps us measure the therapeutic impact.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onFeedbackSubmit(true)}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
            >
              Yes, I feel better 😊
            </button>
            <button
              onClick={() => onFeedbackSubmit(false)}
              className="py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
            >
              No, Still same 😐
            </button>
          </div>

          <button
            onClick={onBackToDashboard}
            className="w-full text-xs font-semibold text-slate-500 hover:text-purple-600 cursor-pointer mt-2 transition-colors"
          >
            Change Module
          </button>
        </div>
      )}
    </div>
  );
}
