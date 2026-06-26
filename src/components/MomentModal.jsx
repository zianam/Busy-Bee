import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CATEGORY_MAP = {
  'Technical': 'TECHNICAL SKILLS',
  'Communication': 'COMMUNICATION',
  'Creativity': 'CREATIVITY',
  'Life & Wellbeing': 'LIFE & WELLBEING',
};

const CONFIDENCE_STAGES = [
  { label: 'Just starting', emoji: '🌱', stage: 'Seed', desc: 'Still finding my footing' },
  { label: 'Getting there', emoji: '🌿', stage: 'Sprout', desc: 'Starting to get it' },
  { label: 'Solid', emoji: '🌷', stage: 'Bud', desc: 'I applied this for real' },
  { label: 'Owning it', emoji: '🌸', stage: 'Bloom', desc: 'This is becoming second nature' },
];

export default function MomentModal({ onClose, onConfirm }) {
  const [answers, setAnswers] = useState({
    action: '',
    type: 'accomplishment',
    category: '',
    skill: '',
    confidence: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [skillsByCategory, setSkillsByCategory] = useState({});

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('name, category')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const map = {};
        Object.entries(CATEGORY_MAP).forEach(([short, full]) => {
          map[short] = data.filter(s => s.category === full).map(s => s.name);
        });
        setSkillsByCategory(map);
      }
    };
    fetchSkills();
  }, []);

  const handleAnswerChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (field === 'category') {
      setSelectedCategory(value);
      setAnswers(prev => ({ ...prev, category: value, skill: '' }));
    }
  };

  const canSubmit = answers.action && answers.skill && answers.confidence;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const confidence = CONFIDENCE_STAGES.find(c => c.label === answers.confidence);
    const stage = confidence?.stage ?? 'Seed';

    try {
      const { error } = await supabase
        .from('moments')
        .insert({
          skill: answers.skill,
          category: CATEGORY_MAP[answers.category] ?? answers.category,
          description: answers.action,
          stage,
          type: answers.type,
        });

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to save moment.');
        return;
      }

      setSaved(true);
      setTimeout(() => {
        onConfirm({ ...answers, stage });
      }, 1800);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    const confidence = CONFIDENCE_STAGES.find(c => c.label === answers.confidence);
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-[#F5F3EC] rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-7xl mb-4 animate-bounce">{confidence?.emoji ?? '🌱'}</div>
          <div className="text-xl font-bold text-[#2D4A3A] mb-2">Moment logged!</div>
          <div className="text-sm text-[#6b8275]">{answers.skill} · {confidence?.stage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F5F3EC] rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#2D4A3A]">Log a Moment</h2>
          <button onClick={onClose} className="text-2xl font-bold text-[#6b8275] hover:bg-[#EAF0EA] w-10 h-10 flex items-center justify-center rounded-lg transition">×</button>
        </div>

        <div className="mb-8 flex gap-3">
          <button
            onClick={() => handleAnswerChange('type', 'accomplishment')}
            className={`flex-1 py-3 rounded-xl font-semibold text-base transition border ${answers.type === 'accomplishment' ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
          >
            🏆 Accomplishment
          </button>
          <button
            onClick={() => handleAnswerChange('type', 'challenge')}
            className={`flex-1 py-3 rounded-xl font-semibold text-base transition border ${answers.type === 'challenge' ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
          >
            ⚡ Challenge
          </button>
        </div>

        <div className="border-t border-[#dfe7e0] mb-8"></div>

        <div className="mb-8">
          <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">1</span>
            What did you do?
          </label>
          <textarea
            value={answers.action}
            onChange={(e) => handleAnswerChange('action', e.target.value)}
            placeholder="e.g., Fixed a critical bug in production..."
            className="w-full px-4 py-3 bg-white border border-[#C5D6CC] rounded-xl text-[#2D4A3A] placeholder-[#8aa394] focus:outline-none focus:ring-2 focus:ring-[#4F6F5E] focus:border-[#4F6F5E] resize-none text-base transition"
            rows="4"
          />
        </div>

        <div className="border-t border-[#dfe7e0] my-8"></div>

        <div className="mb-8">
          <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">2</span>
            Which skill?
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleAnswerChange('category', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#C5D6CC] rounded-xl text-[#2D4A3A] focus:outline-none focus:ring-2 focus:ring-[#4F6F5E] focus:border-[#4F6F5E] text-base transition mb-3"
          >
            <option value="">Select a category...</option>
            <option value="Technical">💻 Technical</option>
            <option value="Communication">💬 Communication</option>
            <option value="Creativity">🎨 Creativity</option>
            <option value="Life & Wellbeing">🌳 Life & Wellbeing</option>
          </select>

          {selectedCategory && (
            skillsByCategory[selectedCategory]?.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {skillsByCategory[selectedCategory].map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleAnswerChange('skill', skill)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition border ${answers.skill === skill ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-[#8aa394]">No skills yet — add some from the dashboard.</div>
            )
          )}
        </div>

        <div className="border-t border-[#dfe7e0] my-8"></div>

        <div className="mb-8">
          <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">3</span>
            How confident do you feel about this skill now?
          </label>
          <div className="flex flex-col gap-3">
            {CONFIDENCE_STAGES.map(({ label, emoji, desc }) => (
              <button
                key={label}
                onClick={() => handleAnswerChange('confidence', label)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition border ${answers.confidence === label ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
              >
                <span className="text-2xl">{emoji}</span>
                <div>
                  <div className="font-semibold text-base">{label}</div>
                  <div className={`text-xs mt-0.5 ${answers.confidence === label ? 'text-[#cbddd2]' : 'text-[#8aa394]'}`}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canSubmit || saving}
          className="w-full bg-[#4F6F5E] text-white py-4 rounded-full font-bold hover:bg-[#3d5a4a] disabled:bg-[#cbd5cd] disabled:text-[#8aa394] transition text-lg"
        >
          {saving ? 'Saving...' : 'Log this moment'}
        </button>

      </div>
    </div>
  );
}