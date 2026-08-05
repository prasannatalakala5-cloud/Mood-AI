import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Music, Sparkles, CheckCircle2 } from 'lucide-react';

interface PreferencesSelectionProps {
  initialGender: 'Male' | 'Female' | 'Prefer not to say';
  initialLanguage: 'Telugu' | 'English' | 'Hindi';
  onSave: (gender: 'Male' | 'Female' | 'Prefer not to say', language: 'Telugu' | 'English' | 'Hindi') => void;
}

export default function PreferencesSelection({ initialGender, initialLanguage, onSave }: PreferencesSelectionProps) {
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female' | 'Prefer not to say'>(initialGender);
  const [selectedLanguage, setSelectedLanguage] = useState<'Telugu' | 'English' | 'Hindi'>(initialLanguage);

  const genderOptions: { value: 'Male' | 'Female' | 'Prefer not to say'; label: string; emoji: string }[] = [
    { value: 'Male', label: 'Male', emoji: '👨' },
    { value: 'Female', label: 'Female', emoji: '👩' },
    { value: 'Prefer not to say', label: 'Prefer not to say', emoji: '🤫' },
  ];

  const languageOptions: { value: 'Telugu' | 'English' | 'Hindi'; label: string; desc: string; flag: string }[] = [
    { value: 'Telugu', label: 'Telugu', desc: 'Melodious & Soulful Tollywood Tracks 🌸', flag: '🇮🇳' },
    { value: 'English', label: 'English', desc: 'Global Pop, Rock & Chill Indie Hits 🎵', flag: '🇺🇸' },
    { value: 'Hindi', label: 'Hindi', desc: 'Bollywood Classics, Gazals & Beats 🎧', flag: '🇮🇳' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedGender, selectedLanguage);
  };

  return (
    <div id="preferences-selection-container" className="max-w-md mx-auto py-8 px-4 text-center">
      {/* Step Indicators */}
      <div className="flex justify-center items-center gap-2 mb-8 text-xs font-semibold text-slate-400">
        <span className="text-purple-600 font-bold">Preferences</span>
        <span>&rarr;</span>
        <span>Select Emotion</span>
        <span>&rarr;</span>
        <span>Select Reason</span>
        <span>&rarr;</span>
        <span>Dashboard</span>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 border border-purple-200 mb-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-3xl font-light text-slate-900 tracking-tight">
          Personalize <span className="font-semibold">Your Experience</span>
        </h2>
        <p className="text-slate-600 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
          Tell us your preferred gender and music language so we can customize your emotional healing journey and recommendations!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gender Selection Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <UserIcon className="w-4 h-4 text-purple-600" />
            <span>Select Your Gender</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {genderOptions.map((opt) => {
              const isSelected = selectedGender === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedGender(opt.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 border-purple-500 shadow-sm text-purple-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{opt.emoji}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Music className="w-4 h-4 text-purple-600" />
            <span>Preferred Music Language</span>
          </div>

          <div className="space-y-2.5">
            {languageOptions.map((opt) => {
              const isSelected = selectedLanguage === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedLanguage(opt.value)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 border-purple-500 shadow-sm text-purple-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.flag}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{opt.label}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue with Preferences</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase">Let's Go</span>
        </button>
      </form>
    </div>
  );
}
