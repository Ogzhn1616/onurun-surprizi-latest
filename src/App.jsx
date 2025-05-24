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
  const [visibleLines, setVisibleLines] = useState([]);
  const [finalShown, setFinalShown] = useState(false);

  const finalLines = [
    "Tebrikler! Tüm kalp balonlarını patlattın 🎉",
    "Onur... 💛",
    "Bu küçük oyunu sadece senin için yaptım.",
    "Hepsini patlattın. Ama hâlâ burada bir sürü kalp bıraktın.",
    "🎈"
  ];

  const handleStart = async () => {
    const bgAudio = new Audio("https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Poupis_Adventure/Komiku_-_03_-_The_path_of_the_heroes.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 0.6;
    try {
      await bgAudio.play();
    } catch (e) {
      console.log("Müzik çalma hatası:", e);
    }

    setStarted(true);
    setTimeout(() => setPhase(1), 3000);
    setTimeout(() => setPhase(2), 7000);
  };

  useEffect(() => {
    if (phase === 2 && score < TOTAL_SCORE) {
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
  }, [phase, score]);

  useEffect(() => {
    if (score >= TOTAL_SCORE && !finalShown) {
      finalLines.forEach((line, i) => {
        setTimeout(() => {
          setVisibleLines(prev => [...prev, line]);
        }, i * 2000);
      });
      setFinalShown(true);
    }
  }, [score, finalShown]);

  const popHeart = id => {
    setHearts(prev => prev.filter(h => h.id !== id));
    setScore(s => s + POINTS_PER_HEART);
  };

  const restartGame = () => {
    setPhase(2);
    setHearts([]);
    setScore(0);
    setVisibleLines([]);
    setFinalShown(false);
  };

  return (
    <div className="bg-gradient-to-b from-pink-100 via-yellow-100 to-white text-red-500 font-press min-h-screen flex flex-col justify-between items-center text-center px-4 relative overflow-hidden pb-20 pt-6">
      {!started && !rejected && (
        <>
          <h1 className="text-2xl md:text-3xl mb-6 typewriter">Hazır mısın Onur?</h1>
          <div className="flex gap-4">
            <button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Evet
            </button>
            <button
              onClick={() => setRejected(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Hayır
            </button>
          </div>
        </>
      )}

      {started && phase === 1 && (
        <p className="text-xl mt-6 fade-in">
          Seni çok özledim.<br />
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

          {finalShown && (
            <div className="absolute bottom-6 text-center fade-in px-4">
              {visibleLines.map((line, index) => (
                <p key={index} className="typewriter text-base sm:text-lg leading-relaxed mb-2">
                  {line}
                </p>
              ))}
              {visibleLines.length === finalLines.length && (
                <button
                  className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
                  onClick={restartGame}
                >
                  Tekrar oyna 🔁
                </button>
              )}
            </div>
          )}
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
