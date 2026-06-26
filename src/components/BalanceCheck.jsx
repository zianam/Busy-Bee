import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CATEGORY_KEYS = {
  'Technical': 'TECHNICAL SKILLS',
  'Communication': 'COMMUNICATION',
  'Creativity': 'CREATIVITY',
  'Life & Wellbeing': 'LIFE & WELLBEING',
};

export default function BalanceCheck({ refreshTrigger }) {
  const [balance, setBalance] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('moments')
        .select('category')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        const counts = {
          'TECHNICAL SKILLS': 0,
          'COMMUNICATION': 0,
          'CREATIVITY': 0,
          'LIFE & WELLBEING': 0,
        };
        data.forEach(m => {
          if (m.category && counts[m.category] !== undefined) counts[m.category]++;
        });
        const max = Math.max(...Object.values(counts), 1);
        const scaled = {};
        Object.entries(counts).forEach(([k, v]) => {
          scaled[k] = Math.round((v / max) * 3) + 1;
        });
        setBalance(scaled);
      }
    };
    fetch();
    
  }, [refreshTrigger]);

  const labels = {
    'TECHNICAL SKILLS': 'Technical',
    'COMMUNICATION': 'Communication',
    'CREATIVITY': 'Creativity',
    'LIFE & WELLBEING': 'Life & Wellbeing',
  };

  const sorted = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  const most = sorted[0];
  const least = sorted[sorted.length - 1];
  const isEmpty = Object.values(balance).every(v => v === 0);
  const isUnbalanced = !isEmpty && most && least && most[1] >= least[1] * 2 && most[1] > 0;

  return (
    <div className="bg-[#F5F3EC] rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A]">⚖️ BALANCE CHECK</h2>
      <p className="text-sm text-[#8aa394] mb-4">where your attention has gone lately</p>

      <div className="flex flex-col gap-3 text-sm">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[#2D4A3A]">{label}</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={`w-2 h-2 rounded-full ${i <= (balance[key] ?? 0) ? 'bg-[#7a9a87]' : 'bg-[#cdd8cf]'}`}></span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isEmpty ? (
        <div className="mt-3 rounded-xl bg-[#EAF0EA] border border-[#C5D6CC] p-3 text-xs text-[#4a6553]">
          Log some moments to see your balance.
        </div>
      ) : isUnbalanced ? (
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none">🌿</span>
            <div>
              <span className="font-semibold">Focus your energy in {labels[least[0]]} — balance is key!</span>
              <div className="mt-1 text-amber-700">Make sure to water all your plants.</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-xl bg-[#EAF0EA] border border-[#C5D6CC] p-3 text-xs text-[#4a6553]">
          <span className="font-semibold text-[#4F6F5E]">✨ Looking balanced!</span> Keep logging across all areas.
        </div>
      )}
    </div>
  );
}