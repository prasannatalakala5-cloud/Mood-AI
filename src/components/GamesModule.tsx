import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Sparkles, RefreshCw, Trophy, Target, Gamepad2, Heart } from 'lucide-react';
import { EmotionType } from '../types';

interface GamesModuleProps {
  emotion: EmotionType;
  onFeedbackSubmit: (improved: boolean) => void;
  onBackToDashboard: () => void;
}

export default function GamesModule({ emotion, onFeedbackSubmit, onBackToDashboard }: GamesModuleProps) {
  const [activeGame, setActiveGame] = useState<'none' | 'bubble_pop' | 'brick_breaker' | 'memory_match' | 'fruit_slice'>('none');
  const [showFeedback, setShowFeedback] = useState(false);

  // ----------------------------------------------------
  // Game 1: Bubble Pop (Relaxation)
  // ----------------------------------------------------
  const BubblePopGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [poppedCount, setPoppedCount] = useState(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      const bubbles: {
        x: number;
        y: number;
        radius: number;
        speedY: number;
        speedX: number;
        color: string;
        alpha: number;
        popping: boolean;
        popFrame: number;
      }[] = [];

      const colors = [
        'rgba(167, 139, 250, 0.7)', // Purple
        'rgba(96, 165, 250, 0.7)',  // Blue
        'rgba(52, 211, 153, 0.7)',  // Green
        'rgba(248, 113, 113, 0.7)', // Red
        'rgba(251, 146, 60, 0.7)',  // Orange
        'rgba(244, 63, 94, 0.7)',   // Pink
      ];

      // Spawn bubbles
      const spawnBubble = (yOverride?: number) => {
        const radius = Math.random() * 15 + 15; // 15 to 30 radius
        bubbles.push({
          x: Math.random() * (canvas.width - radius * 2) + radius,
          y: yOverride !== undefined ? yOverride : canvas.height + radius + Math.random() * 100,
          radius: radius,
          speedY: -(Math.random() * 1.2 + 0.6), // Slow float up
          speedX: Math.sin(Math.random() * Math.PI) * 0.4, // Slight wobble
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          popping: false,
          popFrame: 0,
        });
      };

      // Initial batch of bubbles
      for (let i = 0; i < 15; i++) {
        spawnBubble(Math.random() * canvas.height);
      }

      const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        let clientX = 0;
        let clientY = 0;

        if ('touches' in e) {
          if (e.touches.length === 0) return;
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        const mx = clientX - rect.left;
        const my = clientY - rect.top;

        // Check which bubble was clicked
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];
          if (!b.popping) {
            const dx = mx - b.x;
            const dy = my - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < b.radius + 8) { // Add touch leniency
              b.popping = true;
              setScore((s) => s + 10);
              setPoppedCount((c) => c + 1);
              break; // Pop one bubble at a time per tap
            }
          }
        }
      };

      canvas.addEventListener('mousedown', handlePointerDown);
      canvas.addEventListener('touchstart', handlePointerDown);

      // Animation Loop
      const update = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw soft zen background glow
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 20,
          canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, '#0F091F');
        gradient.addColorStop(1, '#05020A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update & Render bubbles
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];

          if (b.popping) {
            b.popFrame++;
            // Draw expanding popping ring
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius + b.popFrame * 3, 0, Math.PI * 2);
            ctx.strokeStyle = b.color.replace('0.7', String(Math.max(0, 1 - b.popFrame / 10)));
            ctx.lineWidth = 2;
            ctx.stroke();

            // Tiny splash dots
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
              const px = b.x + Math.cos(angle) * (b.radius + b.popFrame * 2);
              const py = b.y + Math.sin(angle) * (b.radius + b.popFrame * 2);
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = b.color;
              ctx.fill();
            }

            if (b.popFrame >= 10) {
              bubbles.splice(i, 1);
              spawnBubble(); // Respawn a new one at the bottom
            }
          } else {
            b.y += b.speedY;
            b.x += b.speedX;

            // Handle walls
            if (b.x - b.radius < 0 || b.x + b.radius > canvas.width) {
              b.speedX *= -1;
            }

            // Wrap around top
            if (b.y + b.radius < 0) {
              b.y = canvas.height + b.radius;
              b.x = Math.random() * (canvas.width - b.radius * 2) + b.radius;
            }

            // Draw bubble body
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();

            // Glassy reflections
            ctx.beginPath();
            ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius - 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        animationId = requestAnimationFrame(update);
      };

      update();

      return () => {
        canvas.removeEventListener('mousedown', handlePointerDown);
        canvas.removeEventListener('touchstart', handlePointerDown);
        cancelAnimationFrame(animationId);
      };
    }, []);

    return (
      <div className="bg-[#140C24] border border-white/5 p-4 rounded-3xl shadow-lg text-center space-y-4">
        <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
            <Target className="w-4 h-4" />
            <span>Score: {score}</span>
          </div>
          <div className="text-xs text-slate-400">
            Popped: <strong className="text-purple-400">{poppedCount}</strong>
          </div>
          <button
            onClick={() => { setScore(0); setPoppedCount(0); }}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={320}
          height={380}
          className="bg-[#0A0514] border border-white/5 rounded-2xl mx-auto block cursor-pointer shadow-inner"
        />

        <p className="text-[10px] text-slate-400">
          🎈 Tap/click on the beautiful floating bubbles to pop them. Unwind and relax!
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              setShowFeedback(true);
              setActiveGame('none');
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all active:scale-95"
          >
            Finished Playing &rarr;
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Game 2: Brick Breaker (Stress Release)
  // ----------------------------------------------------
  const BrickBreakerGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      const paddleWidth = 75;
      const paddleHeight = 10;
      let paddleX = (canvas.width - paddleWidth) / 2;

      // Ball properties
      let ballX = canvas.width / 2;
      let ballY = canvas.height - 30;
      let ballRadius = 6;
      let dx = 2.5;
      let dy = -2.5;

      // Bricks configuration
      const brickRowCount = 4;
      const brickColumnCount = 6;
      const brickWidth = 43;
      const brickHeight = 15;
      const brickPadding = 5;
      const brickOffsetTop = 35;
      const brickOffsetLeft = 18;

      const colors = ['#f43f5e', '#ec4899', '#a855f7', '#6366f1']; // Bright healing gradients
      const bricks: { x: number; y: number; status: number; color: string }[][] = [];

      for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r % colors.length] };
        }
      }

      // Track touch & mouse movement
      const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        let clientX = 0;
        if ('touches' in e) {
          if (e.touches.length === 0) return;
          clientX = e.touches[0].clientX;
        } else {
          clientX = e.clientX;
        }
        const relativeX = clientX - rect.left;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth / 2;
          // Clamp
          if (paddleX < 0) paddleX = 0;
          if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
        }
      };

      canvas.addEventListener('mousemove', handlePointerMove);
      canvas.addEventListener('touchmove', handlePointerMove, { passive: true });

      // Collision detection with bricks
      const collisionDetection = () => {
        let activeBricks = 0;
        for (let c = 0; c < brickColumnCount; c++) {
          for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
              activeBricks++;
              if (
                ballX > b.x &&
                ballX < b.x + brickWidth &&
                ballY > b.y &&
                ballY < b.y + brickHeight
              ) {
                dy = -dy;
                b.status = 0;
                setScore((s) => s + 20);
              }
            }
          }
        }
        if (activeBricks === 0 && !gameOver) {
          setIsWin(true);
          setGameOver(true);
        }
      };

      const drawBall = () => {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#818cf8';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      };

      const drawPaddle = () => {
        ctx.beginPath();
        ctx.roundRect(paddleX, canvas.height - paddleHeight - 8, paddleWidth, paddleHeight, 5);
        ctx.fillStyle = 'linear-gradient(to right, #818cf8, #c084fc)';
        ctx.fillStyle = '#a78bfa';
        ctx.fill();
      };

      const drawBricks = () => {
        for (let c = 0; c < brickColumnCount; c++) {
          for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
              const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
              const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
              b.x = brickX;
              b.y = brickY;
              ctx.beginPath();
              ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 3);
              ctx.fillStyle = b.color;
              ctx.fill();
            }
          }
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background gradient
        ctx.fillStyle = '#090412';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        // Wall collisions (left/right)
        if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
          dx = -dx;
        }

        // Top collision
        if (ballY + dy < ballRadius) {
          dy = -dy;
        } else if (ballY + dy > canvas.height - ballRadius - 15) {
          // Paddle collision
          if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            // Add angle variation based on where it hit the paddle
            const hitPos = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            dx = hitPos * 3;
            dy = -Math.abs(dy); // Reverse vertical velocity
          } else if (ballY + dy > canvas.height) {
            // Ball dropped. Let's reset without frustrating lives
            ballX = canvas.width / 2;
            ballY = canvas.height - 40;
            dx = 2;
            dy = -2;
          }
        }

        ballX += dx;
        ballY += dy;

        if (!gameOver) {
          animationId = requestAnimationFrame(draw);
        }
      };

      draw();

      return () => {
        canvas.removeEventListener('mousemove', handlePointerMove);
        canvas.removeEventListener('touchmove', handlePointerMove);
        cancelAnimationFrame(animationId);
      };
    }, [gameOver]);

    return (
      <div className="bg-[#140C24] border border-white/5 p-4 rounded-3xl shadow-lg text-center space-y-4">
        <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <Trophy className="w-4 h-4" />
            <span>Score: {score}</span>
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            {isWin ? 'Perfect! 🎉' : 'Break Bricks! 🧱'}
          </div>
          <button
            onClick={() => { setScore(0); setGameOver(false); setIsWin(false); }}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={380}
            className="bg-[#0A0514] border border-white/5 rounded-2xl mx-auto block cursor-crosshair shadow-inner"
          />
          {isWin && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-3 p-6 animate-fade-in">
              <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
              <h4 className="text-white font-extrabold text-base">Stress Released! 🎉</h4>
              <p className="text-xs text-slate-300">You smashed all the barriers perfectly.</p>
              <button
                onClick={() => { setScore(0); setGameOver(false); setIsWin(false); }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-400">
          🧱 Drag/slide the bottom paddle to smash the bricks. Smash all your stresses away!
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              setShowFeedback(true);
              setActiveGame('none');
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all active:scale-95"
          >
            Finished Playing &rarr;
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Game 3: Memory Match (Brain Exercise)
  // ----------------------------------------------------
  const MemoryMatchGame = () => {
    const emojis = ['🧠', '💡', '🧩', '🧬', '🔬', '🚀', '🔮', '🤖'];
    const [cards, setCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);

    const initCards = () => {
      const deck = [...emojis, ...emojis]
        .map((sym, index) => ({ id: index, symbol: sym, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5);
      setCards(deck);
      setSelectedIndices([]);
      setMoves(0);
      setMatches(0);
    };

    useEffect(() => {
      initCards();
    }, []);

    const handleCardClick = (index: number) => {
      if (cards[index].isFlipped || cards[index].isMatched || selectedIndices.length >= 2) return;

      const newCards = [...cards];
      newCards[index].isFlipped = true;
      setCards(newCards);

      const newSelections = [...selectedIndices, index];
      setSelectedIndices(newSelections);

      if (newSelections.length === 2) {
        setMoves((m) => m + 1);
        const [first, second] = newSelections;
        if (cards[first].symbol === cards[second].symbol) {
          // Match!
          setTimeout(() => {
            const matchedCards = [...cards];
            matchedCards[first].isMatched = true;
            matchedCards[second].isMatched = true;
            setCards(matchedCards);
            setSelectedIndices([]);
            setMatches((m) => m + 1);
          }, 300);
        } else {
          // No match, flip back
          setTimeout(() => {
            const flippedCards = [...cards];
            flippedCards[first].isFlipped = false;
            flippedCards[second].isFlipped = false;
            setCards(flippedCards);
            setSelectedIndices([]);
          }, 700);
        }
      }
    };

    return (
      <div className="bg-[#140C24] border border-white/5 p-5 rounded-3xl shadow-lg text-center space-y-4">
        <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl">
          <span className="text-xs font-bold text-slate-400">Moves: {moves}</span>
          <span className="text-xs font-bold text-purple-400">Pairs: {matches} / 8</span>
          <button onClick={initCards} className="p-1 hover:bg-white/10 rounded-lg text-slate-300">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {matches === 8 ? (
          <div className="bg-emerald-950/40 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-emerald-200 text-sm">Brain Exercised! 🧠</h4>
            <p className="text-xs text-emerald-400">Completed wonderfully in {moves} moves!</p>
            <button
              onClick={initCards}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2.5 max-w-[280px] mx-auto">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                  card.isFlipped || card.isMatched
                    ? 'bg-[#1C162E] text-purple-300 border border-purple-500/30'
                    : 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/10'
                }`}
              >
                {(card.isFlipped || card.isMatched) ? card.symbol : '?'}
              </button>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-400">
          🃏 Find matching pairs of cards to complete the workout for your brain!
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              setShowFeedback(true);
              setActiveGame('none');
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all active:scale-95"
          >
            Finished Playing &rarr;
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Game 4: Fruit Slice
  // ----------------------------------------------------
  const FruitSliceGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      
      const fruits: {
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;
        emoji: string;
        color: string;
        sliced: boolean;
        sliceAngle: number;
        sliceLeftX: number;
        sliceRightX: number;
        sliceLeftY: number;
        sliceRightY: number;
      }[] = [];

      const fruitOptions = [
        { emoji: '🍉', color: '#10b981' }, // Watermelon
        { emoji: '🍎', color: '#ef4444' }, // Apple
        { emoji: '🍊', color: '#f97316' }, // Orange
        { emoji: '🍋', color: '#eab308' }, // Lemon
        { emoji: '🍍', color: '#fbbf24' }, // Pineapple
        { emoji: '🥥', color: '#78350f' }, // Coconut
      ];

      // Swipe track
      let swipePoints: { x: number; y: number; time: number }[] = [];

      const spawnFruit = () => {
        const option = fruitOptions[Math.floor(Math.random() * fruitOptions.length)];
        const side = Math.random() < 0.5 ? 'left' : 'right';
        
        fruits.push({
          x: side === 'left' ? 40 : canvas.width - 40,
          y: canvas.height + 20,
          radius: 20,
          vx: side === 'left' ? Math.random() * 2 + 1.5 : -(Math.random() * 2 + 1.5),
          vy: -(Math.random() * 4 + 8.5), // High initial upwards velocity
          emoji: option.emoji,
          color: option.color,
          sliced: false,
          sliceAngle: 0,
          sliceLeftX: 0,
          sliceRightX: 0,
          sliceLeftY: 0,
          sliceRightY: 0,
        });
      };

      // Periodic spawning of fruits
      let spawnTimer = setInterval(spawnFruit, 1200);

      // Track swipe positions
      const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        let clientX = 0;
        let clientY = 0;

        if ('touches' in e) {
          if (e.touches.length === 0) return;
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        const mx = clientX - rect.left;
        const my = clientY - rect.top;

        swipePoints.push({ x: mx, y: my, time: Date.now() });

        // Slice detection
        fruits.forEach((f) => {
          if (!f.sliced) {
            const dx = mx - f.x;
            const dy = my - f.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < f.radius + 15) {
              f.sliced = true;
              f.sliceAngle = Math.random() * Math.PI;
              f.sliceLeftX = -8;
              f.sliceRightX = 8;
              f.sliceLeftY = -2;
              f.sliceRightY = 2;
              setScore((s) => s + 30);
            }
          }
        });
      };

      canvas.addEventListener('mousemove', handlePointerMove);
      canvas.addEventListener('touchmove', handlePointerMove, { passive: true });

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dark background
        ctx.fillStyle = '#08040F';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decay swipe points older than 150ms
        swipePoints = swipePoints.filter((p) => Date.now() - p.time < 150);

        // Draw glowing slash line
        if (swipePoints.length > 1) {
          ctx.beginPath();
          ctx.moveTo(swipePoints[0].x, swipePoints[0].y);
          for (let i = 1; i < swipePoints.length; i++) {
            ctx.lineTo(swipePoints[i].x, swipePoints[i].y);
          }
          ctx.strokeStyle = '#a78bfa';
          ctx.lineWidth = 4;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#c084fc';
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        }

        const gravity = 0.15;

        // Render fruits
        for (let i = fruits.length - 1; i >= 0; i--) {
          const f = fruits[i];
          f.vy += gravity; // physics vertical pull
          f.x += f.vx;
          f.y += f.vy;

          if (f.sliced) {
            // Sliced halves fly apart
            f.sliceLeftX -= 1.5;
            f.sliceRightX += 1.5;
            f.sliceLeftY += gravity * 1.5;
            f.sliceRightY += gravity * 1.5;

            // Half left
            ctx.save();
            ctx.translate(f.x + f.sliceLeftX, f.y + f.sliceLeftY);
            ctx.rotate(f.sliceAngle);
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(0, 0, f.radius, Math.PI / 2, (3 * Math.PI) / 2);
            ctx.fill();
            // Draw inner bite reflection
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px serif';
            ctx.fillText(f.emoji, -10, 5);
            ctx.restore();

            // Half right
            ctx.save();
            ctx.translate(f.x + f.sliceRightX, f.y + f.sliceRightY);
            ctx.rotate(f.sliceAngle);
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(0, 0, f.radius, (3 * Math.PI) / 2, Math.PI / 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px serif';
            ctx.fillText(f.emoji, 2, 5);
            ctx.restore();
          } else {
            // Whole fruit rendering
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = f.color;
            ctx.fill();

            // Highlight ring
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius - 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.stroke();

            // Render Emoji centrally
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '22px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(f.emoji, f.x, f.y + 1);
          }

          // Clean up offscreen fruits
          if (f.y > canvas.height + 40) {
            fruits.splice(i, 1);
          }
        }

        animationId = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        clearInterval(spawnTimer);
        canvas.removeEventListener('mousemove', handlePointerMove);
        canvas.removeEventListener('touchmove', handlePointerMove);
        cancelAnimationFrame(animationId);
      };
    }, []);

    return (
      <div className="bg-[#140C24] border border-white/5 p-4 rounded-3xl shadow-lg text-center space-y-4">
        <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Slices: {score / 30}</span>
          </div>
          <div className="text-xs text-slate-300 font-extrabold flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span>Score: {score}</span>
          </div>
          <button
            onClick={() => setScore(0)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={320}
          height={380}
          className="bg-[#0A0514] border border-white/5 rounded-2xl mx-auto block cursor-crosshair shadow-inner"
        />

        <p className="text-[10px] text-slate-400">
          🍉 Swipe/drag your finger or mouse across the screen to slice incoming fruits! Extremely satisfying!
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              setShowFeedback(true);
              setActiveGame('none');
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all active:scale-95"
          >
            Finished Playing &rarr;
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Primary Games Hub Layout
  // ----------------------------------------------------
  const gamesList = [
    {
      id: 'bubble_pop',
      title: 'Bubble Pop',
      desc: 'Tactile pop relaxation',
      emoji: '🎈',
      color: 'bg-indigo-950/40 border-indigo-500/20 text-indigo-400',
    },
    {
      id: 'brick_breaker',
      title: 'Brick Breaker',
      desc: 'Active stress release barriers',
      emoji: '🧱',
      color: 'bg-rose-950/40 border-rose-500/20 text-rose-400',
    },
    {
      id: 'memory_match',
      title: 'Memory Match',
      desc: 'Mindful brain exercises',
      emoji: '🃏',
      color: 'bg-purple-950/40 border-purple-500/20 text-purple-400',
    },
    {
      id: 'fruit_slice',
      title: 'Fruit Slice',
      desc: 'Juicy slicing satisfaction',
      emoji: '🍉',
      color: 'bg-teal-950/40 border-teal-500/20 text-teal-400',
    },
  ];

  return (
    <div id="games-module-container" className="max-w-md mx-auto py-6 px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={
            activeGame !== 'none'
              ? () => setActiveGame('none')
              : onBackToDashboard
          }
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-[#140C24] shadow-md hover:bg-white/5 text-slate-300 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Relaxing Mini Games
        </span>
        <div className="w-10"></div>
      </div>

      {activeGame === 'none' && !showFeedback && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-2xl font-light text-white tracking-tight">
              Relaxing <span className="font-semibold">Mini Games</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Play and unwind your thoughts.</p>
          </div>

          {/* List of Game Options */}
          <div className="space-y-3">
            {gamesList.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-4 bg-[#140C24] border border-white/5 rounded-2xl shadow-lg hover:border-purple-500/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl text-2xl flex items-center justify-center border ${game.color}`}>
                    {game.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{game.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{game.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGame(game.id as any)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Play</span>
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render active game */}
      {activeGame === 'bubble_pop' && <BubblePopGame />}
      {activeGame === 'brick_breaker' && <BrickBreakerGame />}
      {activeGame === 'memory_match' && <MemoryMatchGame />}
      {activeGame === 'fruit_slice' && <FruitSliceGame />}

      {/* Feedback Card */}
      {showFeedback && (
        <div className="bg-[#140C24] border border-white/5 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="text-5xl animate-bounce">🎮</div>

          <div className="space-y-1">
            <h3 className="text-2xl font-light text-white tracking-tight">
              Did playing game <span className="font-semibold">improve your mood?</span>
            </h3>
            <p className="text-sm text-slate-400">Your review helps calculate mood improvement ratings.</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onFeedbackSubmit(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
            >
              Yes, I feel better 😊
            </button>
            <button
              onClick={() => onFeedbackSubmit(false)}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/10 transition-all cursor-pointer"
            >
              No, Still same 😐
            </button>
          </div>

          <div className="border-t border-white/5 pt-5">
            <button
              onClick={onBackToDashboard}
              className="w-full py-2.5 bg-white/5 border border-white/5 text-slate-300 font-bold rounded-xl text-xs hover:bg-white/10 transition-all cursor-pointer"
            >
              Change Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
