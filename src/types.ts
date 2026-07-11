export type EmotionType = 'Happy' | 'Sad' | 'Angry' | 'Stressed' | 'Relaxed';

export interface User {
  email: string;
  displayName: string;
  token?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string;
}

export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
}

export interface MoodRecord {
  id?: string;
  date: string;
  beforeMood: EmotionType;
  afterMood: EmotionType;
  reason: string;
  improvement: number; // percentage
  activities: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
