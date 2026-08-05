import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Music, CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { EmotionType } from '../types';
import { SONG_DATABASE, DetailedSong } from '../data/songs';

interface MusicModuleProps {
  emotion: EmotionType;
  initialGender?: 'Male' | 'Female' | 'Prefer not to say';
  initialLanguage?: 'Telugu' | 'English' | 'Hindi';
  onFeedbackSubmit: (improved: boolean) => void;
  onBackToDashboard: () => void;
}

export default function MusicModule({
  emotion: initialEmotion,
  initialGender = 'Prefer not to say',
  initialLanguage = 'English',
  onFeedbackSubmit,
  onBackToDashboard
}: MusicModuleProps) {
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<DetailedSong | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic recommendations based on the selected emotion, language, and gender preferences
  const getRecommendations = (): DetailedSong[] => {
    // Filter strictly by language and emotion (mood)
    let filtered = SONG_DATABASE.filter(song => {
      const songLang = song.language.toLowerCase();
      const prefLang = initialLanguage.toLowerCase();
      const songMood = song.mood.toLowerCase();
      const prefMood = initialEmotion.toLowerCase();
      
      return songLang === prefLang && songMood === prefMood;
    });

    // Fallback if no matching language+mood found
    if (filtered.length === 0) {
      filtered = SONG_DATABASE.filter(s => s.mood.toLowerCase() === initialEmotion.toLowerCase());
    }

    // Sort so that songs matching the gender preference or 'All' are placed at the top
    return [...filtered].sort((a, b) => {
      const aMatches = initialGender === 'Prefer not to say' || a.suitableGender === 'All' || a.suitableGender === initialGender;
      const bMatches = initialGender === 'Prefer not to say' || b.suitableGender === 'All' || b.suitableGender === initialGender;
      
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  };

  const songsList = getRecommendations();

  // Set the first song as the default current song when recommendations load
  useEffect(() => {
    if (songsList.length > 0) {
      setCurrentSong(songsList[0]);
    }
    setIsExpanded(false);
  }, [initialEmotion, initialLanguage, initialGender]);

  // 2. Play song handler (Opens Spotify search link)
  const handlePlaySong = (song: DetailedSong) => {
    setCurrentSong(song);
    
    // Toast notification
    setToastMessage(`🎵 Opening "${song.title}" on Spotify!`);
    setTimeout(() => setToastMessage(null), 3500);

    try {
      // Direct Spotify Search URL
      const searchQuery = encodeURIComponent(`${song.title} ${song.artist}`);
      const targetUrl = `https://open.spotify.com/search/${searchQuery}`;
      window.open(targetUrl, '_blank');
    } catch (err) {
      console.warn("Unable to open Spotify link:", err);
    }

    // హిస్టరీ ట్రాకింగ్
    if (!playedIds.includes(song.id)) {
      const updated = [...playedIds, song.id];
      setPlayedIds(updated);
      
      // 3 పాటలు విన్నాక ఫీడ్బ్యాక్ అడగడానికి
      if (updated.length >= 3) {
        setTimeout(() => setShowFeedback(true), 4000);
      }
    }
  };

  const SpotifyIcon = () => (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.3-1.4-5.3-1.8-8.8-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7$.4-.8 3.8-.9 7.2-.4 9.8 1.2.3.2.4.6.3.8zm1.5-3.3c-.3.4-.8.5-1.1.3-2.7-1.6-6.8-2.1-10-1.1-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.7-1.1 8.3-.6 11.4 1.3.4.2.5.7.2 1zm.1-3.4C15.2 8.3 8.8 8.1 5.1 9.2c-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 4.3-1.3 11.4-1.1 16 1.6.5.3.7.9.4 1.4-.3.5-.9.7-1.4.5z"/>
    </svg>
  );

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl p-4 text-xs text-slate-100 z-50 backdrop-blur-md shadow-xl flex items-center gap-3"
          >
            <div className="text-emerald-400 animate-pulse"><SpotifyIcon /></div>
            <div>{toastMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToDashboard}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-emerald-600" />
          Select & Play on Spotify
        </span>
        <div className="w-10"></div>
      </div>

      {!showFeedback ? (
        <div className="space-y-4">
          {/* Active Song Context */}
          {currentSong && (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={currentSong.albumArt} 
                  alt="" 
                  className="w-11 h-11 rounded-lg object-cover border border-emerald-200 shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">Selected Song: {currentSong.title}</h4>
                  <p className="text-[10px] text-emerald-800 truncate font-semibold">{currentSong.artist}</p>
                </div>
              </div>
              <button 
                onClick={() => handlePlaySong(currentSong)}
                className="flex items-center gap-1 px-3 py-2 bg-[#1DB954] text-white hover:bg-[#189e47] rounded-xl text-[10px] font-bold shadow-sm transition-all cursor-pointer shrink-0"
                title="Play on Spotify"
              >
                <SpotifyIcon />
                <span>Listen on Spotify</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 leading-snug flex items-start gap-2 shadow-sm">
            <span className="text-sm">🎧</span>
            <div>
              <strong>Free Music:</strong> Click any song to open and play directly on <strong>Spotify</strong>.
            </div>
          </div>

          {/* Songs List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 block">
              Available Songs ({songsList.length})
            </span>

            {(isExpanded ? songsList : songsList.slice(0, 2)).map((song) => {
              const isPlayed = playedIds.includes(song.id);
              const isCurrent = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
                    isCurrent
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={song.albumArt} 
                      alt={song.title} 
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate flex items-center gap-1.5">
                        {song.title}
                        {isPlayed && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{song.artist}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(song);
                    }}
                    className={`flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1DB954] text-white border-transparent shadow-sm'
                        : 'bg-[#1DB954]/10 border-[#1DB954]/30 text-[#15803d] hover:bg-[#1DB954]/20'
                    }`}
                  >
                    <SpotifyIcon />
                    <span>{isCurrent ? 'Open Spotify' : 'Play on Spotify'}</span>
                  </button>
                </div>
              );
            })}

            {songsList.length > 2 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-2.5 py-3 px-4 rounded-xl border border-[#1DB954]/40 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#15803d] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>More Songs ({songsList.length - 2} remaining)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Feedback State */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <span className="text-5xl block">😊</span>
          <h3 className="text-lg font-medium text-slate-900">Did the Spotify songs improve your mood?</h3>
          <div className="space-y-2">
            <button onClick={() => onFeedbackSubmit(true)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer">Yes, feel better 😊</button>
            <button onClick={() => onFeedbackSubmit(false)} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer">No, Still same 😐</button>
          </div>
        </div>
      )}
    </div>
  );
}
