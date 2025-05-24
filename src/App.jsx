import React, { useState, useEffect } from 'react';

const POINTS_PER_HEART = 10;
const TOTAL_SCORE = 150;
const COLORS = ["text-pink-400", "text-red-400", "text-yellow-400", "text-purple-400", "text-blue-400"];
const EMOJIS = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🩷"];

const App = () => {
  const [started, setStarted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [phase, setPhase] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [score, setScore] = useState(0);
  const [finalMode, setFinalMode] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => setPhase(1), 3000);
    setTimeout(() => setPhase(2), 7000);
  };

  useEffect(() => {
    if ((phase === 2 || finalMode) && score < TOTAL_SCORE) {
      const interval = setInterval(() => {
        const newHeart = {
          id: Date.now(),
          x: Math.random() * 80,
          delay: Math.random() * 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
        };
        setHearts(prev => [...prev, newHeart]);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [phase, finalMode, score]);

  useEffect(() => {
    if (score >= TOTAL_SCORE && !finalMode) {
      setTimeout(() => {
        setFinalMode(true);
      }, 1000);
    }
  }, [score, finalMode]);

  const popHeart = id => {
    setHearts(prev => prev.filter(h => h.id !== id));
    setScore(s => s + POINTS_PER_HEART);
  };

  const restartGame = () => {
    setPhase(2);
    setHearts([]);
    setScore(0);
    setFinalMode(false);
  };

  if (finalMode) {
    return (
      <div className="relative bg-gradient-to-b from-pink-100 via-yellow-100 to-white text-red-500 font-press min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
        {hearts.map(heart => (
          <div
            key={heart.id}
            className={`absolute text-3xl animate-rise ${heart.color}`}
            style={{
              left: `${heart.x}%`,
              bottom: "-50px",
              animationDelay: `${heart.delay}s`
            }}
          >
            {heart.emoji}
          </div>
        ))}
        <div className="relative z-10 mt-20 max-w-md h-60 overflow-hidden">
          <div className="animate-scroll text-center space-y-4 text-base sm:text-lg leading-relaxed">
           <p>Tebrikler! Tüm kalp balonlarını patlattın 🎉</p>
            <p>Onur... 💛</p>
            <p>Hepsini patlattın. Ama hâlâ burada bir kalp bıraktın.</p>
            <p>Şampuanlarımızın çalınmadığı bir dünya dileğiyle.🎈</p>
          </div>
        </div>
        <button
          onClick={restartGame}
          className="mt-10 z-10 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
        >
          Tekrar oyna 🔁
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-100 via-yellow-100 to-white text-red-500 font-press min-h-screen flex flex-col justify-between items-center text-center px-4 relative overflow-hidden pb-20 pt-6">
      {!started && !rejected && (
        <>
         <div className="text-center px-4 max-w-xs">
            <h1 className="text-2xl md:text-3xl mb-4 typewriter leading-relaxed">
              🎈 Onur’un<br />Balon<br />Macerası
            </h1>
            <p className="text-base mb-8 fade-in leading-snug">
              Başlamak<br />ister misin?
            </p>
            <div className="flex flex-col gap-4 items-center">
              <button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded w-40"
              >
                Evet
              </button>
              <button
                onClick={() => setRejected(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded w-40"
              >
                Hayır
              </button>
            </div>
          </div>
        </>
      )}

      {started && phase === 1 && (
        <p className="text-xl mt-6 fade-in">
          Bu küçük oyunu sadece sen gülümsersin diye yaptım 💛
        </p>
      )}

      {started && phase === 2 && (
        <>
          <div className="fixed top-4 sm:top-2 left-2 text-sm sm:text-base bg-white bg-opacity-60 px-3 py-1 rounded shadow">
            Skor: {score} / {TOTAL_SCORE}
          </div>

          {hearts.map(heart => (
            <div
              key={heart.id}
              className={`absolute text-3xl cursor-pointer animate-rise active:scale-95 transition-transform ${heart.color}`}
              style={{
                left: `${heart.x}%`,
                bottom: "-50px",
                animationDelay: `${heart.delay}s`
              }}
              onClick={() => popHeart(heart.id)}
              onTouchStart={() => popHeart(heart.id)}
            >
              {heart.emoji}
            </div>
          ))}
        </>
      )}

      {rejected && (
        <>
          <p className="text-4xl mb-4">:(</p>
          <p className="text-xl">Peki... sonra tekrar dene :)</p>
        </>
      )}
    </div>
  );
};

export default App;
