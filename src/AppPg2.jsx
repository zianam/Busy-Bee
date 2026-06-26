import { useState, useEffect, useRef } from "react";

const SKILL_DATA = {
  title: "Debugging",
  emoji: "🌸",
  level: "Bloom",
  progress: 78,
  category: "Technical",
  description: "Isolating and fixing issues in code — reading errors, forming hypotheses, and verifying fixes methodically.",
  progressHistory: [10, 18, 22, 30, 38, 45, 50, 55, 62, 70, 74, 78],
  historyLabels: ["Jun 1", "Jun 3", "Jun 5", "Jun 7", "Jun 9", "Jun 11", "Jun 13", "Jun 15", "Jun 17", "Jun 19", "Jun 22", "Jun 25"],
  moments: [
    { type: "Micro-Win", emoji: "🌿", label: "Fixed the authentication bug", date: "June 25, 2026", skills: ["Debugging", "API Integration"] },
    { type: "Breakthrough", emoji: "💡", label: "Understood the full auth flow", date: "June 23, 2026", skills: ["APIs", "React"] },
    { type: "Hardship", emoji: "🪨", label: "Recovered from a merge conflict", date: "June 20, 2026", skills: ["Git", "Teamwork"] },
  ],
  evidence: [
    { id: 1, type: "github", label: "GitHub Commit", icon: "🔗", color: "bg-slate-800 text-white", meta: "auth-fix · Jun 25" },
    { id: 2, type: "screenshot", label: "Working Login Screenshot", icon: "🖼️", color: "bg-sky-50 text-sky-800", meta: "login-success.png" },
    { id: 3, type: "deck", label: "Final Presentation Deck", icon: "📊", color: "bg-rose-50 text-rose-800", meta: "Project Atlas · Jun 24" },
  ],
};

// --- Bee SVG (tiny, inline) ---
function BeeSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="14" cy="17" rx="7" ry="5" fill="#F59E0B" />
      <ellipse cx="14" cy="17" rx="7" ry="5" fill="url(#beeStripe)" />
      {/* Head */}
      <circle cx="14" cy="10" r="4" fill="#1C1917" />
      <circle cx="12.5" cy="9" r="1" fill="white" />
      <circle cx="15.5" cy="9" r="1" fill="white" />
      {/* Wings */}
      <ellipse cx="8" cy="13" rx="4.5" ry="2.5" fill="white" fillOpacity="0.75" transform="rotate(-20 8 13)" />
      <ellipse cx="20" cy="13" rx="4.5" ry="2.5" fill="white" fillOpacity="0.75" transform="rotate(20 20 13)" />
      {/* Stripes */}
      <rect x="7.5" y="14.5" width="13" height="2" rx="1" fill="#1C1917" opacity="0.5" />
      <rect x="7.5" y="18" width="13" height="2" rx="1" fill="#1C1917" opacity="0.35" />
      <defs>
        <linearGradient id="beeStripe" x1="7" y1="17" x2="21" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- Animated Bee Progress Chart ---
function BeeChart({ history, labels, progress }) {
  const svgRef = useRef(null);
  const [beePos, setBeePos] = useState({ x: 0, y: 0 });
  const [animProgress, setAnimProgress] = useState(0);

  const W = 520, H = 140;
  const PAD = { left: 32, right: 24, top: 20, bottom: 28 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const max = 100;

  const pts = history.map((v, i) => ({
    x: PAD.left + (i / (history.length - 1)) * chartW,
    y: PAD.top + chartH - (v / max) * chartH,
    v,
  }));

  // Build smooth path using cardinal spline
  function cardinalSpline(points, tension = 0.4) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const smoothPath = cardinalSpline(pts);
  const fillPath = smoothPath + ` L ${pts[pts.length - 1].x} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`;

  // Animate bee along path on mount
  useEffect(() => {
    let start = null;
    const duration = 1800;
    function animate(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setAnimProgress(eased);
      if (t < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, []);

  // Interpolate bee position along pts
  useEffect(() => {
    if (pts.length < 2) return;
    const totalSegments = pts.length - 1;
    const pos = animProgress * totalSegments;
    const seg = Math.min(Math.floor(pos), totalSegments - 1);
    const segT = pos - seg;
    const p1 = pts[seg], p2 = pts[seg + 1];
    setBeePos({
      x: p1.x + (p2.x - p1.x) * segT,
      y: p1.y + (p2.y - p1.y) * segT,
    });
  }, [animProgress, history]);

  // Y-axis gridlines
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        {/* Grid lines */}
        {gridLines.map((g) => {
          const y = PAD.top + chartH - (g / 100) * chartH;
          return (
            <g key={g}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="8" fill="#9ca3af">{g}</text>
            </g>
          );
        })}

        {/* Fill under curve */}
        <path d={fillPath} fill="#6ee7b7" opacity="0.13" />

        {/* Dotted progress path */}
        <path
          d={smoothPath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />

        {/* Data point dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke="#10b981" strokeWidth="1.5" />
        ))}

        {/* X-axis labels (every other) */}
        {pts.map((p, i) =>
          i % 2 === 0 ? (
            <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="7.5" fill="#9ca3af">
              {labels[i]}
            </text>
          ) : null
        )}

        {/* Animated bee */}
        <g transform={`translate(${beePos.x - 14}, ${beePos.y - 22})`}>
          <BeeSVG />
        </g>

        {/* Bee trail dots behind it */}
        {pts.slice(0, Math.max(1, Math.round(animProgress * (pts.length - 1)))).map((p, i) => (
          <circle key={`trail-${i}`} cx={p.x} cy={p.y} r="1.5" fill="#f59e0b" opacity="0.4" />
        ))}
      </svg>
    </div>
  );
}

// --- Evidence Card ---
function EvidenceCard({ item, onRemove }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${item.color} shadow-sm`}>
      <span className="text-2xl">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{item.label}</div>
        <div className="text-xs opacity-60">{item.meta}</div>
      </div>
      <button onClick={() => onRemove(item.id)} className="opacity-40 hover:opacity-80 text-xs ml-1">✕</button>
    </div>
  );
}

// --- Upload Drop Zone ---
function UploadZone({ onAdd }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((f) => onAdd({ id: Date.now() + Math.random(), type: "upload", label: f.name, icon: "📎", color: "bg-violet-50 text-violet-800", meta: "Just uploaded" }));
  }

  return (
    <div
      className={`mt-3 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${dragging ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" className="hidden" multiple onChange={(e) => {
        Array.from(e.target.files).forEach((f) =>
          onAdd({ id: Date.now() + Math.random(), type: "upload", label: f.name, icon: "📎", color: "bg-violet-50 text-violet-800", meta: "Just uploaded" })
        );
      }} />
      <div className="text-2xl mb-1">📎</div>
      <div className="text-xs text-gray-500 font-medium">Drop a screenshot, commit link, or file</div>
      <div className="text-xs text-gray-400 mt-0.5">or click to browse</div>
    </div>
  );
}

// --- Moment Badge ---
const momentStyles = {
  "Micro-Win": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Breakthrough": "bg-amber-50 text-amber-700 border-amber-100",
  "Hardship": "bg-slate-100 text-slate-600 border-slate-200",
};

// --- Main SkillDetail ---
export default function SkillDetail({ skill: skillProp, onBack }) {
  const skill = skillProp || SKILL_DATA;
  const [evidence, setEvidence] = useState(skill.evidence || []);
  const [newMoment, setNewMoment] = useState("");
  const [moments, setMoments] = useState(skill.moments || []);
  const [showAdd, setShowAdd] = useState(false);

  function addEvidence(item) {
    setEvidence((prev) => [item, ...prev]);
  }
  function removeEvidence(id) {
    setEvidence((prev) => prev.filter((e) => e.id !== id));
  }
  function addMoment() {
    if (!newMoment.trim()) return;
    setMoments((prev) => [
      { type: "Micro-Win", emoji: "🌿", label: newMoment.trim(), date: "Today", skills: [] },
      ...prev,
    ]);
    setNewMoment("");
    setShowAdd(false);
  }

  const levelColors = {
    Seed: "bg-gray-100 text-gray-600",
    Sprout: "bg-lime-100 text-lime-700",
    Bud: "bg-amber-100 text-amber-700",
    Bloom: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav bar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
          <span>←</span> <span>Back to Garden</span>
        </button>
        <div className="text-slate-600 select-none">·</div>
        <span className="text-sm text-slate-400">{skill.category} Skills</span>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-slate-400">🐝 Bloom</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">🌸 Spring 2026</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Hero header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6 mb-5">
          <div className="w-24 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center text-5xl shadow-inner flex-shrink-0">
            {skill.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{skill.title}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[skill.level] || "bg-gray-100"}`}>
                {skill.level}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{skill.description}</p>
            <div className="mt-3 flex items-center gap-3 max-w-xs">
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-emerald-600 tabular-nums">{skill.progress}%</span>
            </div>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: Chart + Key Moments */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Bee Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 tracking-wide">PROGRESS JOURNEY</h3>
                <span className="text-xs text-gray-400">Last 25 days</span>
              </div>
              <BeeChart
                history={skill.progressHistory}
                labels={skill.historyLabels}
                progress={skill.progress}
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>🐝</span>
                <span>The bee traces your path — each dot is a check-in</span>
              </div>
            </div>

            {/* Key Moments */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 tracking-wide">KEY MOMENTS</h3>
                <button
                  onClick={() => setShowAdd((v) => !v)}
                  className="text-xs text-teal-600 font-semibold hover:text-teal-700 px-2 py-1 rounded-lg hover:bg-teal-50 transition"
                >
                  + Log moment
                </button>
              </div>

              {showAdd && (
                <div className="mb-3 flex gap-2">
                  <input
                    className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:ring-2 ring-teal-300"
                    placeholder="What happened? e.g. Debugged the API timeout"
                    value={newMoment}
                    onChange={(e) => setNewMoment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addMoment()}
                    autoFocus
                  />
                  <button onClick={addMoment} className="bg-teal-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-teal-600 transition">Add</button>
                </div>
              )}

              <ul className="flex flex-col gap-2.5">
                {moments.map((m, i) => (
                  <li key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${momentStyles[m.type] || "bg-gray-50"}`}>
                    <span className="text-xl mt-0.5">{m.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold opacity-70 uppercase tracking-wider">{m.type}</span>
                        {m.skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/60 font-medium">{s}</span>
                        ))}
                      </div>
                      <div className="text-sm font-semibold mt-0.5">{m.label}</div>
                      <div className="text-xs opacity-60 mt-0.5">{m.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Evidence + Notes */}
          <div className="flex flex-col gap-5">

            {/* Evidence */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 tracking-wide mb-3">EVIDENCE</h3>
              <div className="flex flex-col gap-2.5">
                {evidence.map((item) => (
                  <EvidenceCard key={item.id} item={item} onRemove={removeEvidence} />
                ))}
              </div>
              <UploadZone onAdd={addEvidence} />
            </div>

            {/* AI Story / Notes */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <h3 className="text-sm font-bold text-amber-800 tracking-wide">AI STORY</h3>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                Debugging became a standout strength this season. The most important progress came from learning to isolate technical problems, communicate blockers earlier, and turn setbacks — like the merge conflict — into better team processes.
              </p>
              <button className="mt-3 w-full text-xs text-amber-700 font-semibold border border-amber-200 bg-white/60 rounded-lg py-2 hover:bg-white transition">
                ✏️ Edit Story
              </button>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 tracking-wide mb-3">QUICK STATS</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Moments", value: moments.length, emoji: "💡" },
                  { label: "Evidence", value: evidence.length, emoji: "📎" },
                  { label: "Days active", value: "12", emoji: "📅" },
                  { label: "Growth", value: "+43%", emoji: "📈" },
                ].map((s) => (
                  <div key={s.label} className="bg-stone-50 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-lg font-bold text-gray-800">{s.value}</span>
                    <span className="text-xs text-gray-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
