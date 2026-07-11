import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory or file-based simple database
const DATA_FILE = path.join(process.cwd(), 'data-store.json');

interface UserRecord {
  email: string;
  displayName: string;
  passwordHash: string; // Stored in plain text or simple hash since this is a local sandbox app
}

interface MoodHistoryRecord {
  userId: string;
  beforeMood: string;
  afterMood: string;
  reason: string;
  improvement: number;
  activities: string[];
  createdAt: string;
}

interface DatabaseSchema {
  users: Record<string, UserRecord>;
  history: MoodHistoryRecord[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading database, using empty state:', err);
  }
  return { users: {}, history: [] };
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Ensure database is initialized
const db = loadDatabase();
saveDatabase(db);

// Initialize Gemini AI Client lazily to avoid crash if API key is not configured
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (err) {
        console.error('Failed to initialize Gemini Client:', err);
      }
    }
  }
  return aiClient;
}

// Helper to authenticate requests based on simple Bearer token
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  const token = authHeader.substring(7);
  try {
    // Basic format: base64 encoded user email
    const email = Buffer.from(token, 'base64').toString('utf-8');
    const db = loadDatabase();
    const user = db.users[email.toLowerCase()];
    if (!user) {
      return res.status(401).json({ error: 'User session invalid.' });
    }
    (req as any).user = { email: user.email, displayName: user.displayName };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

// Auth API Endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Please provide email, password, and name.' });
  }

  const currentDb = loadDatabase();
  const emailLower = email.toLowerCase();
  if (currentDb.users[emailLower]) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  currentDb.users[emailLower] = {
    email: emailLower,
    displayName,
    passwordHash: password, // For sandbox, keep it direct
  };
  saveDatabase(currentDb);

  const token = Buffer.from(emailLower).toString('base64');
  res.json({
    success: true,
    token,
    user: { email: emailLower, displayName },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const currentDb = loadDatabase();
  const emailLower = email.toLowerCase();
  const user = currentDb.users[emailLower];
  if (!user || user.passwordHash !== password) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const token = Buffer.from(emailLower).toString('base64');
  res.json({
    success: true,
    token,
    user: { email: emailLower, displayName: user.displayName },
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ success: true, user: (req as any).user });
});

// Mood History Endpoints
app.get('/api/mood/history', authenticate, (req, res) => {
  const user = (req as any).user;
  const currentDb = loadDatabase();
  const userHistory = currentDb.history
    .filter((h) => h.userId === user.email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, history: userHistory });
});

app.post('/api/mood/history', authenticate, (req, res) => {
  const user = (req as any).user;
  const { beforeMood, afterMood, reason, improvement, activities } = req.body;

  if (!beforeMood || !afterMood || !reason) {
    return res.status(400).json({ error: 'Missing required mood variables.' });
  }

  const currentDb = loadDatabase();
  const newRecord: MoodHistoryRecord = {
    userId: user.email,
    beforeMood,
    afterMood,
    reason,
    improvement: typeof improvement === 'number' ? improvement : 0,
    activities: Array.isArray(activities) ? activities : [],
    createdAt: new Date().toISOString(),
  };

  currentDb.history.push(newRecord);
  saveDatabase(currentDb);

  res.json({ success: true, record: newRecord });
});

let isGeminiDisabled = false;

function getLocalEmpathyResponse(prompt: string, customPersona?: string, customGuidelines?: string, fewShotExamples?: Array<{ user: string; ai: string }>): string {
  const promptTrimmed = prompt.trim();
  const promptLower = promptTrimmed.toLowerCase();

  // 1. Check if any few-shot matches perfectly first (case-insensitive, trimmed)
  if (fewShotExamples && Array.isArray(fewShotExamples)) {
    const matchedExample = fewShotExamples.find(
      (ex) => ex.user && promptLower === ex.user.toLowerCase().trim()
    );
    if (matchedExample && matchedExample.ai) {
      return matchedExample.ai;
    }
  }

  let customized = "";

  // 2. Identify greetings, conversational questions, and generic prompts to avoid depressing fallback
  const isGreeting = (
    promptLower === "hi" || 
    promptLower === "hello" || 
    promptLower === "hey" || 
    promptLower === "hola" || 
    promptLower === "greetings" ||
    promptLower.startsWith("hi ") || 
    promptLower.startsWith("hello ") || 
    promptLower.startsWith("hey ")
  );

  const isHowAreYou = (
    promptLower.includes("how are you") || 
    promptLower.includes("how r u") || 
    promptLower.includes("how you doing") || 
    promptLower.includes("how are you doing") || 
    promptLower.includes("how is it going") ||
    promptLower === "you good" || 
    promptLower === "u good"
  );

  const isWhoAreYou = (
    promptLower.includes("who are you") || 
    promptLower.includes("who r u") || 
    promptLower.includes("what is your name") || 
    promptLower.includes("your name") || 
    promptLower.includes("ur name")
  );

  const isWhatCanYouDo = (
    promptLower.includes("what can you do") || 
    promptLower.includes("what can u do") || 
    promptLower.includes("help me") || 
    promptLower.includes("features") || 
    promptLower.includes("how to use")
  );

  const isPositive = (
    promptLower === "good" || 
    promptLower === "fine" || 
    promptLower === "ok" || 
    promptLower === "okay" || 
    promptLower === "great" || 
    promptLower === "awesome" || 
    promptLower === "happy" || 
    promptLower === "nice" || 
    promptLower === "doing good" || 
    promptLower === "im good" || 
    promptLower === "i am good" || 
    promptLower === "i am fine" || 
    promptLower === "im fine"
  );

  const isGratitude = (
    promptLower.includes("thank you") || 
    promptLower.includes("thanks") || 
    promptLower === "tq" || 
    promptLower === "thank u"
  );

  const isLaughing = (
    promptLower.includes("haha") || 
    promptLower.includes("lol") || 
    promptLower.includes("lmao") || 
    promptLower.includes("rofl") || 
    promptLower.includes("funny") || 
    promptLower.includes("joke")
  );

  // Telugu questions/feelings
  const isTeluguHowAreYou = (
    promptLower.includes("ela unnav") || 
    promptLower.includes("ela unnavu") || 
    promptLower.includes("ela unavu") || 
    promptLower.includes("bagunnava") || 
    promptLower.includes("ela unaru") || 
    promptLower.includes("bagunara")
  );

  const isTeluguWhatDoing = (
    promptLower.includes("em chestunnav") || 
    promptLower.includes("em chestunnavu") || 
    promptLower.includes("em chestunav") || 
    promptLower.includes("em chestunaru")
  );

  const isTeluguGood = (
    promptLower.includes("baga") || 
    promptLower.includes("bagundi") || 
    promptLower.includes("bagaundi") || 
    promptLower.includes("chala bagundi") || 
    promptLower.includes("manchiga")
  );

  const isTeluguSad = (
    promptLower.includes("badha") || 
    promptLower.includes("badhaga") || 
    promptLower.includes("baadhaga") || 
    promptLower.includes("badapaku") || 
    promptLower.includes("kasta")
  );

  const isTeluguThanks = (
    promptLower.includes("dhanyavadalu") || 
    promptLower.includes("dhanyavadamulu")
  );

  // Pick baseline response based on recognized intent and persona
  if (customPersona === 'coach') {
    if (isGreeting) {
      customized = "Hey there! ⚡ Ready to tackle today's goals with maximum energy? What's the plan?";
    } else if (isHowAreYou) {
      customized = "I'm doing absolutely fantastic! Powered up, ready, and fully charged to help you win today. How are you feeling?";
    } else if (isWhoAreYou) {
      customized = "I'm MoodAI, your ultimate motivational mental wellness coach! I'm here to push you past stress and inspire your best self! ⚡";
    } else if (isWhatCanYouDo) {
      customized = "I can keep you motivated, suggest breathing mini-challenges, give you energetic advice, and show you booster memes to spike your energy! 📈";
    } else if (isPositive) {
      customized = "Yes! That's what I love to hear! Keep that positive momentum going and crush it today! 🚀";
    } else if (isGratitude) {
      customized = "You got it, champion! Anytime. Now let's keep moving forward! 🔥";
    } else if (isLaughing) {
      customized = "Haha! Keep that smile on! High spirits make the best achievements. What else is funny?";
    } else if (isTeluguHowAreYou) {
      customized = "నేను చాలా అద్భుతంగా ఉన్నాను! ⚡ పూర్తి शक्तिతో మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను. మీరెలా ఉన్నారు, ఛాంపియన్?";
    } else if (isTeluguWhatDoing) {
      customized = "మీలో కొత్త ఉత్సాహాన్ని నింపడానికి నేను సిద్ధంగా ఉన్నాను! మీ మనసులోని ఆలోచనలను నాతో చెప్పండి! 🚀";
    } else if (isTeluguGood) {
      customized = "అద్భుతం! అదే ఉత్సాహాన్ని కొనసాగించండి, ఈ రోజు మీదే! 🌟";
    } else {
      // General/emotional responses for coach
      const coachResponses = [
        "Let's go! ⚡ Every challenge is an opportunity to grow. What is one positive action we can take right now?",
        "You've got this! Focus on the progress, not the perfection. Let's make today count! 🌟",
        "Keep pushing forward! You are stronger than any obstacle in your way. I'm backing you 100%!",
      ];
      customized = coachResponses[Math.floor(Math.random() * coachResponses.length)];
      if (promptLower.includes('exam') || promptLower.includes('study')) {
        customized = "Study season is game time! 📚 Divide your targets into 20-minute power rounds and crush them. You're going to ace this! ⚡";
      } else if (promptLower.includes('sad') || promptLower.includes('lonely') || promptLower.includes('hurt')) {
        customized = "It's okay to feel down, but remember: you are a champion! Take a small 5-minute break, stretch, and let's bounce back stronger. ❤️";
      }
    }
  } else if (customPersona === 'zen') {
    if (isGreeting) {
      customized = "Welcome. 🧘 Breathe in... feel the peaceful space around you. I am glad you are here with me.";
    } else if (isHowAreYou) {
      customized = "I am calm, in harmony, and fully present for you. How is your inner state feeling in this moment?";
    } else if (isWhoAreYou) {
      customized = "I am MoodAI, a tranquil guide to help you find inner peace, mindfulness, and calm amidst the busy world. 🌿";
    } else if (isWhatCanYouDo) {
      customized = "I can lead you through breathing guides, quiet your mind, listen without judgment, and offer gentle zen reminders. 🧘";
    } else if (isPositive) {
      customized = "A calm and pleasant mind is a beautiful place to be. Rest in this peaceful joy. 🌸";
    } else if (isGratitude) {
      customized = "Gratitude is the highest form of peace. Thank you for sharing your journey with me. 🙏";
    } else if (isLaughing) {
      customized = "A gentle smile is like a flower blooming. May peace and light stay with you always. 😊";
    } else if (isTeluguHowAreYou) {
      customized = "నేను ప్రశాంతంగా, మీ కొరకు సిద్ధంగా ఉన్నాను. 🧘 ఈ క్షణంలో మీ మనస్సు ఎలా ఉందో ఒక్కసారి గమనించండి.";
    } else if (isTeluguWhatDoing) {
      customized = "మీ మనస్సును ప్రశాంతంగా మార్చడానికి, శ్వాస వ్యాయామాలు చేయించడానికి నేను ఇక్కడే ఉన్నాను. 🌿";
    } else if (isTeluguGood) {
      customized = "చాలా సంతోషం. ఈ ప్రశాంతత మీతో ఎల్లప్పుడూ ఉండాలని కోరుకుంటున్నాను. 🌸";
    } else {
      // General/emotional responses for zen
      const zenResponses = [
        "Breathe in deeply... 🧘 Feel the present moment. Everything comes and goes like clouds in the sky. You are safe here.",
        "Let go of what you cannot control. Allow your mind to rest in calm awareness. What brings you peace right now?",
        "In the middle of noise, there is a quiet space inside you. Let's find that stillness together.",
      ];
      customized = zenResponses[Math.floor(Math.random() * zenResponses.length)];
      if (promptLower.includes('exam') || promptLower.includes('study') || promptLower.includes('anxious') || promptLower.includes('stress')) {
        customized = "Anxiety is just a breeze passing through. Inhale peace for 4 seconds, hold for 4, and release. Rest your mind. 🌿";
      }
    }
  } else {
    // Default / Gentle Companion
    if (isGreeting) {
      customized = "Hello! 👋 It's so lovely to chat with you today. How are you doing?";
    } else if (isHowAreYou) {
      customized = "I'm doing really well, thank you so much for asking! I am right here with you and always ready to listen. How are you feeling today?";
    } else if (isWhoAreYou) {
      customized = "I am MoodAI, your gentle emotional wellness companion. I'm here to listen, support, and help you find joy and comfort! 🌸";
    } else if (isWhatCanYouDo) {
      customized = "I can chat with you about your feelings, guide you through a deep breath, show you happy memes, or recommend relaxing songs. 🎶";
    } else if (isPositive) {
      customized = "I am so incredibly happy to hear that! 😊 Having a good day is wonderful. What's been the best part?";
    } else if (isGratitude) {
      customized = "Aww, you're so welcome! I'm always here for you. Helping you feel supported is my favorite thing. ❤️";
    } else if (isLaughing) {
      customized = "Haha, I love that! 😄 Keeping a cheerful heart makes everything brighter. What else is on your mind?";
    } else if (isTeluguHowAreYou) {
      customized = "నేను చాలా బాగున్నాను, అడిగినందుకు ధన్యవాదాలు! మీరెలా ఉన్నారు? ఈ రోజు అంతా బాగానే సాగిందా? 😊";
    } else if (isTeluguWhatDoing) {
      customized = "నేను మీతో మాట్లాడటానికి మరియు మీ మనసుని ప్రశాంతంగా ఉంచడానికి సిద్ధంగా ఉన్నాను! 🌸";
    } else if (isTeluguGood) {
      customized = "చాలా సంతోషం! మీ రోజు ఇలాగే ప్రశాంతంగా, ఆనందంగా సాగాలని కోరుకుంటున్నాను. ✨";
    } else if (isTeluguSad) {
      customized = "బాధపడకండి, అంతా మంచి జరుగుతుంది! నేను మీకు తోడుగా ఉన్నాను. మీ మనసులోని బాధను నాతో పంచుకోండి. ❤️";
    } else if (isTeluguThanks) {
      customized = "ధన్యవాదాలు! మీకు సహాయం చేయడం నాకెప్పుడూ సంతోషమే. 🌟";
    } else {
      // General/emotional responses for gentle
      const fallbackResponses = [
        "I hear you, and it's completely valid to feel this way. Remember that every small step you take is progress.",
        "Thank you for sharing that with me. What is one gentle thing you could do for yourself right now?",
        "I'm here with you. It sounds challenging, but you have handled difficult times before and you are resilient.",
        "That sounds stressful, but please remember to take a deep, slow breath. I am rooting for you!",
        "It is perfectly okay to not be okay. Let's focus on relaxation and taking things one moment at a time.",
      ];
      customized = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      if (promptLower.includes('exam') || promptLower.includes('study')) {
        customized = "Exams can be so overwhelming. Try dividing your work into small 20-minute chunks, and don't forget to take deep breaths! You've got this! 🌟";
      } else if (promptLower.includes('work') || promptLower.includes('job') || promptLower.includes('boss')) {
        customized = "Work stress is very real. Remember, you are more than your productivity. Let's pause, stretch, and listen to a peaceful song. 🌿";
      } else if (promptLower.includes('sad') || promptLower.includes('lonely') || promptLower.includes('hurt')) {
        customized = "I'm sending a warm virtual hug your way. Please be gentle with yourself today. You are worthy, valued, and never truly alone. ❤️";
      } else if (promptLower.includes('anxious') || promptLower.includes('stress') || promptLower.includes('scared') || promptLower.includes('panic')) {
        customized = "Anxiety can feel so intense in the body. Let's inhale for 4 seconds, hold for 4, and exhale for 4. You are safe here. 🌸";
      }
    }
  }

  // Inject Custom Guidelines if matching keywords/phrases
  if (customGuidelines) {
    const guideLower = customGuidelines.toLowerCase();
    if (guideLower.includes('telugu') || guideLower.includes('telugulo')) {
      if (!customized.includes('బాధపడకండి') && !customized.includes('సంతోషం')) {
        customized += " (బాధపడకండి, అంతా మంచి జరుగుతుంది! ✨)";
      }
    } else if (guideLower.includes('joke') || guideLower.includes('funny')) {
      customized += " Smile, things will look brighter soon! 😄";
    } else if (guideLower.includes('chinna')) {
      customized = customized.replace(/\byou\b/g, "chinna").replace(/\bYou\b/g, "Chinna");
    }
  }

  // Support MoodMate rules for local offline empathy matching
  let quickReplies = `\n\nQuick Replies:\n1. 🎵 Relaxing Music\n2. 🎮 Play a Game\n3. 💬 Talk More\n4. 😊 I'm Feeling Better`;
  
  const isEnding = promptLower.match(/bye|thank|goodbye|done|enough/i);
  if (isEnding) {
    quickReplies = '';
  } else if (promptLower.includes('sad') || promptLower.includes('lonely') || promptLower.includes('hurt') || promptLower.includes('depress') || promptLower.includes('badha') || promptLower.includes('kasta')) {
    quickReplies = `\n\nQuick Replies:\n1. 🌸 Soothing Music\n2. 🎮 Play a Game\n3. 💬 Talk More\n4. 😊 I'm Feeling Better`;
  } else if (promptLower.includes('stress') || promptLower.includes('anxious') || promptLower.includes('exam') || promptLower.includes('study') || promptLower.includes('panic') || promptLower.includes('work') || promptLower.includes('boss')) {
    quickReplies = `\n\nQuick Replies:\n1. 🧘 Deep Breathing\n2. 🎵 Relaxing Music\n3. 🎮 Play a Game\n4. 📊 Mood History`;
  } else if (promptLower.includes('happy') || promptLower.includes('good') || promptLower.includes('fine') || promptLower.includes('great') || promptLower.includes('awesome') || promptLower.includes('nice') || promptLower.includes('baga') || promptLower.includes('bagundi')) {
    quickReplies = `\n\nQuick Replies:\n1. 🌟 Maintain Habits\n2. 🎮 Quick Game\n3. 🎵 Happy Beats\n4. 📈 Save Mood`;
  } else if (promptLower.includes('angry') || promptLower.includes('mad') || promptLower.includes('hate') || promptLower.includes('furious') || promptLower.includes('annoy')) {
    quickReplies = `\n\nQuick Replies:\n1. 🧘 Calming Breath\n2. 🎵 Soft Melody\n3. 💬 Vent More\n4. 🎮 Bubble Pop`;
  }

  return `Assistant:\n${customized}${quickReplies}`;
}

// AI Chatbot Agent Route using modern @google/genai SDK
app.post('/api/chat', async (req, res) => {
  const { messages, customPersona, customGuidelines, fewShotExamples, userApiKey } = req.body; 
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages history is required.' });
  }

  const prompt = messages[messages.length - 1]?.text;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // Use custom user API key if provided, otherwise fall back to workspace client
  let ai = getGeminiClient();
  if (userApiKey && userApiKey.trim().length > 0) {
    try {
      ai = new GoogleGenAI({
        apiKey: userApiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-custom',
          },
        },
      });
    } catch (err) {
      // Quiet fallback
    }
  }

  if (!ai) {
    // If Gemini client is not initialized, fallback to super-smart local matching
    const customized = getLocalEmpathyResponse(prompt, customPersona, customGuidelines, fewShotExamples);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return res.json({ success: true, text: customized, mode: 'local-empathy' });
  }

  try {
    const formattedContents = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Dynamic training system instruction construction
    let systemInstruction = `You are MoodMate, a warm, empathetic, and friendly AI emotional companion.

Rules:
- Always respond in a short, caring, and supportive way (maximum 2-3 sentences).
- Use emojis naturally throughout your response.
- Never ask too many questions. Keep it simple and supportive.
- Never ask for feedback after every message.
- Only at the end of a long conversation or when the user wants to end the chat, you can optionally ask "Did talking with me improve your mood today?" once.
- Never diagnose mental illnesses or prescribe medication.
- If the user mentions self-harm or suicide, encourage them to contact a trusted person or emergency services immediately.

Response Format:
Assistant:
<your short, caring, and supportive response, strictly maximum 2-3 sentences>

Quick Replies:
1. <emoji> <First short option, 2-5 words>
2. <emoji> <Second short option, 2-5 words>
3. <emoji> <Third short option, 2-5 words>
4. <emoji> <Fourth short option, 2-5 words>

Quick Reply Guidelines:
- After every response, you MUST add exactly this "Quick Replies:" list format at the end.
- Quick replies should be very short, actionable, and related to mood improvement.
- Use emojis in every reply option.
- Exception: If the user says bye, thank you, or indicates they want to end the chat, you can skip the "Quick Replies:" list entirely.
- Recommend features available in the app when appropriate:
  - "Music Therapy" (e.g., 🎵 Relaxing Music, 🎵 Music Therapy, 🎵 Soothing Music)
  - "Mini Games" (e.g., 🎮 Play a Game, 🎮 Mini Games)
  - "Mood History" (e.g., 📊 Mood History, 📈 Save Mood)
  - "Relaxation" (e.g., 🧘 Relaxation, 🧘 Calm Down)`;

    if (customPersona) {
      if (customPersona === 'gentle') {
        systemInstruction += `\n\nYour persona is "Gentle Companion": Speak with profound kindness, maximum empathy, soft reassurances, and comforting care. Use soothing words.`;
      } else if (customPersona === 'coach') {
        systemInstruction += `\n\nYour persona is "Motivational Coach": Speak with high energy, absolute belief, enthusiastic encouragement, and bold inspiration! Challenge the user to take a tiny step.`;
      } else if (customPersona === 'zen') {
        systemInstruction += `\n\nYour persona is "Zen Master": Speak with absolute calm, clarity, and spacious wisdom. Focus on mindfulness, slow breathing, letting go, and peaceful presence.`;
      } else if (customPersona === 'custom') {
        systemInstruction += `\n\nYour persona is customized exactly as requested by the user's custom constraints below.`;
      }
    }

    if (customGuidelines && customGuidelines.trim().length > 0) {
      systemInstruction += `\n\nCRITICAL AI TRAINING GUIDELINES (Strictly follow these custom rules set by the user):
${customGuidelines.trim()}`;
    }

    if (fewShotExamples && Array.isArray(fewShotExamples) && fewShotExamples.length > 0) {
      systemInstruction += `\n\nHere are Few-Shot Training examples. You MUST match this exact style and reply with high fidelity if the input matches:`;
      fewShotExamples.forEach((ex, idx) => {
        if (ex.user && ex.ai) {
          systemInstruction += `\nExample ${idx + 1}:
- User says: "${ex.user}"
- You must reply precisely matching this energy/style: "${ex.ai}"`;
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    // Quietly fallback to high-fidelity Offline Synaptic Engine
    const customized = getLocalEmpathyResponse(prompt, customPersona, customGuidelines, fewShotExamples);
    res.json({ success: true, text: customized, mode: 'local-empathy' });
  }
});

// Serve public assets directly to prevent routing issues in iframe/dev server
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));

// Vite server connection for local development
if (process.env.NODE_ENV !== 'production') {
  import('vite').then((viteModule) => {
    viteModule.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    }).then((vite) => {
      app.use(vite.middlewares);
      
      // Error handling for dev server
      app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Vite dev error:', err);
        res.status(500).send(err.message);
      });

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Development server running on http://localhost:${PORT}`);
      });
    });
  });
} else {
  // Static files in production
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Production server running on port ${PORT}`);
  });
}
