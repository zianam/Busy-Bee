import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const stageColors = {
  Seed: '#B4B2A9',
  Sprout: '#97C459',
  Bud: '#1D9E75',
  Bloom: '#D4537E',
};

const stageOrder = { Seed: 1, Sprout: 2, Bud: 3, Bloom: 4 };

function GrowthChart({ moments }) {
  if (!moments || moments.length === 0) return (
    <div className="flex items-center justify-center h-32 text-[#8aa394] text-sm">No moments logged yet</div>
  );

  if (moments.length === 1) return (
    <div className="bg-[#FBFAF5] rounded-xl p-4 mb-6 border border-[#C5D6CC]">
      <h3 className="text-sm font-bold text-[#2D4A3A] mb-3">Growth over time</h3>
      <div className="flex items-center gap-4 py-4">
        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: stageColors[moments[0].stage] ?? '#B4B2A9' }}></div>
        <div>
          <div className="text-sm font-medium text-[#2D4A3A]">{moments[0].description}</div>
          <div className="text-xs text-[#8aa394] mt-0.5">
            {new Date(moments[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · {moments[0].stage}
          </div>
        </div>
      </div>
      <div className="text-xs text-[#8aa394] italic">Log more moments to see your growth curve</div>
    </div>
  );

  const W = 560, H = 140;
  const startDate = new Date(moments[0].created_at);
  const endDate = new Date(moments[moments.length - 1].created_at);
  const totalDays = Math.max(1, Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)));

  function xPos(dateStr) {
    const d = new Date(dateStr);
    const diff = Math.floor((d - startDate) / (1000 * 60 * 60 * 24));
    return 20 + (diff / totalDays) * (W - 40);
  }

  const pts = moments.map(m => ({
    x: xPos(m.created_at),
    y: stageOrder[m.stage] ?? 1,
    stage: m.stage,
    color: stageColors[m.stage] ?? '#B4B2A9',
  }));

  const maxY = 4;
  function yPos(val) { return H - 15 - ((val - 1) / (maxY - 1)) * (H - 30); }

  const areaPath = `M${pts[0].x},${H} ` + pts.map(p => `L${p.x},${yPos(p.y)}`).join(' ') + ` L${pts[pts.length - 1].x},${H} Z`;
  const linePath = `M${pts[0].x},${yPos(pts[0].y)} ` + pts.slice(1).map(p => `L${p.x},${yPos(p.y)}`).join(' ');

  return (
    <div className="bg-[#FBFAF5] rounded-xl p-4 mb-6 border border-[#C5D6CC]">
      <h3 className="text-sm font-bold text-[#2D4A3A] mb-3">Growth over time</h3>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 140 }}>
        <path d={areaPath} fill="rgba(29,158,117,0.08)" />
        <path d={linePath} fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {['Seed','Sprout','Bud','Bloom'].map((s, i) => (
          <text key={s} x={W - 8} y={yPos(i + 1) + 4} fontSize="9" fill="#8aa394" textAnchor="end">{s}</text>
        ))}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={yPos(p.y)} r={7} fill="white" />
            <circle cx={p.x} cy={yPos(p.y)} r={5} fill={p.color} />
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-[#8aa394] mt-1 px-1">
        <span>{new Date(moments[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(moments[moments.length - 1].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="flex gap-4 mt-2 flex-wrap">
        {Object.entries(stageColors).map(([stage, color]) => (
          <span key={stage} className="flex items-center gap-1 text-xs text-[#6b8275]">
            <span style={{ width: 8, height: 8, background: color, borderRadius: '50%', display: 'inline-block' }}></span>
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}

function MomentTimeline({ moments }) {
  if (!moments || moments.length === 0) return (
    <div className="text-sm text-[#8aa394]">No moments logged yet.</div>
  );

  const reversed = [...moments].reverse();

  return (
    <div>
      <h3 className="text-sm font-bold text-[#2D4A3A] mb-4">Every moment</h3>
      {reversed.map((m, i) => {
        const isLast = i === reversed.length - 1;
        const dotColor = stageColors[m.stage] ?? '#B4B2A9';
        const date = new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const typeBg = m.type === 'accomplishment' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';
        const typeLabel = m.type === 'accomplishment' ? '🏆 Accomplishment' : '⚡ Challenge';

        return (
          <div key={m.id} className="flex gap-0 items-start">
            <div className="w-14 shrink-0 text-right pr-3 pt-0.5">
              <span className="text-xs text-[#8aa394] leading-tight">{date}</span>
            </div>
            <div className="flex flex-col items-center w-5 shrink-0">
              <div className="w-3 h-3 rounded-full mt-0.5 border-2 border-[#F5F3EC] shrink-0" style={{ background: dotColor }}></div>
              {!isLast && <div className="w-px flex-1 bg-[#cdd8cf] min-h-6"></div>}
            </div>
            <div className="flex-1 pl-2 pb-4">
              <div className="text-sm font-medium text-[#2D4A3A] leading-snug">{m.description}</div>
              {m.reflection && <div className="text-xs text-[#6b8275] italic mt-1 leading-relaxed">{m.reflection}</div>}
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {m.type && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeBg}`}>{typeLabel}</span>}
                {m.stage && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#4F6F5E] text-white">{m.stage}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SkillHistory({ skill: skillName, onClose }) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoments = async () => {
      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .eq('skill', skillName)
        .order('created_at', { ascending: true });

      if (!error) setMoments(data);
      setLoading(false);
    };

    fetchMoments();
  }, [skillName]);

  const currentStage = moments.length > 0 ? moments[moments.length - 1].stage : 'Seed';
  const startDate = moments.length > 0
    ? new Date(moments[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const daysAgo = moments.length > 0
    ? Math.floor((new Date() - new Date(moments[0].created_at)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#F5F3EC] rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">

        <div className="bg-gradient-to-r from-[#4F6F5E] to-[#5f816e] text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{skillName}</h2>
          <button onClick={onClose} className="text-2xl font-bold text-white hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded-lg transition">×</button>
        </div>

        <div className="flex items-center justify-around p-6 border-b border-[#dfe7e0] bg-[#EFEADE]">
          <div className="text-center">
            <div className="text-xs text-[#8aa394] uppercase tracking-wider mb-1">Started</div>
            <div className="text-lg font-bold text-[#2D4A3A]">{startDate ?? 'Not yet'}</div>
            {daysAgo != null && <div className="text-xs text-[#8aa394] mt-0.5">{daysAgo} days ago</div>}
          </div>
          <div className="w-px h-10 bg-[#cdd8cf]"></div>
          <div className="text-center">
            <div className="text-xs text-[#8aa394] uppercase tracking-wider mb-1">Moments</div>
            <div className="text-lg font-bold text-[#2D4A3A]">{moments.length}</div>
          </div>
          <div className="w-px h-10 bg-[#cdd8cf]"></div>
          <div className="text-center">
            <div className="text-xs text-[#8aa394] uppercase tracking-wider mb-1">Stage</div>
            <div className="text-lg font-bold text-[#2D4A3A]">{currentStage}</div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-[#8aa394] text-sm">Loading moments...</div>
          ) : (
            <>
              <GrowthChart moments={moments} />
              <MomentTimeline moments={moments} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}