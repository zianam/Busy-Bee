import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles } from 'lucide-react';

const SIGNIFICANCE_LABELS = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Very Hard' };
const SIGNIFICANCE_COLORS = {
  1: 'bg-emerald-100 text-emerald-700',
  2: 'bg-teal-100 text-teal-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
};

const STAGE_GROWTH = {
  Seed: '/growth-seed.png',
  Sprout: '/growth-sprout.png',
  Bud: '/growth-bud.png',
  Bloom: '/growth-bloom.png',
};

function MomentItem({ moment }) {
  return (
    <li className="flex items-start gap-3 text-sm py-2 border-b border-[#e8e4d9] last:border-0">
      <img src={STAGE_GROWTH[moment.stage] ?? '/growth-seed.png'} alt="" className="w-8 h-8 object-contain shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#2D4A3A] leading-snug">{moment.description}</p>
        <p className="text-xs text-[#6b8275] mt-0.5">{moment.skill || moment.category}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${SIGNIFICANCE_COLORS[moment.significance]}`}>
        {SIGNIFICANCE_LABELS[moment.significance]}
      </span>
    </li>
  );
}

export default function TodaysMoments({ onAddMoment, refreshTrigger }) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      const today = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false });

      if (!error) setMoments(data);
      setLoading(false);
    };

    fetchToday();
  }, [refreshTrigger]);

  const accomplishments = moments.filter(m => m.type === 'accomplishment');
  const challenges = moments.filter(m => m.type === 'challenge');
  const other = moments.filter(m => !m.type || (m.type !== 'accomplishment' && m.type !== 'challenge'));

  return (
    <div className="lg:col-span-2 bg-[#F5F3EC] rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] flex items-center gap-1.5"><Sparkles size={16} color="#2D4A3A" /> TODAY'S MOMENTS</h2>
      <p className="text-sm text-[#8aa394] mb-4">moments you've logged today</p>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-[#8aa394] text-sm">Loading...</div>
      ) : moments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-[#8aa394] text-sm mb-3">No moments logged yet today.</p>
          <button onClick={onAddMoment} className="text-sm text-[#4F6F5E] hover:underline font-semibold">
            + Add your first moment
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 max-h-96 overflow-y-auto pr-1">
          {accomplishments.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#6b8275] uppercase tracking-wider mb-2">🏆 Accomplishments</h3>
              <ul>{accomplishments.map(m => <MomentItem key={m.id} moment={m} />)}</ul>
            </div>
          )}
          {challenges.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#6b8275] uppercase tracking-wider mb-2">⚡ Challenges</h3>
              <ul>{challenges.map(m => <MomentItem key={m.id} moment={m} />)}</ul>
            </div>
          )}
          {other.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#6b8275] uppercase tracking-wider mb-2">✨ Moments</h3>
              <ul>{other.map(m => <MomentItem key={m.id} moment={m} />)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}