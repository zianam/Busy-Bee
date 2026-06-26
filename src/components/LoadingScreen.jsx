import { useState, useEffect } from 'react';

const QUOTES = [
  'Every micro-win helps a skill grow.',
  'Small steps, blooming gardens.',
  'Progress is planted daily.',
  'Water what you want to grow.',
  'Tiny wins today, full bloom tomorrow.',
  'Every expert was once a seed.',
  'Growth is quiet, then all at once.',
  'Tend your garden, one moment at a time.',
  'Busy bees build sweet things.',
  'Bloom at your own pace.',
];

export default function LoadingScreen() {
  // Pick a quote once per mount
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  // Flight phases: 'enter' (loop in from left) -> 'hover' (wobble in place) -> 'exit' (buzz off right)
  const [phase, setPhase] = useState('enter');
  // Triggers the overlay's opacity fade-out
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const toHover = setTimeout(() => setPhase('hover'), 3200);
    const toExit = setTimeout(() => {
      setPhase('exit');
      setLeaving(true);
    }, 5000);
    return () => {
      clearTimeout(toHover);
      clearTimeout(toExit);
    };
  }, []);

  // Flight transform per phase:
  // - enter: a looping keyframe path traces the curve + loop-de-loop
  // - hover: rest at center (gentle wobble handled by the inner wrapper)
  // - exit: buzz straight off to the right
  const flightStyle =
    phase === 'enter'
      ? { animation: 'bee-fly-in 3.2s cubic-bezier(0.4, 0.1, 0.3, 1) forwards' }
      : phase === 'exit'
      ? {
          transform: 'translateX(75vw)',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 1, 1)',
        }
      : { transform: 'translate(0, 0)' };

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#DCE8E0] transition-opacity duration-700 ease-out ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes bee-fly-in {
          0%   { transform: translate(-65vw, 0)    rotate(-6deg); }
          16%  { transform: translate(-44vw, -7vh) rotate(10deg); }
          28%  { transform: translate(-28vw, 5vh)  rotate(-6deg); }
          /* one loop-de-loop (bottom -> right -> top -> left -> bottom) */
          38%  { transform: translate(-18vw, 7vh)  rotate(0deg); }
          45%  { transform: translate(-10vw, 1vh)  rotate(14deg); }
          52%  { transform: translate(-17vw, -7vh) rotate(0deg); }
          59%  { transform: translate(-24vw, 1vh)  rotate(-14deg); }
          66%  { transform: translate(-17vw, 7vh)  rotate(0deg); }
          /* curve in and settle at center */
          80%  { transform: translate(-7vw, -3vh)  rotate(8deg); }
          92%  { transform: translate(-1vw, 2vh)   rotate(-3deg); }
          100% { transform: translate(0, 0)        rotate(0deg); }
        }
        @keyframes bee-wobble {
          0%, 100% { transform: translateY(-7px); }
          50%      { transform: translateY(7px); }
        }
        @keyframes ls-quote-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Bee flight lane (tall + un-clipped so the loop shows fully) */}
      <div className="relative w-full h-64 mb-6">
        <div className="absolute top-1/2 left-1/2 -ml-8 -mt-8" style={flightStyle}>
          {/* Inner wrapper carries the gentle up/down wobble once settled */}
          <div
            className="flex items-center"
            style={{
              animation: phase === 'hover' ? 'bee-wobble 1.1s ease-in-out infinite' : 'none',
            }}
          >
            {/* Dotted trail */}
            <span className="flex items-center gap-1.5 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a9a87] opacity-20"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a9a87] opacity-35"></span>
              <span className="w-2 h-2 rounded-full bg-[#7a9a87] opacity-50"></span>
              <span className="w-2 h-2 rounded-full bg-[#7a9a87] opacity-70"></span>
            </span>
            <img src="/bee.png" alt="" className="w-16 h-16 object-contain" />
          </div>
        </div>
      </div>

      {/* Motivational quote */}
      <p
        className="px-8 text-center text-lg sm:text-xl font-semibold text-[#2D4A3A] max-w-md leading-relaxed"
        style={{ animation: 'ls-quote-in 1s ease 0.4s both' }}
      >
        {quote}
      </p>
    </div>
  );
}
