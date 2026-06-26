import { useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '../supabaseClient';

const stageColors = {
  Seed: '#B4B2A9',
  Sprout: '#97C459',
  Bud: '#1D9E75',
  Bloom: '#D4537E',
};

const sigColors = { 1: '#B4B2A9', 2: '#EF9F27', 3: '#EF9F27', 4: '#D4537E', 5: '#D4537E' };

function GrowthChart({ moments }) {
  if (!moments || moments.length === 0) return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No moments logged yet</div>
  );

  if (moments.length === 1) return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-rose-100">
      <h3 className="text-sm font-bold text-gray-700 mb-3">Growth over time</h3>
      <div className="flex items-center gap-4 py-4">
        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: sigColors[moments[0].significance ?? 1] }}></div>
        <div>
          <div className="text-sm font-medium text-gray-800">{moments[0].description}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {new Date(moments[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · {moments[0].stage}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400 italic">Log more moments to see your growth curve</div>
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

  let cumulative = 0;
  const pts = moments.map(m => {
    cumulative += (m.significance ?? 1);
    return { x: xPos(m.created_at), y: cumulative, sig: m.significance ?? 1, stage: m.stage };
  });
  const maxY = pts[pts.length - 1].y || 1;

  function yPos(val) { return H - 15 - (val / maxY) * (H - 30); }

  const areaPath = `M${pts[0].x},${H} ` + pts.map(p => `L${p.x},${yPos(p.y)}`).join(' ') + ` L${pts[pts.length - 1].x},${H} Z`;
  const linePath = `M${pts[0].x},${yPos(pts[0].y)} ` + pts.slice(1).map(p => `L${p.x},${yPos(p.y)}`).join(' ');

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-rose-100">
      <h3 className="text-sm font-bold text-gray-700 mb-3">Growth over time — significance and stage</h3>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 140 }}>
        <path d={areaPath} fill="rgba(29,158,117,0.08)" />
        <path d={linePath} fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={yPos(p.y)} r={p.sig >= 4 ? 8 : p.sig === 3 ? 6 : 5} fill="white" />
            <circle cx={p.x} cy={yPos(p.y)} r={p.sig >= 4 ? 6 : p.sig === 3 ? 4.5 : 3.5} fill={sigColors[p.sig]} />
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>{new Date(moments[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(moments[moments.length - 1].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="flex gap-4 mt-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-gray-500"><span style={{ width: 10, height: 3, background: '#1D9E75', display: 'inline-block', borderRadius: 2 }}></span>Cumulative growth</span>
        <span className="flex items-center gap-1 text-xs text-gray-500"><span style={{ width: 8, height: 8, background: '#D4537E', borderRadius: '50%', display: 'inline-block' }}></span>High</span>
        <span className="flex items-center gap-1 text-xs text-gray-500"><span style={{ width: 8, height: 8, background: '#EF9F27', borderRadius: '50%', display: 'inline-block' }}></span>Medium</span>
        <span className="flex items-center gap-1 text-xs text-gray-500"><span style={{ width: 8, height: 8, background: '#B4B2A9', borderRadius: '50%', display: 'inline-block' }}></span>Low</span>
      </div>
    </div>
  );
}

function MomentTimeline({ moments }) {
  if (!moments || moments.length === 0) return (
    <div className="text-sm text-gray-400">No moments logged yet.</div>
  );

  const reversed = [...moments].reverse();

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-4">Every moment</h3>
      {reversed.map((m, i) => {
        const isLast = i === reversed.length - 1;
        const dotColor = stageColors[m.stage] ?? '#B4B2A9';
        const sigLabel = m.significance >= 4 ? 'High' : m.significance === 3 ? 'Medium' : 'Low';
        const sigBg = m.significance >= 4 ? 'bg-pink-100 text-pink-700' : m.significance === 3 ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500';
        const date = new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div key={m.id} className="flex gap-0 items-start">
            <div className="w-14 shrink-0 text-right pr-3 pt-0.5">
              <span className="text-xs text-gray-400 leading-tight">{date}</span>
            </div>
            <div className="flex flex-col items-center w-5 shrink-0">
              <div className="w-3 h-3 rounded-full mt-0.5 border-2 border-white shrink-0" style={{ background: dotColor }}></div>
              {!isLast && <div className="w-px flex-1 bg-gray-200 min-h-6"></div>}
            </div>
            <div className="flex-1 pl-2 pb-4">
              <div className="text-sm font-medium text-gray-800 leading-snug">{m.description}</div>
              {m.reflection && <div className="text-xs text-gray-500 italic mt-1 leading-relaxed">{m.reflection}</div>}
              <div className="flex gap-1 mt-1.5 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sigBg}`}>{sigLabel} significance</span>
                {m.stage && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{m.stage}</span>}
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
      if (!isSupabaseConfigured) {
        setMoments([]);
        setLoading(false);
        return;
      }

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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">

        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{skillName}</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded">×</button>
        </div>

        <div className="flex items-center justify-around p-6 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Started</div>
            <div className="text-lg font-bold text-gray-800">{startDate ?? 'Not yet'}</div>
            {daysAgo != null && <div className="text-xs text-gray-400 mt-0.5">{daysAgo} days ago</div>}
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Moments</div>
            <div className="text-lg font-bold text-gray-800">{moments.length}</div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Stage</div>
            <div className="text-lg font-bold text-gray-800">{currentStage}</div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading moments...</div>
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
