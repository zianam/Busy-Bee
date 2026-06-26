import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  "You're building something real 🌱",
  "Every moment logged is proof you showed up",
  "Growth isn't linear — and that's okay",
  "Look how far your garden has come",
  "One small win today compounds into something big",
  "You're doing better than you think",
  "This is what lifelong learning looks like",
  "Each skill you add is a seed planted",
  "Consistency > perfection, always",
  "Your story is worth documenting",
  "Progress lives in the small moments",
  "You logged a moment today — that counts",
];

export default function BeeCompanion() {
  const beeRef = useRef(null);
  const bubbleRef = useRef(null);
  const state = useRef({
    x: 100, y: 100,
    tx: 100, ty: 100,
    vx: 0, vy: 0,
    wobble: 0,
    showing: false,
  });
  const [message, setMessage] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const s = state.current;
    let animFrame;
    let stopTimeout;
    let hideTimeout;

    function pickTarget() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      s.tx = 80 + Math.random() * (w - 160);
      s.ty = 80 + Math.random() * (h - 200);
    }

    function showMessage() {
      if (s.showing) return;
      s.showing = true;
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setMessage(msg);
      setBubblePos({ x: Math.max(8, s.x - 10), y: s.y - 80 });
      setBubbleVisible(true);

      hideTimeout = setTimeout(() => {
        setBubbleVisible(false);
        setTimeout(() => { s.showing = false; }, 400);
      }, 3200);

      stopTimeout = setTimeout(() => {
        pickTarget();
        scheduleStop();
      }, 4000);
    }

    function scheduleStop() {
      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(showMessage, 4000 + Math.random() * 5000);
    }

    function animate() {
      const dx = s.tx - s.x;
      const dy = s.ty - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 4) {
        const speed = Math.min(2.5, dist * 0.04);
        s.vx += (dx / dist) * speed * 0.15;
        s.vy += (dy / dist) * speed * 0.15;
      }
      s.vx *= 0.88;
      s.vy *= 0.88;
      s.wobble += 0.08;
      s.x += s.vx;
      s.y += s.vy + Math.sin(s.wobble) * 0.4;

      if (beeRef.current) {
        beeRef.current.style.left = s.x + 'px';
        beeRef.current.style.top = s.y + 'px';
        const flip = s.vx > 0.3 ? -1 : s.vx < -0.3 ? 1 : (beeRef.current._flip ?? 1);
        beeRef.current._flip = flip;
        beeRef.current.style.transform = `scaleX(${flip})`;
      }

      if (!s.showing && dist < 20) pickTarget();

      animFrame = requestAnimationFrame(animate);
    }

    pickTarget();
    animate();
    scheduleStop();

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(stopTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <>
      <div
        ref={beeRef}
        style={{
          position: 'fixed',
          fontSize: 28,
          pointerEvents: 'none',
          zIndex: 40,
          transition: 'none',
          userSelect: 'none',
        }}
      >
        🐝
      </div>
      <div
        ref={bubbleRef}
        style={{
          position: 'fixed',
          left: bubblePos.x,
          top: bubblePos.y,
          background: '#F5F3EC',
          border: '0.5px solid #C5D6CC',
          borderRadius: 12,
          padding: '8px 12px',
          fontSize: 12,
          color: '#2D4A3A',
          maxWidth: 220,
          lineHeight: 1.5,
          zIndex: 41,
          pointerEvents: 'none',
          opacity: bubbleVisible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        {message}
      </div>
    </>
  );
}