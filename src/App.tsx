import { useState, useEffect } from 'react';
import { User, EmotionType, MoodRecord } from './types';
import Login from './components/Login';
import PreferencesSelection from './components/PreferencesSelection';
import EmotionSelection from './components/EmotionSelection';
import ReasonSelection from './components/ReasonSelection';
import Dashboard from './components/Dashboard';
import MusicModule from './components/MusicModule';
import AIPetModule, { getPetState, savePetState } from './components/AIPetModule';
import MemesModule from './components/MemesModule';
import GamesModule from './components/GamesModule';
import FinalMoodCheck from './components/FinalMoodCheck';
import MoodResult from './components/MoodResult';
import MoodHistory from './components/MoodHistory';
import Navbar from './components/Navbar';
import { Sparkles, Trophy, Flame, User as UserIcon, Heart, ChevronRight, Check, Edit2, RefreshCw, Music, Settings, Bell } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'profile'>('home');

  // User preferences
  const [userGender, setUserGender] = useState<'Male' | 'Female' | 'Prefer not to say'>(() => {
    return (localStorage.getItem('moodai_gender') as any) || 'Prefer not to say';
  });
  const [userLanguage, setUserLanguage] = useState<'Telugu' | 'English' | 'Hindi'>(() => {
    return (localStorage.getItem('moodai_language') as any) || 'English';
  });

  // Dynamic state for Companion Pet customizer
  const [pet, setPet] = useState<any>(null);
  const [isEditingPet, setIsEditingPet] = useState<boolean>(false);
  const [editPetName, setEditPetName] = useState<string>('');
  const [editPetType, setEditPetType] = useState<'dog' | 'cat' | 'rabbit' | 'panda' | 'owl' | 'bird'>('bird');

  // Dynamic self-care reminders & mindfulness indicators
  const [mindfulnessCore, setMindfulnessCore] = useState<number>(() => {
    const saved = localStorage.getItem('moodai_mindfulness_score');
    return saved ? parseInt(saved, 10) : 80; // dynamic default 80
  });
  
  const [selfCareTip, setSelfCareTip] = useState<string>(() => {
    const saved = localStorage.getItem('moodai_active_tip');
    return saved || "Take 3 deep, slow belly breaths. Inhale positivity, exhale tension.";
  });
  const [showTipGlow, setShowTipGlow] = useState<boolean>(false);

  // Session state flow
  const [stage, setStage] = useState<'auth' | 'select-preferences' | 'select-emotion' | 'select-reason' | 'dashboard' | 'music' | 'pet' | 'memes' | 'games' | 'final-check' | 'result'>('auth');
  
  const [startEmotion, setStartEmotion] = useState<EmotionType | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [improvedFeedbackCount, setImprovedFeedbackCount] = useState<number>(0);
  const [finalEmotion, setFinalEmotion] = useState<EmotionType | null>(null);
  const [sessionImprovement, setSessionImprovement] = useState<number>(0);

  // Sync pet profile on tab changes
  useEffect(() => {
    if (user) {
      const activePet = getPetState();
      setPet(activePet);
      if (activePet) {
        setEditPetName(activePet.petName || 'Chirpy');
        setEditPetType(activePet.petType || 'bird');
      }
    }
  }, [activeTab, stage, user]);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('moodai_token');
    const savedUser = localStorage.getItem('moodai_user');
    if (savedToken && savedUser) {
      try {
        setSessionToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // If they already have preferences stored, proceed straight to emotion selection
        const savedGender = localStorage.getItem('moodai_gender');
        const savedLang = localStorage.getItem('moodai_language');
        if (savedGender && savedLang) {
          setStage('select-emotion');
        } else {
          setStage('select-preferences');
        }
      } catch (e) {
        localStorage.removeItem('moodai_token');
        localStorage.removeItem('moodai_user');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setSessionToken(loggedInUser.token || '');
    
    // Check if they have saved preferences
    const savedGender = localStorage.getItem('moodai_gender');
    const savedLang = localStorage.getItem('moodai_language');
    if (savedGender && savedLang) {
      setStage('select-emotion');
    } else {
      setStage('select-preferences');
    }
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('moodai_token');
    localStorage.removeItem('moodai_user');
    setUser(null);
    setSessionToken('');
    setStage('auth');
    setStartEmotion(null);
    setSelectedReason('');
    setCompletedActivities([]);
    setImprovedFeedbackCount(0);
    setFinalEmotion(null);
  };

  const handleSelectEmotion = (emo: EmotionType) => {
    setStartEmotion(emo);
    setStage('select-reason');
  };

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason);
    setStage('dashboard');
  };

  const handleSelectModule = (moduleName: string) => {
    if (moduleName === 'Music Therapy') setStage('music');
    else if (moduleName === 'AI Pet') {
      // Mark as explored when they visit
      if (!completedActivities.includes('AI Pet')) {
        setCompletedActivities((prev) => [...prev, 'AI Pet']);
      }
      setStage('pet');
    }
    else if (moduleName === 'Mood Memes') setStage('memes');
    else if (moduleName === 'Mini Games') setStage('games');
  };

  const handleModuleFeedback = (improved: boolean) => {
    // Record explored module
    let activeModule = '';
    let coinsToAdd = 0;
    let happinessToAdd = 0;
    let missionType: 'music' | 'meme' | 'game' | null = null;
    let achievementToUnlock: string | null = null;

    if (stage === 'music') {
      activeModule = 'Music Therapy';
      coinsToAdd = 5;
      happinessToAdd = 5;
      missionType = 'music';
      achievementToUnlock = 'Music Lover';
    } else if (stage === 'memes') {
      activeModule = 'Mood Memes';
      coinsToAdd = 3;
      happinessToAdd = 3;
      missionType = 'meme';
      achievementToUnlock = 'Meme Explorer';
    } else if (stage === 'games') {
      activeModule = 'Mini Games';
      coinsToAdd = 10;
      happinessToAdd = 10;
      missionType = 'game';
      achievementToUnlock = 'Game Champion';
    }

    if (activeModule && !completedActivities.includes(activeModule)) {
      setCompletedActivities((prev) => [...prev, activeModule]);
    }

    if (improved) {
      setImprovedFeedbackCount((c) => c + 1);
    }

    // Reward Pet!
    if (coinsToAdd > 0) {
      const petState = getPetState();
      // Ensure coins property is initialized safely
      if (typeof petState.coins !== 'number') {
        petState.coins = 50;
      }
      petState.coins += coinsToAdd;
      petState.happiness = Math.min(100, Math.max(0, petState.happiness + happinessToAdd));

      // Track missions safely if the structures match
      if (petState.missions) {
        if (missionType === 'music' && 'listenSong' in petState.missions) {
          (petState.missions as any).listenSong = true;
        }
        if (missionType === 'meme' && 'watchMeme' in petState.missions) {
          (petState.missions as any).watchMeme = true;
        }
        if (missionType === 'game' && 'playGame' in petState.missions) {
          (petState.missions as any).playGame = true;
        }
      }

      // Unlock achievements
      if (achievementToUnlock && petState.unlockedAchievements && !petState.unlockedAchievements.includes(achievementToUnlock)) {
        petState.unlockedAchievements.push(achievementToUnlock);
      }

      savePetState(petState);
    }

    setStage('dashboard');
  };

  const handleGoToFinalCheck = () => {
    setStage('final-check');
  };

  // Calculates a logical improvement score based on starting vs ending emotional delta
  const calculateImprovement = (before: EmotionType, after: EmotionType): number => {
    const weights: Record<EmotionType, number> = {
      Angry: 20,
      Sad: 30,
      Stressed: 40,
      Relaxed: 85,
      Happy: 100,
    };

    const diff = weights[after] - weights[before];
    return diff;
  };

  const handleFinalMoodSubmit = async (endingEmotion: EmotionType) => {
    setFinalEmotion(endingEmotion);
    const improvement = calculateImprovement(startEmotion!, endingEmotion);
    setSessionImprovement(improvement);

    // Increment Mindfulness Core dynamically!
    const currentCore = parseInt(localStorage.getItem('moodai_mindfulness_score') || '80', 10);
    const newCore = Math.min(100, currentCore + 4);
    setMindfulnessCore(newCore);
    localStorage.setItem('moodai_mindfulness_score', newCore.toString());

    // Update Wellness Streak
    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveStr = localStorage.getItem('moodai_last_active_date');
    let currentStreakValue = parseInt(localStorage.getItem('moodai_streak') || '3', 10);
    
    if (lastActiveStr !== todayStr) {
      if (lastActiveStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (lastActiveStr === yesterdayStr) {
          currentStreakValue += 1;
        } else {
          currentStreakValue = 1; // reset if missed a day
        }
      } else {
        currentStreakValue = 1; // first log
      }
      localStorage.setItem('moodai_streak', currentStreakValue.toString());
      localStorage.setItem('moodai_last_active_date', todayStr);
    }

    // Reward Pet for Mood Improvement!
    if (improvement > 0) {
      const petState = getPetState();
      // Safely ensure coins exists
      if (typeof petState.coins !== 'number') {
        petState.coins = 50;
      }
      petState.coins += 25; // Nice reward of 25 coins for completing the mood improvement journey
      petState.happiness = Math.min(100, petState.happiness + 15);
      
      // Update pet's streak if they have one active
      if (petState.petSelected) {
        petState.streak = currentStreakValue;
      }

      if (improvement >= 50 && petState.unlockedAchievements && !petState.unlockedAchievements.includes('Mood Master')) {
        petState.unlockedAchievements.push('Mood Master');
      }

      savePetState(petState);
      setPet(petState);
    }

    // Save full session to server
    try {
      await fetch('/api/mood/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          beforeMood: startEmotion,
          afterMood: endingEmotion,
          reason: selectedReason,
          improvement: improvement,
          activities: completedActivities,
        }),
      });
    } catch (err) {
      console.error('Failed to log session backend:', err);
    }

    setStage('result');
  };

  const handleStartNewSession = () => {
    setStartEmotion(null);
    setSelectedReason('');
    setCompletedActivities([]);
    setImprovedFeedbackCount(0);
    setFinalEmotion(null);
    setStage('select-emotion');
    setActiveTab('home');
  };

  // Navbar redirects
  const handleTabChange = (tab: 'home' | 'history' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home') {
      // Return to whichever stage is active in current session flow
      if (stage === 'auth') {
        setStage(user ? 'select-emotion' : 'auth');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 relative overflow-hidden">
      {/* Outer Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Main Container */}
      <main className="relative z-10 w-full px-4 pt-6 max-w-lg mx-auto">
        {/* App Title Header Bar (Only if logged in) */}
        {user && (
          <header className="flex justify-between items-center mb-6 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-sm text-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <span className="font-light text-slate-900 tracking-tight text-sm">Mood<span className="font-semibold text-purple-600">AI</span></span>
            </div>
            {startEmotion && (
              <button
                onClick={handleStartNewSession}
                className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                Reset Session
              </button>
            )}
          </header>
        )}

        {/* Tab Routing logic */}
        {activeTab === 'history' && user ? (
          <MoodHistory authToken={sessionToken} />
        ) : activeTab === 'profile' && user ? (
          /* Profile Tab View - Fully Interactive & Customized */
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto shadow-md shadow-purple-500/20">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-light text-slate-900">{user.displayName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              </div>
              
              <div className="pt-3 border-t border-slate-100 flex justify-center gap-3 text-xs font-semibold">
                <span className="bg-slate-50 px-3 py-1.5 rounded-xl text-slate-700 border border-slate-200">
                  Gender: <strong className="text-purple-600">{userGender}</strong>
                </span>
                <span className="bg-slate-50 px-3 py-1.5 rounded-xl text-slate-700 border border-slate-200">
                  Music: <strong className="text-purple-600">{userLanguage}</strong>
                </span>
              </div>
              
              <button
                onClick={() => {
                  setStage('select-preferences');
                  setActiveTab('home');
                }}
                className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-all cursor-pointer mt-1"
              >
                Change Preferences
              </button>
            </div>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/50" />
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-1.5 animate-pulse" />
                <span className="block text-2xl font-bold text-slate-900">
                  {pet && pet.petSelected ? pet.streak : (localStorage.getItem('moodai_streak') || 3)} Days
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Wellness Streak</span>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-1.5" />
                <span className="block text-2xl font-bold text-slate-900">{mindfulnessCore}%</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Mindfulness Core</span>
              </div>
            </div>

            {/* Companion Pet Adoption & Profile Deck */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  🐾 Active Companion
                </span>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  {pet && pet.petSelected ? 'Adopted' : 'Unbound'}
                </span>
              </div>

              {!pet || !pet.petSelected ? (
                /* No Pet Adopted Card */
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You do not have an active pet companion yet! A virtual companion helps you stay mindful and tracks your therapy progress.
                  </p>
                  <button
                    onClick={() => {
                      setStage('pet');
                      setActiveTab('home');
                    }}
                    className="py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    Adopt your Companion Pet
                  </button>
                </div>
              ) : (
                /* Active Pet Display & Customizer */
                <div className="space-y-3">
                  {!isEditingPet ? (
                    /* Display Mode */
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-4xl shadow-inner animate-[bounce_2.5s_infinite_ease-in-out]">
                        {pet.petType === 'dog' && '🐶'}
                        {pet.petType === 'cat' && '🐱'}
                        {pet.petType === 'rabbit' && '🐰'}
                        {pet.petType === 'panda' && '🐼'}
                        {pet.petType === 'owl' && '🦉'}
                        {pet.petType === 'bird' && '🐦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-base truncate flex items-center gap-1.5">
                          {pet.petName}
                          <span className="text-[10px] font-semibold text-slate-500 capitalize">
                            ({pet.petType})
                          </span>
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Growth: <strong>Day {pet.age}</strong></span>
                          <span>•</span>
                          <span className="text-amber-600 flex items-center gap-0.5 font-bold">
                            🪙 {pet.coins}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditPetName(pet.petName);
                          setEditPetType(pet.petType);
                          setIsEditingPet(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
                        title="Edit Pet Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* Edit Mode Form */
                    <div className="space-y-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Companion Name
                        </label>
                        <input
                          type="text"
                          value={editPetName}
                          onChange={(e) => setEditPetName(e.target.value.slice(0, 15))}
                          className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Companion Species
                        </label>
                        <div className="grid grid-cols-6 gap-1">
                          {(['dog', 'cat', 'rabbit', 'panda', 'owl', 'bird'] as const).map((type) => {
                            const emMap = { dog: '🐶', cat: '🐱', rabbit: '🐰', panda: '🐼', owl: '🦉', bird: '🐦' };
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setEditPetType(type)}
                                className={`py-1.5 rounded-lg text-lg flex items-center justify-center border transition-all cursor-pointer ${
                                  editPetType === type
                                    ? 'bg-purple-500/20 border-purple-400'
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                }`}
                                title={type}
                              >
                                {emMap[type]}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            const updated = {
                              ...pet,
                              petName: editPetName,
                              petType: editPetType,
                            };
                            savePetState(updated);
                            setPet(updated);
                            setIsEditingPet(false);
                          }}
                          className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditingPet(false)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Self-Care Reminders Deck */}
            <div className="bg-[#140C24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                  Self-Care Reminder
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Daily Mindsets</span>
              </div>

              {/* Dynamic Affirmation Tip */}
              <div className={`p-4 bg-gradient-to-tr from-[#191030]/50 to-[#0f071f]/50 border border-purple-500/15 rounded-2xl space-y-2 relative transition-all duration-300 ${
                showTipGlow ? 'scale-[1.01] ring-2 ring-purple-500/30' : ''
              }`}>
                <p className="text-xs text-slate-200 leading-relaxed italic font-normal">
                  "{selfCareTip}"
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      const tips = [
                        "Take 3 deep, slow belly breaths. Inhale positivity, exhale tension. 💨",
                        "Stretch your arms above your head, roll your shoulders, and relax your jaw. 🧘",
                        "Drink a glass of fresh water to hydrate and recharge your energy. 💧",
                        "Name 3 simple things you are genuinely grateful for in this exact moment. ✨",
                        "Close your eyes for 30 seconds and let your mind rest in complete silence. 🤫",
                        "Give yourself a gentle templates massage to release mental fatigue. 💆",
                        "Acknowledge one personal strength or small success you achieved recently. 🏆",
                        "Smile gently for 10 seconds. Smiling triggers positive chemistry in your body. 😊"
                      ];
                      
                      // Choose a different tip
                      let nextTip = tips[Math.floor(Math.random() * tips.length)];
                      while (nextTip === selfCareTip) {
                        nextTip = tips[Math.floor(Math.random() * tips.length)];
                      }
                      
                      setShowTipGlow(true);
                      setTimeout(() => setShowTipGlow(false), 500);
                      
                      setSelfCareTip(nextTip);
                      localStorage.setItem('moodai_active_tip', nextTip);
                    }}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded-lg transition-all border border-purple-500/20 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New Exercise</span>
                  </button>
                  <span className="text-[9px] text-slate-500 font-medium">Interactive Guide</span>
                </div>
              </div>

              {/* Reminder Settings Form */}
              <div className="space-y-3 bg-[#1C162E]/20 rounded-xl p-3 border border-white/5 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1"><Bell className="w-3.5 h-3.5 text-purple-400" /> Reminder Schedule</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Automatic Alerts</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-500 block">Focus Focus</label>
                    <select
                      value={localStorage.getItem('moodai_reminder_focus') || 'breathing'}
                      onChange={(e) => {
                        localStorage.setItem('moodai_reminder_focus', e.target.value);
                        // Trigger simple alert
                        alert(`Reminder focus changed to: ${e.target.value === 'breathing' ? 'Breathing Breaks' : 'Mindfulness Reflections'}`);
                      }}
                      className="w-full bg-slate-950 border border-white/5 py-1.5 px-2 rounded-lg text-[11px] text-slate-300 focus:outline-none"
                    >
                      <option value="breathing">Breathing Breaks</option>
                      <option value="gratitude">Gratitude Logs</option>
                      <option value="stretching">Muscle Relief</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-500 block">Reminder Hour</label>
                    <select
                      value={localStorage.getItem('moodai_reminder_hour') || '09:00 AM'}
                      onChange={(e) => {
                        localStorage.setItem('moodai_reminder_hour', e.target.value);
                        alert(`Reminder hour configured for: ${e.target.value}`);
                      }}
                      className="w-full bg-slate-950 border border-white/5 py-1.5 px-2 rounded-lg text-[11px] text-slate-300 focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="09:00 PM">09:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Session Flow Route */
          <>
            {stage === 'auth' && <Login onLoginSuccess={handleLoginSuccess} />}

            {stage === 'select-preferences' && (
              <PreferencesSelection
                initialGender={userGender}
                initialLanguage={userLanguage}
                onSave={(gender, language) => {
                  setUserGender(gender);
                  setUserLanguage(language);
                  localStorage.setItem('moodai_gender', gender);
                  localStorage.setItem('moodai_language', language);
                  setActiveTab('profile'); // Immediately show the Profile tab as requested
                  setStage('select-emotion'); // Ensure stage moves to selection
                }}
              />
            )}
            
            {stage === 'select-emotion' && (
              <EmotionSelection onSelect={handleSelectEmotion} />
            )}

            {stage === 'select-reason' && startEmotion && (
              <ReasonSelection
                emotion={startEmotion}
                onSelectReason={handleSelectReason}
                onBack={() => setStage('select-emotion')}
              />
            )}

            {stage === 'dashboard' && user && startEmotion && (
              <Dashboard
                user={user}
                currentEmotion={startEmotion}
                currentReason={selectedReason}
                completedActivities={completedActivities}
                onSelectModule={handleSelectModule}
                onGoToFinalCheck={handleGoToFinalCheck}
              />
            )}

            {stage === 'music' && startEmotion && (
              <MusicModule
                emotion={startEmotion}
                initialGender={userGender}
                initialLanguage={userLanguage}
                onFeedbackSubmit={handleModuleFeedback}
                onBackToDashboard={() => setStage('dashboard')}
              />
            )}

            {stage === 'pet' && user && (
              <AIPetModule
                userName={user.displayName}
                onBackToDashboard={() => setStage('dashboard')}
                onNavigate={(destination) => {
                  if (destination === 'music') setStage('music');
                  else if (destination === 'games') setStage('games');
                  else if (destination === 'history') setActiveTab('history');
                  else if (destination === 'dashboard') setStage('dashboard');
                }}
              />
            )}

            {stage === 'memes' && startEmotion && (
              <MemesModule
                emotion={startEmotion}
                reason={selectedReason}
                onFeedbackSubmit={handleModuleFeedback}
                onBackToDashboard={() => setStage('dashboard')}
              />
            )}

            {stage === 'games' && startEmotion && (
              <GamesModule
                emotion={startEmotion}
                onFeedbackSubmit={handleModuleFeedback}
                onBackToDashboard={() => setStage('dashboard')}
              />
            )}

            {stage === 'final-check' && (
              <FinalMoodCheck onSubmit={handleFinalMoodSubmit} />
            )}

            {stage === 'result' && startEmotion && finalEmotion && (
              <MoodResult
                beforeMood={startEmotion}
                afterMood={finalEmotion}
                improvementPercent={sessionImprovement}
                onGoToHistory={() => {
                  setActiveTab('history');
                  setStage('select-emotion'); // reset active flow ready for next session
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Render navigation bar ONLY if logged in */}
      {user && stage !== 'auth' && (
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          userName={user.displayName}
        />
      )}
    </div>
  );
}
