import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Groq from 'groq-sdk';

const CATEGORY_MAP = {
  'Technical': 'TECHNICAL SKILLS',
  'Communication': 'COMMUNICATION',
  'Creativity': 'CREATIVITY',
  'Life & Wellbeing': 'LIFE & WELLBEING',
};

const CONFIDENCE_STAGES = [
  { label: 'Just starting', emoji: '🌱', img: '/growth-seed.png', stage: 'Seed', desc: 'Still finding my footing' },
  { label: 'Getting there', emoji: '🌿', img: '/growth-sprout.png', stage: 'Sprout', desc: 'Starting to get it' },
  { label: 'Solid', emoji: '🌷', img: '/growth-bud.png', stage: 'Bud', desc: 'I applied this for real' },
  { label: 'Owning it', emoji: '🌸', img: '/growth-bloom.png', stage: 'Bloom', desc: 'This is becoming second nature' },
];

export default function MomentModal({ onClose, onConfirm }) {
  const [answers, setAnswers] = useState({
    action: '',
    type: 'accomplishment',
    category: '',
    skill: '',
    confidence: null,
    project_id: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [projects, setProjects] = useState([]);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [autoDetectError, setAutoDetectError] = useState(null);
  const [suggestedNewSkill, setSuggestedNewSkill] = useState(null); // { name, category }
  const [addingNewSkill, setAddingNewSkill] = useState(false);

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

    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name')
        .order('created_at', { ascending: true });
      if (data) setProjects(data);
    };

    fetchSkills();
    fetchProjects();
  }, []);

  const handleAnswerChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (field === 'category') {
      setSelectedCategory(value);
      setAnswers(prev => ({ ...prev, category: value, skill: '' }));
    }
  };

  async function handleAutoDetect() {
    if (!answers.action.trim()) return;
    setAutoDetecting(true);
    setAutoDetectError(null);
    setSuggestedNewSkill(null);

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // Build an explicit per-category skill list so the model sees the full picture
      const skillList = Object.entries(CATEGORY_MAP)
        .map(([short, full]) => {
          const skills = skillsByCategory[short] ?? [];
          return `${full}: ${skills.length ? skills.join(', ') : '(no skills yet)'}`;
        })
        .join('\n');

      const result = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: `You are helping a student log a learning moment. Match the description to the closest existing skill below.

AVAILABLE SKILLS BY CATEGORY:
${skillList}

MOMENT DESCRIPTION: "${answers.action}"

Rules:
- If an existing skill is a reasonable match (even partial), return type "existing".
- Only return type "new" if truly nothing in the list fits at all.
- The category must be one of: Technical, Communication, Creativity, Life & Wellbeing.
- For type "new", suggest a concise skill name (2-3 words max).

Return ONLY valid JSON — no explanation, no markdown — in one of these two shapes:
{"type":"existing","category":"Technical","skill":"React"}
{"type":"new","category":"Technical","skill":"Error Handling"}`,
          },
        ],
      });

      const text = result.choices[0]?.message?.content ?? '';
      const match = text.match(/\{[\s\S]*?\}/);
      if (!match) throw new Error('No JSON in response');

      const parsed = JSON.parse(match[0]);

      if (parsed.type === 'existing' && parsed.category && parsed.skill && CATEGORY_MAP[parsed.category]) {
        setSelectedCategory(parsed.category);
        setAnswers(prev => ({ ...prev, category: parsed.category, skill: parsed.skill }));
      } else if (parsed.type === 'new' && parsed.category && parsed.skill && CATEGORY_MAP[parsed.category]) {
        setSuggestedNewSkill({ name: parsed.skill, category: parsed.category });
      } else {
        setAutoDetectError("Couldn't find a match — please select manually.");
      }
    } catch (err) {
      console.error('Auto-detect failed:', err);
      setAutoDetectError("Couldn't auto-detect — please select manually.");
    } finally {
      setAutoDetecting(false);
    }
  }

  async function handleAddSuggestedSkill() {
    if (!suggestedNewSkill) return;
    setAddingNewSkill(true);
    try {
      await supabase.from('skills').insert({
        name: suggestedNewSkill.name,
        category: CATEGORY_MAP[suggestedNewSkill.category],
      });
      // Update local skill map so it's immediately selectable
      setSkillsByCategory(prev => ({
        ...prev,
        [suggestedNewSkill.category]: [...(prev[suggestedNewSkill.category] ?? []), suggestedNewSkill.name],
      }));
      setSelectedCategory(suggestedNewSkill.category);
      setAnswers(prev => ({ ...prev, category: suggestedNewSkill.category, skill: suggestedNewSkill.name }));
      setSuggestedNewSkill(null);
    } catch (err) {
      console.error('Failed to add skill:', err);
    } finally {
      setAddingNewSkill(false);
    }
  }

  const canSubmit = answers.action && answers.skill && answers.confidence;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const confidence = CONFIDENCE_STAGES.find(c => c.label === answers.confidence);
    const stage = confidence?.stage ?? 'Seed';

    try {
      const { error } = await supabase.from('moments').insert({
        skill: answers.skill,
        category: CATEGORY_MAP[answers.category] ?? answers.category,
        description: answers.action,
        stage,
        type: answers.type,
        project_id: answers.project_id ?? null,
      });

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to save moment.');
        return;
      }

      // Increment the linked project's progress by 10%
      if (answers.project_id) {
        const { data: proj } = await supabase
          .from('projects')
          .select('progress')
          .eq('id', answers.project_id)
          .single();
        const newProgress = Math.min(100, (proj?.progress ?? 0) + 10);
        await supabase
          .from('projects')
          .update({ progress: newProgress, status: newProgress >= 100 ? 'Completed' : 'In Progress' })
          .eq('id', answers.project_id);
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

        {/* Type toggle */}
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

        <div className="border-t border-[#dfe7e0] mb-8" />

        {/* Step 1 — Description */}
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

        <div className="border-t border-[#dfe7e0] my-8" />

        {/* Step 2 — Skill (AI or manual) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center text-base font-semibold text-[#2D4A3A]">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">2</span>
              Which skill?
            </label>
            <button
              type="button"
              onClick={handleAutoDetect}
              disabled={!answers.action.trim() || autoDetecting}
              className="inline-flex items-center gap-2 rounded-md border border-[#C5D6CC] px-3 py-1.5 text-xs font-bold text-[#4F6F5E] transition hover:bg-[#EAF0EA] disabled:opacity-40"
            >
              {autoDetecting ? (
                <>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#4F6F5E] border-t-transparent" />
                  Detecting...
                </>
              ) : (
                <>✨ Auto-detect with AI</>
              )}
            </button>
          </div>

          {autoDetectError && (
            <p className="mb-3 text-xs font-bold text-rose-600">⚠ {autoDetectError}</p>
          )}

          {/* AI suggests a brand-new skill */}
          {suggestedNewSkill && !answers.skill && (
            <div className="mb-3 rounded-xl border border-[#C5D6CC] bg-white px-4 py-3">
              <p className="mb-2 text-sm text-[#6b8275]">
                ✨ Nothing in your list matched closely. AI suggests adding:
              </p>
              <p className="mb-3 font-bold text-[#2D4A3A]">
                {suggestedNewSkill.name}
                <span className="ml-2 text-xs font-normal text-[#8aa394]">· {suggestedNewSkill.category}</span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddSuggestedSkill}
                  disabled={addingNewSkill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F6F5E] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#3d5a4a] disabled:opacity-50"
                >
                  {addingNewSkill ? 'Adding...' : '+ Add & select'}
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestedNewSkill(null)}
                  className="rounded-lg border border-[#C5D6CC] px-3 py-1.5 text-xs font-bold text-[#6b8275] transition hover:bg-[#EAF0EA]"
                >
                  Select manually
                </button>
              </div>
            </div>
          )}

          {answers.skill && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#C5D6CC] bg-white px-4 py-3">
              <span className="text-sm text-[#8aa394]">Detected:</span>
              <span className="font-bold text-[#2D4A3A]">{answers.skill}</span>
              <span className="text-xs text-[#8aa394]">· {answers.category}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setSuggestedNewSkill(null);
                  setAnswers(prev => ({ ...prev, category: '', skill: '' }));
                }}
                className="ml-auto text-xs font-bold text-[#6b8275] hover:text-[#2D4A3A]"
              >
                Change
              </button>
            </div>
          )}

          {!answers.skill && (
            <>
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
            </>
          )}
        </div>

        <div className="border-t border-[#dfe7e0] my-8" />

        {/* Step 3 — Confidence */}
        <div className="mb-8">
          <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">3</span>
            How confident do you feel about this skill now?
          </label>
          <div className="flex flex-col gap-3">
            {CONFIDENCE_STAGES.map(({ label, img, desc }) => (
              <button
                key={label}
                onClick={() => handleAnswerChange('confidence', label)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition border ${answers.confidence === label ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
              >
                <img src={img} alt="" className="w-8 h-8 object-contain" />
                <div>
                  <div className="font-semibold text-base">{label}</div>
                  <div className={`text-xs mt-0.5 ${answers.confidence === label ? 'text-[#cbddd2]' : 'text-[#8aa394]'}`}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#dfe7e0] my-8" />

        {/* Step 4 — Project (optional) */}
        <div className="mb-8">
          <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">4</span>
            Connect to a project?
            <span className="ml-2 text-xs font-normal text-[#8aa394]">optional</span>
          </label>
          {projects.length === 0 ? (
            <div className="text-sm text-[#8aa394]">No projects yet.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {projects.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setAnswers(prev => ({
                      ...prev,
                      project_id: prev.project_id === p.id ? null : p.id,
                    }))
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    answers.project_id === p.id
                      ? 'border-[#4F6F5E] bg-[#4F6F5E] text-[#F5F3EC]'
                      : 'border-[#C5D6CC] bg-white text-[#2D4A3A] hover:bg-[#EAF0EA]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
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
