import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Flame, Heart, Star, Trophy, Gift, CheckCircle2, Lock, 
  Sparkles, AlertCircle, ShoppingCart, Briefcase, Plus, User, Info, 
  Coins, Smile, Moon, RefreshCw, Zap, Award, Volume2, VolumeX, Eye
} from 'lucide-react';

interface AIPetModuleProps {
  onBackToDashboard: () => void;
  onNavigate?: (destination: string) => void;
  userName: string;
}

export interface PetState {
  petSelected: boolean;
  petType: 'dog' | 'cat' | 'rabbit' | 'panda' | 'owl' | 'bird';
  petName: string;
  age: number; // Growth based on Days of age (Start from Day 0)
  growth: number; // Growth progress % towards next day (0 to 100)
  xp: number;
  coins: number;
  inventory: {
    seeds: number;
    water: number;
    apple: number;
    banana: number;
    nuts: number;
    soap: number;
    medicine: number;
    toy: number;
    ball: number;
  };
  unlockedAchievements: string[];
  missions: {
    feedCount: number;
    waterDone: boolean;
    playDone: boolean;
    cleanDone: boolean;
    sleepDone: boolean;
    trainDone: boolean;
    claimed: boolean;
    date: string; // To track daily reset
  };
  happiness: number; // 0 to 100
  hunger: number;    // 0 to 100
  energy: number;    // 0 to 100
  cleanliness: number; // 0 to 100
  streak: number;
  lastDailyGiftClaimed: string; // YYYY-MM-DD
  lastInteractionTime: string; // ISO String
}

const DEFAULT_PET_STATE: PetState = {
  petSelected: false,
  petType: 'bird',
  petName: 'Chirpy',
  age: 0, // Day 0 start
  growth: 0, // 0% growth start
  xp: 0,
  coins: 100, // Starts with 100 coins
  inventory: {
    seeds: 3,
    water: 2,
    apple: 1,
    banana: 0,
    nuts: 0,
    soap: 2,
    medicine: 1,
    toy: 0,
    ball: 1,
  },
  unlockedAchievements: [],
  missions: {
    feedCount: 0,
    waterDone: false,
    playDone: false,
    cleanDone: false,
    sleepDone: false,
    trainDone: false,
    claimed: false,
    date: new Date().toISOString().split('T')[0],
  },
  happiness: 80,
  hunger: 70,
  energy: 90,
  cleanliness: 85,
  streak: 1,
  lastDailyGiftClaimed: '',
  lastInteractionTime: new Date().toISOString(),
};

export function getPetState(): PetState {
  const data = localStorage.getItem('chirpy_pet_state');
  if (!data) return DEFAULT_PET_STATE;
  try {
    const parsed = JSON.parse(data);
    
    // Support migrating old 'level' based states smoothly to age/growth life cycle
    let migratedAge = parsed.age ?? 0;
    let migratedGrowth = parsed.growth ?? 0;
    if (parsed.level && !parsed.age) {
      migratedAge = (parsed.level - 1) * 7; // E.g., level 2 becomes Day 7
      migratedGrowth = parsed.xp ?? 0;
    }

    return {
      ...DEFAULT_PET_STATE,
      ...parsed,
      age: migratedAge,
      growth: migratedGrowth,
      inventory: { ...DEFAULT_PET_STATE.inventory, ...(parsed.inventory || {}) },
      missions: { ...DEFAULT_PET_STATE.missions, ...(parsed.missions || {}) },
    };
  } catch (e) {
    return DEFAULT_PET_STATE;
  }
}

export function savePetState(state: PetState) {
  localStorage.setItem('chirpy_pet_state', JSON.stringify(state));
}

// Full Life Cycle Stage Config matching Days
export const PETS_CONFIG = {
  dog: {
    emoji: '🐶',
    name: 'Dog',
    personality: 'Loves playing with balls & keeping active!',
    welcome: 'Woof woof! Ready for an active, cheerful self-care adventure together?',
    getStageDetails: (age: number) => {
      if (age < 3) return { stage: 'Baby Puppy', emoji: '🐶', desc: 'A tiny, adorable baby pup that needs lots of love and healthy seeds!' };
      if (age < 7) return { stage: 'Young Dog', emoji: '🐕', desc: 'An energetic puppy that loves to run and wag its tail.' };
      if (age < 15) return { stage: 'Fluffy Poodle', emoji: '🐩', desc: 'A stylish, smart poodle that understands high-level wellness tricks.' };
      if (age < 30) return { stage: 'Adult Dog', emoji: '🦮', desc: 'A majestic, loyal adult companion always supporting your mindfulness.' };
      return { stage: 'Guardian Wolf', emoji: '🐺', desc: 'A legendary wolf guarding your positive energy and peace.' };
    },
  },
  cat: {
    emoji: '🐱',
    name: 'Cat',
    personality: 'Loves cozy naps, treats & cleaning up!',
    welcome: 'Meow! Looking forward to relaxing, calm moments with you.',
    getStageDetails: (age: number) => {
      if (age < 3) return { stage: 'Kitten', emoji: '🐱', desc: 'A warm, tiny ball of pure fluff that purrs when happy.' };
      if (age < 7) return { stage: 'Young Cat', emoji: '🐈', desc: 'A curious kitten that loves searching for play toys.' };
      if (age < 15) return { stage: 'Spotted Bengal', emoji: '🐅', desc: 'A sleek, exotic leopard-looking cat that loves high spots.' };
      if (age < 30) return { stage: 'Adult Cat', emoji: '🐈‍⬛', desc: 'A mysterious, calming black cat radiating relaxing energy.' };
      return { stage: 'Noble Lion', emoji: '🦁', desc: 'A brave guardian lion giving you infinite courage.' };
    },
  },
  rabbit: {
    emoji: '🐰',
    name: 'Rabbit',
    personality: 'Loves organic bananas, crunchy apples & hopping!',
    welcome: 'Hop hop! Let\'s bounce away stress and eat healthy veggies together!',
    getStageDetails: (age: number) => {
      if (age < 3) return { stage: 'Baby Rabbit', emoji: '🐰', desc: 'A sweet little bunny with tiny twitching pink ears.' };
      if (age < 7) return { stage: 'Young Rabbit', emoji: '🐇', desc: 'A swift, playful bunny that jumps for organic fruit.' };
      if (age < 15) return { stage: 'Lucky Bunny', emoji: '🐇✨', desc: 'A magical bunny that brings a shining aura of positive luck.' };
      if (age < 30) return { stage: 'Starry Rabbit', emoji: '🦄', desc: 'A highly intelligent celestial creature with starry vibes.' };
      return { stage: 'Cosmic Pegasus', emoji: '🦄✨', desc: 'An ultra-rare divine guardian of peace and stress relief.' };
    },
  },
  panda: {
    emoji: '🐼',
    name: 'Panda',
    personality: 'Loves relaxation, healthy food & deep breathing!',
    welcome: 'Puff... Let\'s slow down, take deep breaths, and relax together.',
    getStageDetails: (age: number) => {
      if (age < 3) return { stage: 'Baby Panda', emoji: '🐼', desc: 'A small round panda cub sleeping cozily on a bamboo stalk.' };
      if (age < 7) return { stage: 'Zen Panda', emoji: '🐨', desc: 'A peaceful bear companion radiating calm, stress-free zen.' };
      if (age < 15) return { stage: 'Bamboo Master', emoji: '🐾', desc: 'A strong panda expert at healthy nutrition and relaxation.' };
      if (age < 30) return { stage: 'Grand Grizzly', emoji: '🐻', desc: 'A solid, protective friendly bear companion hugging away worry.' };
      return { stage: 'Celestial Bear', emoji: '🐻‍❄️', desc: 'An ancient spirit guide of mindfulness and infinite patience.' };
    },
  },
  owl: {
    emoji: '🦉',
    name: 'Owl',
    personality: 'Loves wise training sessions, seeds & quiet!',
    welcome: 'Hoot! Ready to observe, learn, and grow wise together?',
    getStageDetails: (age: number) => {
      if (age < 3) return { stage: 'Fluffy Owlet', emoji: '🦉', desc: 'A tiny cute owlet with giant curious eyes.' };
      if (age < 7) return { stage: 'Wise Owl', emoji: '🦅', desc: 'Gaining wide majestic wings and great nightly intelligence.' };
      if (age < 15) return { stage: 'Scholar Parrot', emoji: '🦜', desc: 'A bright, talkative parrot echo-affirming positive thoughts.' };
      if (age < 30) return { stage: 'Ancient Raptor', emoji: '🦖', desc: 'A legendary strong dino companion of focus and high resolve.' };
      return { stage: 'Golden Phoenix', emoji: '🐉', desc: 'A burning mythical dragon of renewal and eternal mental warmth.' };
    },
  },
  bird: {
    emoji: '🐦',
    name: 'Bird',
    personality: 'Loves sweet melodies, seeds & flying!',
    welcome: 'Chirp chirp! Let\'s sing beautiful melodies and lift our spirits!',
    getStageDetails: (age: number) => {
      if (age < 3) return { stage: 'Egg', emoji: '🥚', desc: 'A cozy egg snug inside its nest. Keep up daily care to hatch!' };
      if (age < 7) return { stage: 'Baby Bird', emoji: '🐣', desc: 'A fresh little hatchling eager to learn and fly.' };
      if (age < 15) return { stage: 'Young Bird', emoji: '🐤', desc: 'A cute yellow chick singing beautiful therapeutic melodies.' };
      if (age < 30) return { stage: 'Adult Bird', emoji: '🐦', desc: 'A swift flyer that carries away all your worries.' };
      return { stage: 'Guardian Eagle', emoji: '🦅', desc: 'A mighty eagle guarding your self-care and mental success.' };
    },
  },
};

// Shop Items
export const SHOP_ITEMS = [
  { id: 'seeds', name: 'Seeds 🌾', cost: 5, emoji: '🌾', desc: 'Hunger +15, Happiness +5', effect: { hunger: 15, happiness: 5 } },
  { id: 'water', name: 'Water 💧', cost: 5, emoji: '💧', desc: 'Energy +15, Cleanliness +5', effect: { energy: 15, cleanliness: 5 } },
  { id: 'apple', name: 'Apple 🍎', cost: 10, emoji: '🍎', desc: 'Hunger +25, Happiness +10', effect: { hunger: 25, happiness: 10 } },
  { id: 'banana', name: 'Banana 🍌', cost: 12, emoji: '🍌', desc: 'Hunger +30, Happiness +12', effect: { hunger: 30, happiness: 12 } },
  { id: 'nuts', name: 'Nuts 🥜', cost: 8, emoji: '🥜', desc: 'Hunger +20, Happiness +8', effect: { hunger: 20, happiness: 8 } },
  { id: 'soap', name: 'Soap 🧼', cost: 8, emoji: '🧼', desc: 'Cleanliness +50, Happiness +10', effect: { cleanliness: 50, happiness: 10 } },
  { id: 'medicine', name: 'Medicine 💊', cost: 25, emoji: '💊', desc: 'Heals All Stats +30', effect: { hunger: 30, happiness: 30, energy: 30, cleanliness: 30 } },
  { id: 'toy', name: 'Toy 🧸', cost: 20, emoji: '🧸', desc: 'Happiness +40, Energy -15', effect: { happiness: 40, energy: -15 } },
  { id: 'ball', name: 'Ball 🎾', cost: 15, emoji: '🎾', desc: 'Happiness +25, Energy -10', effect: { happiness: 25, energy: -10 } },
];

export default function AIPetModule({ onBackToDashboard, onNavigate, userName }: AIPetModuleProps) {
  const [pet, setPet] = useState<PetState>(DEFAULT_PET_STATE);
  const [activeTab, setActiveTab] = useState<'care' | 'shop' | 'backpack' | 'missions' | 'badges'>('care');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingText, setFloatingText] = useState<{ text: string; id: number }[]>([]);
  const [isEvolutionPopup, setIsEvolutionPopup] = useState(false);
  const [evolutionDetail, setEvolutionDetail] = useState({ oldStage: '', newStage: '', oldEmoji: '', newEmoji: '' });

  // Custom animation coordinates and types
  const [currentAnimation, setCurrentAnimation] = useState<'feed' | 'water' | 'sleep' | 'play' | 'clean' | 'train' | 'pet' | null>(null);
  const [petActionText, setPetActionText] = useState('Welcome to your Virtual Self-Care Sanctuary! 🌸');

  // Interactive animation sub-states
  const [foodDropEmoji, setFoodDropEmoji] = useState('🍎');
  const [showSoapBubbles, setShowSoapBubbles] = useState(false);
  const [ballBounce, setBallBounce] = useState(false);

  // Adoption Form State
  const [selectedType, setSelectedType] = useState<'dog' | 'cat' | 'rabbit' | 'panda' | 'owl' | 'bird'>('bird');
  const [petNameInput, setPetNameInput] = useState('');

  // Web Speech synthesis voice helper
  const speakText = (text: string) => {
    if (!soundEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
        .replace(/\*[^*]+\*/g, '')
        .replace(/[()]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.3;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sound effect generator using standard Web Audio API
  const playBeep = (type: 'happy' | 'action' | 'purchase' | 'lvlup') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'happy') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'action') {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(554.37, ctx.currentTime + 0.1); // C#5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'purchase') {
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'lvlup') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn('Web Audio not supported or blocked');
    }
  };

  // Initialize and decay on mount
  useEffect(() => {
    const loaded = getPetState();
    
    // Check daily reset for missions
    const today = new Date().toISOString().split('T')[0];
    if (loaded.missions && loaded.missions.date !== today) {
      loaded.missions = {
        feedCount: 0,
        waterDone: false,
        playDone: false,
        cleanDone: false,
        sleepDone: false,
        trainDone: false,
        claimed: false,
        date: today,
      };
    }

    if (loaded.petSelected) {
      // Gentle decay logic based on last visited timestamp (1 point per 4 minutes of offline time)
      const lastTime = new Date(loaded.lastInteractionTime || new Date().toISOString()).getTime();
      const diffMins = Math.floor((Date.now() - lastTime) / 60000);
      const decay = Math.min(30, Math.floor(diffMins / 4));

      if (decay > 0) {
        loaded.hunger = Math.max(10, loaded.hunger - decay);
        loaded.happiness = Math.max(10, loaded.happiness - decay);
        loaded.energy = Math.max(10, loaded.energy - decay);
        loaded.cleanliness = Math.max(10, loaded.cleanliness - decay);
      }
      loaded.lastInteractionTime = new Date().toISOString();
      savePetState(loaded);
    }

    setPet(loaded);

    // Initial warm text
    if (loaded.petSelected) {
      const config = PETS_CONFIG[loaded.petType];
      const stage = config.getStageDetails(loaded.age);
      setPetActionText(`*Snuggles* ${loaded.petName} the ${stage.stage} is fully delighted to see you again! ♥`);
    } else {
      setPetActionText('Choose your custom companion below and click Adopt to start life! 🥚✨');
    }
  }, []);

  const triggerFloatingText = (text: string) => {
    const id = Date.now() + Math.random();
    setFloatingText((prev) => [...prev, { text, id }]);
    setTimeout(() => {
      setFloatingText((prev) => prev.filter((item) => item.id !== id));
    }, 1600);
  };

  // Master function to save and process growth / evolution triggers
  const updatePet = (updated: PetState, xpGained = 0, growthGained = 0) => {
    // 1. Accumulate XP
    updated.xp += xpGained;

    // 2. Accumulate Growth progress
    const prevAge = updated.age;
    let currentGrowth = updated.growth + growthGained;

    // Growth wraps at 100%, incrementing Age (Days)!
    if (currentGrowth >= 100) {
      const daysGained = Math.floor(currentGrowth / 100);
      updated.age += daysGained;
      currentGrowth = currentGrowth % 100;

      // Check if Stage evolved based on new Age!
      const oldConfig = PETS_CONFIG[updated.petType].getStageDetails(prevAge);
      const newConfig = PETS_CONFIG[updated.petType].getStageDetails(updated.age);

      if (oldConfig.stage !== newConfig.stage) {
        // Trigger Evolution Popup!
        setEvolutionDetail({
          oldStage: oldConfig.stage,
          newStage: newConfig.stage,
          oldEmoji: oldConfig.emoji,
          newEmoji: newConfig.emoji
        });
        setIsEvolutionPopup(true);
        playBeep('lvlup');
        speakText(`Evolution Up! ${updated.petName} grew from ${oldConfig.stage} to ${newConfig.stage}!`);

        // Badges checks
        if (updated.age >= 3 && !updated.unlockedAchievements.includes('Pet Lover')) {
          updated.unlockedAchievements.push('Pet Lover');
          triggerFloatingText('🏆 Unlocked: Pet Lover!');
        }
        if (updated.age >= 30 && !updated.unlockedAchievements.includes('Pet Master')) {
          updated.unlockedAchievements.push('Pet Master');
          triggerFloatingText('🏆 Unlocked: Pet Master!');
        }
      } else {
        // Simple day gained ding
        playBeep('lvlup');
        triggerFloatingText(`☀️ Day ${updated.age} Reached!`);
      }
    }

    updated.growth = currentGrowth;

    // Unlocking Guardian badge when item limits are met
    const hasAllItems = Object.values(updated.inventory).every(val => val > 0);
    if (hasAllItems && !updated.unlockedAchievements.includes('Guardian Companion')) {
      updated.unlockedAchievements.push('Guardian Companion');
      triggerFloatingText('🏆 Unlocked: Guardian Companion!');
    }

    updated.lastInteractionTime = new Date().toISOString();
    savePetState(updated);
    setPet(updated);
  };

  // 🐶 Adopt Action
  const handleAdopt = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = petNameInput.trim() || PETS_CONFIG[selectedType].welcome.split('!')[0].replace(' ', '') || 'Buddy';
    
    const initial: PetState = {
      ...DEFAULT_PET_STATE,
      petSelected: true,
      petType: selectedType,
      petName: finalName,
      unlockedAchievements: ['First Friend'],
    };

    savePetState(initial);
    setPet(initial);
    playBeep('happy');

    const welcome = `Hooray! Adopted! ${finalName} says: "${PETS_CONFIG[selectedType].welcome}"`;
    setPetActionText(welcome);
    speakText(welcome);
  };

  // Reset function for testing or starting over
  const handleAbandon = () => {
    if (window.confirm('Are you absolutely sure you want to release your pet? This will reset all Age, Growth, and inventory progress.')) {
      localStorage.removeItem('chirpy_pet_state');
      setPet(DEFAULT_PET_STATE);
      setPetNameInput('');
      setPetActionText('Choose your custom companion below and click Adopt to start life! 🥚✨');
      setActiveTab('care');
    }
  };

  // ============================================
  // PET ANIMATED ACTIONS
  // ============================================

  // 1. Feed action with dropping food, sliding, chewing
  const handleFeed = (itemId: 'seeds' | 'apple' | 'banana' | 'nuts', emoji: string, hungerInc: number, happyInc: number) => {
    if (pet.inventory[itemId] <= 0) {
      setPetActionText(`No ${itemId} in inventory! Buy some in the Pet Shop. 🛒`);
      triggerFloatingText('Out of stock! ❌');
      speakText(`No ${itemId} left!`);
      return;
    }

    // Trigger Feeding animation flow
    setFoodDropEmoji(emoji);
    setCurrentAnimation('feed');
    setPetActionText(`*Munch munch* Eating a healthy, delicious ${itemId}...`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.inventory[itemId]--;
      updated.hunger = Math.min(100, updated.hunger + hungerInc);
      updated.happiness = Math.min(100, updated.happiness + happyInc);
      
      // XP & Growth as specified
      const xpGained = 10;
      const growthGained = 5;

      // Track Daily missions
      updated.missions.feedCount++;
      if (updated.missions.feedCount >= 2 && !updated.unlockedAchievements.includes('Caregiver')) {
        updated.unlockedAchievements.push('Caregiver');
        triggerFloatingText('🏆 Unlocked: Caregiver!');
      }

      setCurrentAnimation(null);
      setPetActionText(`*Burps happily* That was delicious! +10 XP & +5% Growth! ♥`);
      playBeep('happy');
      triggerFloatingText('+10 XP 🌟');
      triggerFloatingText('+5% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 2500);
  };

  // 2. Give Water with gulping, tail wagging
  const handleGiveWater = () => {
    if (pet.inventory.water <= 0) {
      setPetActionText('No Water bottles left! Buy pure water in the Pet Shop. 💧');
      triggerFloatingText('Out of stock! ❌');
      speakText('No Water left!');
      return;
    }

    setCurrentAnimation('water');
    setPetActionText(`*Gulp gulp gulp* Quenching ${pet.petName}'s thirst...`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.inventory.water--;
      updated.energy = Math.min(100, updated.energy + 15);
      updated.cleanliness = Math.min(100, updated.cleanliness + 5);
      
      const xpGained = 10;
      const growthGained = 5;

      updated.missions.waterDone = true;

      setCurrentAnimation(null);
      setPetActionText(`*Happily wags tail* Super refreshed! Thirst quenched. +10 XP & +5% Growth!`);
      playBeep('happy');
      triggerFloatingText('+10 XP 🌟');
      triggerFloatingText('+5% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 2200);
  };

  // 3. Sleep with room darkening, stars, Zzz
  const handleSleep = () => {
    setCurrentAnimation('sleep');
    setPetActionText(`*Yawn* Snuggling into a cozy bed. Lights off... Shh...`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.energy = 100;
      updated.happiness = Math.min(100, updated.happiness + 10);
      
      const xpGained = 15;
      const growthGained = 8;

      updated.missions.sleepDone = true;

      setCurrentAnimation(null);
      setPetActionText(`*Stretches happily* Woke up fully energized, fully rested, and shining bright! ☀️`);
      playBeep('happy');
      triggerFloatingText('+15 XP 🌟');
      triggerFloatingText('+8% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 3500);
  };

  // 4. Play with bouncing ball, jumping, chase
  const handlePlay = (itemId: 'ball' | 'toy', emoji: string, happyInc: number, energyDec: number) => {
    if (pet.inventory[itemId] <= 0) {
      setPetActionText(`No ${itemId} in backpack! Go buy one in the Pet Shop. 🛍️`);
      triggerFloatingText('Out of stock! ❌');
      speakText(`No ${itemId} left!`);
      return;
    }

    if (pet.energy < 20) {
      setPetActionText(`${pet.petName} is too tired to play! Give them water or let them sleep. 😴`);
      triggerFloatingText('Too tired! 😴');
      speakText('Too tired to play!');
      return;
    }

    setBallBounce(true);
    setCurrentAnimation('play');
    setPetActionText(`*Giggles* Chasing the bouncy ${itemId} across the room!`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.inventory[itemId]--;
      updated.happiness = Math.min(100, updated.happiness + happyInc);
      updated.energy = Math.max(0, updated.energy - energyDec);
      
      const xpGained = 20;
      const growthGained = 10;

      updated.missions.playDone = true;

      if (updated.happiness >= 100 && !updated.unlockedAchievements.includes('Happy Companion')) {
        updated.unlockedAchievements.push('Happy Companion');
        triggerFloatingText('🏆 Unlocked: Happy Companion!');
      }

      setBallBounce(false);
      setCurrentAnimation(null);
      setPetActionText(`Catch! What a wonderful playtime! Happiness boosted. +20 XP & +10% Growth!`);
      playBeep('happy');
      triggerFloatingText('+20 XP 🌟');
      triggerFloatingText('+10% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 2500);
  };

  // 5. Clean with soap bubbles floating up
  const handleClean = () => {
    if (pet.inventory.soap <= 0) {
      setPetActionText('No soap left! Stock up in the Pet Shop. 🧼');
      triggerFloatingText('Out of stock! ❌');
      speakText('No soap left!');
      return;
    }

    setShowSoapBubbles(true);
    setCurrentAnimation('clean');
    setPetActionText(`*Scrub scrub* Generating fragrant herbal bubbles and cleansing fur...`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.inventory.soap--;
      updated.cleanliness = 100;
      updated.happiness = Math.min(100, updated.happiness + 5);
      
      const xpGained = 10;
      const growthGained = 5;

      updated.missions.cleanDone = true;

      setShowSoapBubbles(false);
      setCurrentAnimation(null);
      setPetActionText(`*Sparkles* Completely fresh, sparkling clean, and smelling fantastic! +10 XP`);
      playBeep('happy');
      triggerFloatingText('+10 XP 🌟');
      triggerFloatingText('+5% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 2500);
  };

  // 6. Train skills with a halo/crown trick
  const handleTrain = () => {
    if (pet.energy < 25) {
      setPetActionText(`${pet.petName} is too exhausted for training! Let them sleep first. 😴`);
      triggerFloatingText('Need Energy! 😴');
      speakText('Too exhausted to train!');
      return;
    }

    setCurrentAnimation('train');
    setPetActionText(`*Focuses deeply* practicing backflips and wise mindfulness tricks...`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.energy = Math.max(0, updated.energy - 25);
      updated.hunger = Math.max(10, updated.hunger - 10);
      
      const xpGained = 25;
      const growthGained = 12;

      updated.missions.trainDone = true;

      // Unlock Trainer badge after doing a training
      if (!updated.unlockedAchievements.includes('Trainer')) {
        updated.unlockedAchievements.push('Trainer');
        triggerFloatingText('🏆 Unlocked: Trainer!');
      }

      setCurrentAnimation(null);
      setPetActionText(`*Incredible stunt!* Completed a perfect triple loop! Wisdom leveled up! +25 XP`);
      playBeep('happy');
      triggerFloatingText('+25 XP 🌟');
      triggerFloatingText('+12% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 2500);
  };

  // 7. Medicine treat
  const handleMedicine = () => {
    if (pet.inventory.medicine <= 0) {
      setPetActionText('No vitamins in Backpack! Buy medicine in the Shop. 💊');
      triggerFloatingText('Out of stock! ❌');
      speakText('No medicine!');
      return;
    }

    setCurrentAnimation('pet');
    setPetActionText(`Dispensing premium multivitamin healing gummies to ${pet.petName}...`);
    playBeep('action');

    setTimeout(() => {
      const updated = { ...pet };
      updated.inventory.medicine--;
      updated.hunger = Math.min(100, updated.hunger + 30);
      updated.happiness = Math.min(100, updated.happiness + 30);
      updated.energy = Math.min(100, updated.energy + 30);
      updated.cleanliness = Math.min(100, updated.cleanliness + 30);

      const xpGained = 20;
      const growthGained = 10;

      setCurrentAnimation(null);
      setPetActionText(`*Radiating gold power* Pure vitality boost! All statistics restored by +30!`);
      playBeep('happy');
      triggerFloatingText('+20 XP 🌟');
      triggerFloatingText('+10% Growth 🌱');

      updatePet(updated, xpGained, growthGained);
    }, 2000);
  };

  // 8. Simple interactive Pet (clicking on pet body)
  const handleTapPet = () => {
    if (currentAnimation) return;

    setCurrentAnimation('pet');
    playBeep('happy');

    // Select dynamic dialogues based on type
    let dialogs = [
      `Chirp chirp! I love when you tickle me, ${userName}! ♥`,
      `*Flutters* Let's conquer stress together! ✨`,
      `Chirp! Your heart is so incredibly kind.`,
      `Don't forget to take deep breaths! You are doing great!`
    ];

    if (pet.petType === 'dog') {
      dialogs = [
        `Woof woof! Tail wagging at maximum speed for you, ${userName}! 🐶`,
        `*Sniffs excitedly* Shall we catch a ball, or maybe practice some training? 🎾`,
        `Woof! Remember that taking soft breaks is a true superpower!`,
        `You make me the happiest companion in the whole universe!`
      ];
    } else if (pet.petType === 'cat') {
      dialogs = [
        `Meow... Scratches under the chin are pure paradise! 🐱♥`,
        `*Purrs deeply* Sleepy, cozy vibrations to heal your stress.`,
        `Meow! I trust you entirely, ${userName}. Let's relax today.`,
        `Let's take a peaceful moment to ignore the world together.`
      ];
    } else if (pet.petType === 'rabbit') {
      dialogs = [
        `Hop! My nose is twitching because you make me super happy! 🐰`,
        `*Nibbles* Let's leap over all anxieties and stay calm!`,
        `Organic bananas are sweet, but your happy smile is even better! 🍌`,
        `Keep caring for yourself! I will grow big and always protect you.`
      ];
    } else if (pet.petType === 'panda') {
      dialogs = [
        `Puff... Inhale relaxation, exhale stress. Let's do a deep breath. 🧘`,
        `Zen is not about being perfect, it is about being kind to yourself.`,
        `Slow down... Let's just rest in this beautiful purple garden together.`,
        `You are doing a truly wonderful job, ${userName}. Keep shining.`
      ];
    } else if (pet.petType === 'owl') {
      dialogs = [
        `Hoot hoot! Wisdom is knowing when to quiet your mind. 🦉`,
        `*Nods wisely* Shall we practice some wise skill training today?`,
        `A clear mind is like a serene lake. Let's practice focus together.`,
        `Every small, loving wellness habit grows a giant shield of peace!`
      ];
    }

    const random = dialogs[Math.floor(Math.random() * dialogs.length)];
    setPetActionText(random);
    speakText(random);
    triggerFloatingText('Tickled! ♥');

    setTimeout(() => {
      setCurrentAnimation(null);
    }, 1500);
  };

  // ============================================
  // SHOP & INVENTORY ACTIONS
  // ============================================

  // Purchase item
  const handlePurchase = (itemId: keyof typeof pet.inventory, cost: number, name: string) => {
    if (pet.coins < cost) {
      setPetActionText(`Not enough coins! You need ${cost} 🪙 to buy ${name}. Listen to music, browse memes or play games to earn coins!`);
      triggerFloatingText('Needs Coins! ❌');
      speakText('Not enough coins!');
      return;
    }

    const updated = { ...pet };
    updated.coins -= cost;
    updated.inventory[itemId]++;
    playBeep('purchase');

    setPetActionText(`Successfully purchased ${name}! -${cost} Coins. Saved safely in Backpack.`);
    triggerFloatingText(`+1 ${name}! 🎒`);
    speakText(`Purchased ${name}!`);

    updatePet(updated);
  };

  // Claim Daily Login Bonus
  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimable = pet.lastDailyGiftClaimed !== todayStr;

  const handleClaimDailyGift = () => {
    if (!isClaimable) {
      setPetActionText('Already opened today\'s gift box! Come back tomorrow for more coins. 🎁');
      triggerFloatingText('Claimed! ❌');
      speakText('Already claimed today!');
      return;
    }

    const updated = { ...pet };
    updated.coins += 50;
    updated.happiness = Math.min(100, updated.happiness + 15);
    updated.lastDailyGiftClaimed = todayStr;
    updated.streak += 1;

    // Streak badge
    if (updated.streak >= 7 && !updated.unlockedAchievements.includes('7 Day Streak')) {
      updated.unlockedAchievements.push('7 Day Streak');
      triggerFloatingText('🏆 Unlocked: 7-Day Streak!');
    }

    playBeep('lvlup');
    setPetActionText(`🎉 Awesome! Opened Daily Gift: +50 Coins, +15 Happiness! Keep up your streak (Current: ${updated.streak} Days)!`);
    triggerFloatingText('+50 Coins! 🪙');
    speakText('Opened daily wellness gift! Earned fifty coins!');

    updatePet(updated);
  };

  // Claim Daily Missions
  const isFeedDone = pet.missions.feedCount >= 2;
  const isMissionsComplete = isFeedDone && 
                             pet.missions.waterDone && 
                             pet.missions.playDone && 
                             pet.missions.cleanDone && 
                             pet.missions.sleepDone && 
                             pet.missions.trainDone;

  const isMissionClaimable = isMissionsComplete && !pet.missions.claimed;

  const handleClaimMissions = () => {
    if (!isMissionClaimable) return;

    const updated = { ...pet };
    updated.missions.claimed = true;
    updated.coins += 50;

    const xpGained = 50;
    const growthGained = 25; // Massive growth!

    playBeep('lvlup');
    setPetActionText('🏆 Incredible job! Completed all pet care missions: +50 XP, +25% Growth & +50 Coins!');
    triggerFloatingText('+50 Coins! 🪙');
    triggerFloatingText('+50 XP! 🌟');
    triggerFloatingText('+25% Growth! 🌱');
    speakText('Missions claimed! Well done!');

    updatePet(updated, xpGained, growthGained);
  };

  // Predefined static Achievements matching badges list
  const STATIC_ACHIEVEMENTS = [
    { id: 'First Friend', title: 'First Friend', desc: 'Adopted your first AI Companion', icon: '🐾' },
    { id: 'Pet Lover', title: 'Pet Lover', desc: 'Helped your pet grow to Day 3', icon: '💖' },
    { id: 'Caregiver', title: 'Caregiver', desc: 'Fed your companion twice inside a day', icon: '🍎' },
    { id: 'Trainer', title: 'Trainer', desc: 'Completed wise fitness training once', icon: '🏋️' },
    { id: 'Happy Companion', title: 'Happy Companion', desc: 'Achieved 100% Happiness stat', icon: '✨' },
    { id: '7 Day Streak', title: '7 Day Streak', desc: 'Maintained a login check-in streak of 7 days', icon: '🔥' },
    { id: 'Pet Master', title: 'Pet Master', desc: 'Grew your companion to Day 30 ultimate stage', icon: '👑' },
    { id: 'Guardian Companion', title: 'Guardian Companion', desc: 'Stocked every single item type in your Backpack', icon: '🎒' },
  ];

  // Render Selection Screen if first time opening
  if (!pet.petSelected) {
    return (
      <div id="pet-selection" className="max-w-md mx-auto py-4 px-2">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBackToDashboard}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-[#140C24] text-slate-300 hover:bg-white/5 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white">Adopt Your Wellness Companion</h2>
        </div>

        <div className="bg-[#140C24] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl">🥚</span>
            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Adopt Your Companion</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Select an emotional virtual wellness partner that grows from Day 0, evolves with real care, and cheers you up!
            </p>
          </div>

          {/* List Grid */}
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(PETS_CONFIG).map(([key, config]) => {
              const isSelected = selectedType === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedType(key as any);
                    setPetNameInput(config.name);
                    speakText(`Selected ${config.name}. ${config.personality}`);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/10'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-3xl mb-1.5">{config.emoji}</span>
                  <span className="text-xs font-bold text-white capitalize">{config.name}</span>
                </button>
              );
            })}
          </div>

          {/* Personality Preview */}
          <div className="bg-purple-950/20 border border-purple-500/10 p-4 rounded-2xl space-y-1">
            <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Personality & Vibe:
            </h4>
            <p className="text-xs text-slate-300 italic">
              "{PETS_CONFIG[selectedType].personality}"
            </p>
          </div>

          {/* Name form */}
          <form onSubmit={handleAdopt} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Give your companion a name
              </label>
              <input
                id="name-input"
                type="text"
                required
                maxLength={14}
                value={petNameInput}
                onChange={(e) => setPetNameInput(e.target.value)}
                placeholder="e.g., Buddy, Luna, Mochi, Chirpy..."
                className="w-full bg-[#11091f] border border-purple-500/20 p-3 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              ❤️ Adopt Your Companion ({petNameInput || 'Select'})
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Get current active details based on actual Day age!
  const currentConfig = PETS_CONFIG[pet.petType] || PETS_CONFIG.bird;
  const currentStageInfo = currentConfig.getStageDetails(pet.age);

  return (
    <div className="max-w-md mx-auto py-2 px-1 select-none">
      
      {/* Floating alerts overlay */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none flex flex-col gap-1 items-center">
        <AnimatePresence>
          {floatingText.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-purple-600 text-white border border-purple-400 font-extrabold text-xs py-1 px-3.5 rounded-full shadow-md"
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Evolution Celebration Modal overlay */}
      <AnimatePresence>
        {isEvolutionPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-[#140C24] border border-purple-500/30 p-8 rounded-3xl max-w-sm space-y-6 shadow-2xl relative"
            >
              <div className="absolute top-2 right-2 text-yellow-400 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="flex justify-center items-center gap-4">
                <span className="text-4xl opacity-50">{evolutionDetail.oldEmoji}</span>
                <span className="text-2xl text-purple-400">➔</span>
                <span className="text-6xl animate-bounce">{evolutionDetail.newEmoji}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                  STAGE EVOLVED! 🎉
                </h3>
                <p className="text-slate-200 text-sm">
                  Your care has unlocked a brand-new form for <span className="font-extrabold text-purple-300">{pet.petName}</span>!
                </p>
                <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/10 text-xs">
                  <span className="block text-slate-400">Old Stage: {evolutionDetail.oldStage}</span>
                  <span className="block font-bold text-yellow-300 mt-1">New Stage: {evolutionDetail.newStage}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEvolutionPopup(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-all"
              >
                Magnificent! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <button
          onClick={onBackToDashboard}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-white/5 bg-[#140C24] text-slate-300 hover:bg-white/5 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Pet Name Indicator */}
        <div className="flex items-center gap-1.5 bg-[#140C24] border border-white/5 px-3 py-1.5 rounded-full">
          <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
            {currentStageInfo.emoji} {pet.petName}
          </span>
          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-extrabold uppercase">
            Day {pet.age}
          </span>
        </div>

        {/* Sound toggle & Coins */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full font-extrabold text-xs shadow-inner">
            <span>🪙</span>
            <span>{pet.coins}</span>
          </div>
        </div>
      </div>

      {/* Main Care & Animation Area */}
      <div className="bg-[#140C24] border border-white/5 rounded-3xl p-4.5 shadow-2xl relative overflow-hidden space-y-5">
        
        {/* Animated Viewport */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-purple-500/10 flex items-center justify-center bg-gradient-to-b from-[#180e2d] to-[#0e071c] shadow-inner">
          
          {/* Environment elements depending on current animation */}
          {currentAnimation === 'sleep' ? (
            <div className="absolute inset-0 bg-black/85 z-10 flex flex-col justify-between p-3 transition-all duration-1000">
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs font-serif italic">Cozy Bedroom 🌙</span>
                <span className="text-yellow-400 text-xs">⭐✨</span>
              </div>
              <div className="text-center text-xs text-purple-400 font-mono animate-pulse">
                Sleep mode active... Restoring energy!
              </div>
            </div>
          ) : currentAnimation === 'clean' ? (
            <div className="absolute inset-0 bg-gradient-to-b from-sky-950/50 to-blue-900/40 pointer-events-none">
              <span className="absolute top-2 right-2 text-xs font-semibold text-sky-300">Bubble Bath 🧼</span>
            </div>
          ) : currentAnimation === 'feed' ? (
            <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 to-stone-900/20 pointer-events-none">
              <span className="absolute top-2 right-2 text-[10px] text-amber-400 uppercase font-mono">Kitchen Table 🍽️</span>
            </div>
          ) : currentAnimation === 'train' ? (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 to-[#140c24] pointer-events-none">
              <span className="absolute top-2 right-2 text-[10px] text-indigo-400 uppercase font-mono">Wellness Dojo 🥋</span>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 to-[#140c24] pointer-events-none">
              <span className="absolute top-2 right-2 text-[10px] text-slate-500">Self Care Backyard 🌸</span>
            </div>
          )}

          {/* Floaters based on animations */}
          {currentAnimation === 'sleep' && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Floating Zzz */}
              <motion.span
                initial={{ y: 80, x: -10, opacity: 0, scale: 0.8 }}
                animate={{ y: 20, x: -30, opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                className="absolute left-1/2 bottom-12 text-lg font-bold text-purple-300"
              >
                Zzz
              </motion.span>
              <motion.span
                initial={{ y: 80, x: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 15, x: 10, opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.8 }}
                className="absolute left-1/2 bottom-12 text-sm font-bold text-indigo-300"
              >
                Zzz
              </motion.span>
            </div>
          )}

          {/* Bubbles for Cleansing */}
          {showSoapBubbles && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 150, x: 40 + i * 40, opacity: 0, scale: 0.5 }}
                  animate={{ y: 10, x: 40 + i * 40 + Math.sin(i) * 15, opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  className="absolute text-xl"
                >
                  🫧
                </motion.span>
              ))}
            </div>
          )}

          {/* Dropping food item */}
          {currentAnimation === 'feed' && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: [0, 80, 80], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, times: [0, 0.4, 1] }}
              className="absolute z-20 text-3xl"
              style={{ left: '60%' }}
            >
              {foodDropEmoji}
            </motion.div>
          )}

          {/* Drops for Water */}
          {currentAnimation === 'water' && (
            <motion.div
              initial={{ y: -30, scale: 0.5, opacity: 0 }}
              animate={{ y: 80, scale: [1, 1.3, 0.8], opacity: [1, 1, 0] }}
              transition={{ duration: 1.8 }}
              className="absolute z-20 text-4xl"
              style={{ left: '55%' }}
            >
              💧
            </motion.div>
          )}

          {/* Bouncing Play ball */}
          {ballBounce && (
            <motion.div
              initial={{ x: -140, y: 70 }}
              animate={{ x: [ -140, -40, 80, 140 ], y: [ 70, -20, 70, -20 ] }}
              transition={{ duration: 2.3, repeat: Infinity }}
              className="absolute z-20 text-3xl"
            >
              🎾
            </motion.div>
          )}

          {/* Floating Hearts for petting */}
          {currentAnimation === 'pet' && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.5, 2], opacity: [0, 1, 0], y: -40 }}
                transition={{ duration: 1.2 }}
                className="text-4xl"
              >
                ❤️
              </motion.div>
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.2, 1.8], opacity: [0, 1, 0], y: -50, x: -30 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="text-2xl absolute"
              >
                💖
              </motion.div>
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.2, 1.8], opacity: [0, 1, 0], y: -45, x: 30 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-2xl absolute"
              >
                💕
              </motion.div>
            </div>
          )}

          {/* Sparkles / Wise Train Cap */}
          {currentAnimation === 'train' && (
            <motion.div
              initial={{ y: -60, scale: 0, opacity: 0 }}
              animate={{ y: -30, scale: 1.1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute top-12 z-20 text-3xl"
            >
              🎓
            </motion.div>
          )}

          {/* Interactive Core Pet Entity */}
          <motion.div
            onClick={handleTapPet}
            animate={
              currentAnimation === 'sleep'
                ? { y: 25, rotate: 85, scale: 0.95 }
                : currentAnimation === 'feed'
                ? { x: [ -30, 40, 40, -30 ], y: [ 10, 10, 0, 10 ], scale: [ 1, 1, 1.15, 1 ] }
                : currentAnimation === 'water'
                ? { x: [ -10, 30, 30, -10 ], rotate: [ 0, 15, -10, 0 ] }
                : currentAnimation === 'play'
                ? { y: [ 10, -50, 10, -30, 10 ], rotate: [ 0, 360, 0, -360, 0 ] }
                : currentAnimation === 'clean'
                ? { rotate: 360, scale: [1, 1.1, 1] }
                : currentAnimation === 'train'
                ? { rotateY: 360, y: [10, -40, 10] }
                : currentAnimation === 'pet'
                ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }
                : { y: [10, -6, 10] } // gentle idle float
            }
            transition={
              currentAnimation 
                ? { duration: 2.2, ease: 'easeInOut' }
                : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
            }
            className="text-7xl select-none filter drop-shadow-[0_8px_16px_rgba(168,85,247,0.45)] z-20 cursor-pointer"
          >
            {currentStageInfo.emoji}
          </motion.div>

        </div>

        {/* Display Speech bubble and action narration */}
        <div className="bg-[#19102c]/90 border border-purple-500/15 p-3.5 rounded-2xl relative shadow-md">
          <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#19102c] border-t border-l border-purple-500/15 rotate-45"></div>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold text-center italic">
            "{petActionText}"
          </p>
        </div>

        {/* Life cycle stats bar */}
        <div className="bg-[#1b1031]/40 border border-purple-500/10 p-3 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              Growth Cycle
            </span>
            <span className="font-extrabold text-purple-300">
              Day {pet.age} • {pet.growth}% Growth
            </span>
          </div>

          <div className="w-full bg-[#11091f] rounded-full h-3 p-0.5 border border-white/5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${pet.growth}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-400">
            <span>Stage: <span className="text-yellow-400 font-bold">{currentStageInfo.stage}</span></span>
            <span>Feed, Play, Clean or Train to gain growth & age!</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 bg-[#11091f] p-1 rounded-2xl border border-white/5">
          {(['care', 'shop', 'backpack', 'missions', 'badges'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-0.5 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer capitalize ${
                activeTab === tab 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/25 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'care' ? '❤️ Care' :
               tab === 'shop' ? '🛒 Shop' :
               tab === 'backpack' ? '🎒 Backpack' :
               tab === 'missions' ? '🎯 Daily' : '🏆 Badges'}
            </button>
          ))}
        </div>

        {/* Tab panels details */}
        {activeTab === 'care' && (
          <div className="space-y-4 animate-fade-in">
            {/* Realtime Stats Bar display */}
            <div className="grid grid-cols-4 gap-2 bg-[#11091f] p-3 rounded-2xl border border-white/5">
              <div className="space-y-1 text-center">
                <span className="text-[10px] text-red-400 font-bold block">❤️ Happiness</span>
                <div className="w-full bg-[#1b1031] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${pet.happiness}%` }}></div>
                </div>
                <span className="text-xs font-extrabold text-white">{pet.happiness}%</span>
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[10px] text-amber-500 font-bold block">🍔 Hunger</span>
                <div className="w-full bg-[#1b1031] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pet.hunger}%` }}></div>
                </div>
                <span className="text-xs font-extrabold text-white">{pet.hunger}%</span>
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[10px] text-cyan-400 font-bold block">😴 Energy</span>
                <div className="w-full bg-[#1b1031] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${pet.energy}%` }}></div>
                </div>
                <span className="text-xs font-extrabold text-white">{pet.energy}%</span>
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[10px] text-emerald-400 font-bold block">🧼 Cleanliness</span>
                <div className="w-full bg-[#1b1031] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pet.cleanliness}%` }}></div>
                </div>
                <span className="text-xs font-extrabold text-white">{pet.cleanliness}%</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Quick Companion Care</h4>
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* Feed quick button */}
                <button
                  onClick={() => handleFeed('seeds', '🌾', 15, 5)}
                  disabled={currentAnimation !== null}
                  className="flex items-center justify-between p-3 bg-[#1d1033] hover:bg-purple-950/40 border border-purple-500/10 rounded-xl text-left cursor-pointer transition-transform active:scale-95 text-white disabled:opacity-50"
                >
                  <div>
                    <span className="block text-xs font-bold">🌾 Feed Seeds</span>
                    <span className="text-[10px] text-slate-400">Qty: {pet.inventory.seeds} left</span>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 font-bold">+5% Grow</span>
                </button>

                {/* Give water quick button */}
                <button
                  onClick={handleGiveWater}
                  disabled={currentAnimation !== null}
                  className="flex items-center justify-between p-3 bg-[#1d1033] hover:bg-purple-950/40 border border-purple-500/10 rounded-xl text-left cursor-pointer transition-transform active:scale-95 text-white disabled:opacity-50"
                >
                  <div>
                    <span className="block text-xs font-bold">💧 Give Water</span>
                    <span className="text-[10px] text-slate-400">Qty: {pet.inventory.water} left</span>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 font-bold">+5% Grow</span>
                </button>

                {/* Toss Ball Play */}
                <button
                  onClick={() => handlePlay('ball', '🎾', 25, 10)}
                  disabled={currentAnimation !== null}
                  className="flex items-center justify-between p-3 bg-[#1d1033] hover:bg-purple-950/40 border border-purple-500/10 rounded-xl text-left cursor-pointer transition-transform active:scale-95 text-white disabled:opacity-50"
                >
                  <div>
                    <span className="block text-xs font-bold">🎾 Toss Ball</span>
                    <span className="text-[10px] text-slate-400">Qty: {pet.inventory.ball} left</span>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 font-bold">+10% Grow</span>
                </button>

                {/* Wash and clean */}
                <button
                  onClick={handleClean}
                  disabled={currentAnimation !== null}
                  className="flex items-center justify-between p-3 bg-[#1d1033] hover:bg-purple-950/40 border border-purple-500/10 rounded-xl text-left cursor-pointer transition-transform active:scale-95 text-white disabled:opacity-50"
                >
                  <div>
                    <span className="block text-xs font-bold">🧼 Wash & Clean</span>
                    <span className="text-[10px] text-slate-400">Qty: {pet.inventory.soap} left</span>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 font-bold">+5% Grow</span>
                </button>

                {/* Sleep button */}
                <button
                  onClick={handleSleep}
                  disabled={currentAnimation !== null}
                  className="flex items-center justify-between p-3 bg-[#1d1033] hover:bg-purple-950/40 border border-purple-500/10 rounded-xl text-left cursor-pointer transition-transform active:scale-95 text-white disabled:opacity-50 col-span-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">😴</span>
                    <div>
                      <span className="block text-xs font-bold">Sleep / Rest in Cozy Bed</span>
                      <span className="text-[10px] text-slate-400">Restores Energy completely and boosts Happiness</span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 px-1.5 py-1 rounded text-purple-300 font-bold">+8% Grow</span>
                </button>

              </div>
            </div>

            {/* Claim Daily Gift box card */}
            <div className="pt-1.5">
              <button
                onClick={handleClaimDailyGift}
                disabled={!isClaimable}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isClaimable
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:scale-102 active:scale-95 shadow-yellow-500/10'
                    : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                <Gift className="w-4 h-4" />
                {isClaimable ? '🎁 Claim Your Daily Check-In Gift (+50 Coins!)' : '🎁 Daily Wellness Gift Opened (Come Back Tomorrow!)'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Companion Wellness Store</h4>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded font-bold">Earn coins in other app tasks!</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {SHOP_ITEMS.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#11091f] border border-white/5 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <span className="block text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePurchase(item.id as any, item.cost, item.name)}
                      className="py-1.5 px-3.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>🪙</span>
                      <span>{item.cost}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'backpack' && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Inventory & Food Items</h4>
            
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              
              {/* Seeds Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🌾</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.seeds}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Seeds</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Hunger by +15</span>
                </div>
                <button
                  onClick={() => handleFeed('seeds', '🌾', 15, 5)}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Feed Pet
                </button>
              </div>

              {/* Water Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">💧</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.water}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Pure Water</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Energy +15</span>
                </div>
                <button
                  onClick={handleGiveWater}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Give Water
                </button>
              </div>

              {/* Apple Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🍎</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.apple}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Apple</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Hunger +25</span>
                </div>
                <button
                  onClick={() => handleFeed('apple', '🍎', 25, 10)}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Feed Apple
                </button>
              </div>

              {/* Banana Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🍌</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.banana}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Banana</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Hunger +30</span>
                </div>
                <button
                  onClick={() => handleFeed('banana', '🍌', 30, 12)}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Feed Banana
                </button>
              </div>

              {/* Nuts Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🥜</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.nuts}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Mixed Nuts</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Hunger +20</span>
                </div>
                <button
                  onClick={() => handleFeed('nuts', '🥜', 20, 8)}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Feed Nuts
                </button>
              </div>

              {/* Soap Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🧼</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.soap}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Soap</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Cleanliness +50</span>
                </div>
                <button
                  onClick={handleClean}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Clean Pet
                </button>
              </div>

              {/* Toy Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🧸</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.toy}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Teddy Plush</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Happiness +40</span>
                </div>
                <button
                  onClick={() => handlePlay('toy', '🧸', 40, 15)}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Cuddle Toy
                </button>
              </div>

              {/* Ball Backpack item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">🎾</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.ball}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Play Ball</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Restores Happiness +25</span>
                </div>
                <button
                  onClick={() => handlePlay('ball', '🎾', 25, 10)}
                  className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Play Ball
                </button>
              </div>

              {/* Medicine item */}
              <div className="bg-[#11091f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2 col-span-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">💊</span>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded">Qty: {pet.inventory.medicine}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">Vitamins & Medicine</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Fully heals every single status stat by +30</span>
                </div>
                <button
                  onClick={handleMedicine}
                  className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  Administer Medicine
                </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Daily Care Missions</h4>
              <span className="text-[10px] text-slate-400">Resets daily</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              
              {/* Feed pet twice */}
              <div className="bg-[#11091f] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Feed your companion twice</span>
                  <span className="text-[10px] text-slate-400">Progress: {Math.min(2, pet.missions.feedCount)} / 2 feeds completed</span>
                </div>
                {isFeedDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-purple-400 font-extrabold">In Progress</span>
                )}
              </div>

              {/* Water Once */}
              <div className="bg-[#11091f] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Give fresh mineral water once</span>
                  <span className="text-[10px] text-slate-400">Keep your companion hydrated and healthy</span>
                </div>
                {pet.missions.waterDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-purple-400 font-extrabold">In Progress</span>
                )}
              </div>

              {/* Play once */}
              <div className="bg-[#11091f] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Play with your companion once</span>
                  <span className="text-[10px] text-slate-400">Use Teddy toy or tennis Ball to trigger fun</span>
                </div>
                {pet.missions.playDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-purple-400 font-extrabold">In Progress</span>
                )}
              </div>

              {/* Clean once */}
              <div className="bg-[#11091f] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Wash & clean your companion</span>
                  <span className="text-[10px] text-slate-400">Use soap to keep their coat sparkling fresh</span>
                </div>
                {pet.missions.cleanDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-purple-400 font-extrabold">In Progress</span>
                )}
              </div>

              {/* Sleep once */}
              <div className="bg-[#11091f] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Put your companion to sleep</span>
                  <span className="text-[10px] text-slate-400">Rest restores maximum physical energy</span>
                </div>
                {pet.missions.sleepDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-purple-400 font-extrabold">In Progress</span>
                )}
              </div>

              {/* Train once */}
              <div className="bg-[#11091f] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Perform mind training skills</span>
                  <span className="text-[10px] text-slate-400">Costs energy but boosts core growth %</span>
                </div>
                {pet.missions.trainDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-purple-400 font-extrabold">In Progress</span>
                )}
              </div>

            </div>

            {/* Claim button */}
            <button
              onClick={handleClaimMissions}
              disabled={!isMissionClaimable}
              className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isMissionClaimable
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-102 text-white active:scale-95'
                  : pet.missions.claimed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-not-allowed'
                  : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Trophy className="w-4 h-4" />
              {pet.missions.claimed 
                ? '🏆 All Daily Missions Claimed (Awesome job!)' 
                : isMissionsComplete 
                ? '🎁 Claim All Missions Reward (+50 Coins, +50 XP & +25% Growth!)' 
                : '🔒 Complete All Care Tasks to Unlock Reward'}
            </button>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Achievements & Growth Badges</h4>
            
            <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {STATIC_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = pet.unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-[#1a1133] border-purple-500/20 text-slate-200'
                        : 'bg-[#11091f]/50 border-white/5 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{ach.icon}</span>
                      <span className="text-xs font-bold block">{ach.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{ach.desc}</p>
                    <span className="text-[9px] mt-1.5 inline-block font-mono uppercase font-bold text-purple-400">
                      {isUnlocked ? 'Unlocked ✓' : 'Locked 🔒'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Abandon Pet Center option */}
        <div className="pt-2 text-center border-t border-white/5">
          <button
            onClick={handleAbandon}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold bg-red-500/5 hover:bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/10 transition-all cursor-pointer"
          >
            Release Current Pet 🐾
          </button>
        </div>

      </div>
    </div>
  );
}
