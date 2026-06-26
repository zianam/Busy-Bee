import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Sprout, Star, TrendingUp } from 'lucide-react';
import Groq from "groq-sdk";

const STAGE_IMAGES = {
  Seed: '/flower-seed.png',
  Sprout: '/flower-sprout.png',
  Bud: '/flower-bud.png',
  Bloom: '/flower-bloom-pink.png',
};

const defaultLinks = [
  { label: 'Live Demo', icon: '↗' },
  { label: 'GitHub', icon: '◖' },
  { label: 'Presentation', icon: '▣' },
];

function HeaderAction({ icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#6b8a78] px-5 text-sm font-bold text-white/90 transition hover:bg-white/10"
    >
      <span aria-hidden="true" className="text-lg leading-none">{icon}</span>
      {children}
    </button>
  );
}

function Section({ number, title, children, action }) {
  return (
    <section className="rounded-2xl border border-[#C5D6CC] bg-[#F5F3EC] px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-[#2D4A3A]">
          <span>{number}.</span>
          <span>{title}</span>
          <Sprout size={16} color="#2D4A3A" />
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function SkillPill({ children }) {
  return (
    <span className="rounded-md bg-[#dde7e2] px-3 py-1 text-xs font-bold text-[#2D4A3A]">
      {children}
    </span>
  );
}
function SuggestSkillsPopup({ suggestions, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(new Set());

  function toggle(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  return (
    <div className="mt-3 rounded-lg border border-[#8cc8c5] bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-[#e4e7e3] px-4 py-2.5">
        <span className="text-xs font-bold text-[#12857f]">✨ Gemini suggested these skills — add any?</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-bold text-[#516076] transition hover:text-[#102044]"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {suggestions.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => toggle(name)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              selected.has(name)
                ? "border-[#12857f] bg-[#eef9f7] text-[#12857f]"
                : "border-[#d6dfdc] bg-white text-[#516076] hover:border-[#8cc8c5]"
            }`}
          >
            <img src="/flower-bud.png" alt="" className="h-4 w-4 object-contain" />
            {name}
            {selected.has(name) && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-[#e4e7e3] px-4 py-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-[#516076] transition hover:text-[#102044]"
        >
          No thanks
        </button>
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() => onConfirm([...selected])}
          className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#12857f] px-3 text-xs font-bold text-white transition hover:bg-[#0f706b] disabled:opacity-40"
        >
          + Add {selected.size > 0 ? selected.size : ""} Skill{selected.size !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}


function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard may be unavailable; still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#C5D6CC] bg-[#F5F3EC] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2D4A3A]">Share your proof of skill</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-[#6b8275] transition hover:bg-[#EAF0EA]"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          className="mb-4 w-full rounded-xl border border-[#C5D6CC] bg-white px-4 py-2 text-sm text-[#2D4A3A] focus:outline-none focus:ring-2 focus:ring-[#4F6F5E]"
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 rounded-full bg-[#4F6F5E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3f5b4d]"
          >
            {copied ? "Copied! ✓" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={() => alert("Coming soon!")}
            className="flex-1 rounded-full border border-[#C5D6CC] bg-[#FBFAF5] px-5 py-3 text-sm font-bold text-[#2D4A3A] transition hover:bg-[#EAF0EA]"
          >
            Download as card ↓
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage({ project: projectProp, profile, onBack, onEdit }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [project, setProject] = useState(null);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [localProgress, setLocalProgress] = useState(projectProp.progress ?? projectProp.stage ?? 0);
  const [localSkills, setLocalSkills] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [suggestError, setSuggestError] = useState(null);

  async function handleSuggestSkills() {
    setSuggestLoading(true);
    setSuggestError(null);
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const existing = localSkills.map((s) => s.name).join(", ");

      const result = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `You are helping a student document skills they practiced on a project.

Project: "${project?.name ?? projectProp.name}"
Description: "${project?.description ?? projectProp.description ?? ''}"
Skills already tracked: ${existing}

Suggest 3-5 NEW skills (not in the list above) that a student would realistically practice or develop from this project. Return ONLY a valid JSON array of skill name strings — no explanation, no markdown.
Example: ["Version Control", "User Research", "REST APIs"]`,
          },
        ],
      });

      const text = result.choices[0]?.message?.content ?? "";
      const match = text.match(/\[[\s\S]*?\]/);
      const names = match ? JSON.parse(match[0]) : [];
      if (names.length === 0) throw new Error("No skills returned");
      setSuggestedSkills(names);
      setShowModal(true);
    } catch (err) {
      console.error("Skill suggestion failed:", err);
      setSuggestError(err.message ?? "Something went wrong");
    } finally {
      setSuggestLoading(false);
    }
  }

  async function handleConfirm(selectedNames) {
    // Ask Groq to classify each skill into one of the four app categories
    const VALID_CATEGORIES = ['TECHNICAL SKILLS', 'COMMUNICATION', 'CREATIVITY', 'LIFE & WELLBEING'];
    let categories = {};
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const result = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Assign each skill to exactly one of these four categories:
- TECHNICAL SKILLS
- COMMUNICATION
- CREATIVITY
- LIFE & WELLBEING

Skills: ${JSON.stringify(selectedNames)}

Return ONLY a valid JSON object mapping each skill name to its category string. No explanation, no markdown.
Example: {"Version Control": "TECHNICAL SKILLS", "User Research": "COMMUNICATION"}`,
          },
        ],
      });
      const text = result.choices[0]?.message?.content ?? "";
      const match = text.match(/\{[\s\S]*?\}/);
      if (match) categories = JSON.parse(match[0]);
    } catch (err) {
      console.error("Category assignment failed:", err);
    }

    const inserts = selectedNames.map((name) => ({
      name,
      category: VALID_CATEGORIES.includes(categories[name]) ? categories[name] : 'TECHNICAL SKILLS',
      project_id: projectProp.id,
    }));

    await supabase.from('skills').insert(inserts);

    setLocalSkills((prev) => [
      ...prev,
      ...inserts.map((s) => ({ name: s.name, stage: 'Seed', category: s.category })),
    ]);
    setShowModal(false);
  }

  useEffect(() => {
    const load = async () => {
      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectProp.id)
        .single();

      if (proj) {
        setProject(proj);
        setLocalProgress(proj.progress ?? 0);
      } else {
        const fallback = {
          id: projectProp.id,
          name: projectProp.name,
          description: projectProp.description ?? '',
          status: projectProp.status ?? (projectProp.stage >= 100 ? 'Completed' : 'In Progress'),
          progress: projectProp.progress ?? projectProp.stage ?? 0,
        };
        setProject(fallback);
        setLocalProgress(fallback.progress);
      }

      const { data: skillData } = await supabase
        .from('skills')
        .select('name, category')
        .eq('project_id', projectProp.id);

      if (skillData) {
        const withStages = await Promise.all(skillData.map(async s => {
          const { data: mData } = await supabase
            .from('moments')
            .select('stage')
            .eq('skill', s.name)
            .order('created_at', { ascending: false })
            .limit(1);
          return { ...s, stage: mData?.[0]?.stage ?? 'Seed' };
        }));
        setLocalSkills(withStages);
      }

      const { data: momentData } = await supabase
        .from('moments')
        .select('*')
        .eq('project_id', projectProp.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (momentData) setMoments(momentData);
      setLoading(false);
    };
    load();
  }, [projectProp.id]);

  async function handleProgressSave(value) {
    const status = value >= 100 ? 'Completed' : 'In Progress';
    await supabase.from('projects').update({ progress: value, status }).eq('id', projectProp.id);
    setProject(prev => prev ? { ...prev, progress: value, status } : prev);
  }

  const displayProject = project ?? {
    name: projectProp.name,
    description: '',
    status: 'In Progress',
    progress: projectProp.progress ?? projectProp.stage ?? 0,
  };

  const houseImg = localProgress >= 100 ? '/house-done.png' : '/house-wip.png';

  return (
    <div className="min-h-screen bg-[#DCE8E0] text-[#2D4A3A]">
      <header className="sticky top-0 z-10 border-b border-[#3f5b4d] bg-[#4F6F5E] text-white shadow-sm">
        <div className="flex min-h-16 items-center gap-4 pl-8 pr-6 py-3">
          <button
            type="button"
            onClick={onBack}
            className="mr-auto inline-flex items-center gap-3 text-sm font-bold text-white/85 transition hover:text-white"
          >
            <span aria-hidden="true" className="text-2xl leading-none">←</span>
            Back to Projects
          </button>
          <div className="flex items-center gap-4">
            <HeaderAction icon="⇧" onClick={() => setShowShareModal(true)}>
              Share
            </HeaderAction>
            <HeaderAction icon="✎" onClick={onEdit}>
              Edit
            </HeaderAction>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6">
        <section className="grid gap-6 rounded-2xl border border-[#C5D6CC] bg-[#F5F3EC] p-5 shadow-sm lg:grid-cols-[1.1fr_1fr_1.2fr]">
          <div className="relative flex min-h-56 items-center justify-center border-b border-[#C5D6CC] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <img src={houseImg} alt="" className="h-60 w-full max-w-md object-contain" />
            {localProgress >= 100 && (
              <div className="absolute right-4 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#6f9580] text-2xl font-bold text-white shadow">✓</div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 border-b border-[#C5D6CC] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <h1 className="text-4xl font-bold leading-tight text-[#2D4A3A]">{displayProject.name}</h1>
            <dl className="grid gap-3 text-sm">
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl text-green-600">●</span>
                <dt className="font-bold text-[#6b8275]">Status</dt>
                <dd className="font-bold text-[#4F6F5E]">{localProgress >= 100 ? 'Completed' : 'In Progress'}</dd>
              </div>
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <TrendingUp size={16} color="#2D4A3A" />
                <dt className="font-bold text-[#6b8275]">Progress</dt>
                <dd className="flex flex-col gap-1.5 font-bold">
                  <div className="flex items-center gap-3">
                    <span>{localProgress}%</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#d8e6e0]">
                      <span className="block h-full rounded-full bg-[#159a93] transition-all duration-150" style={{ width: `${localProgress}%` }} />
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={localProgress}
                    onChange={(e) => setLocalProgress(Number(e.target.value))}
                    onMouseUp={(e) => handleProgressSave(Number(e.target.value))}
                    onTouchEnd={(e) => handleProgressSave(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[#159a93]"
                  />
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <p className="max-w-md text-base font-bold leading-7 text-[#2D4A3A]">
              {displayProject.description || 'No description yet.'}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {defaultLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#C5D6CC] bg-[#FBFAF5] px-3 ${link.label === "Presentation" ? "text-xs" : "text-sm"} font-bold text-[#2D4A3A] transition hover:border-[#4F6F5E]`}
                >
                  <span aria-hidden="true" className="text-xl text-[#4F6F5E]">
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <Section
          number="2"
          title="Skills Grown"
          action={
            <button
              type="button"
              disabled={suggestLoading}
              onClick={handleSuggestSkills}
              className="inline-flex items-center gap-2 rounded-md border border-[#C5D6CC] px-4 py-2 text-xs font-bold text-[#4F6F5E] transition hover:bg-[#EAF0EA] disabled:opacity-50"
            >
              {suggestLoading ? (
                <>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#4F6F5E] border-t-transparent" />
                  Thinking...
                </>
              ) : (
                <>✨ Suggest with AI</>
              )}
            </button>
          }
        >
          {loading ? (
            <div className="py-4 text-center text-sm text-[#8aa394]">Loading skills...</div>
          ) : localSkills.length === 0 ? (
            <div className="py-4 text-center text-sm text-[#8aa394]">No skills linked to this project yet — connect skills from the dashboard.</div>
          ) : (
            <div className="relative overflow-hidden px-2 pb-1 pt-2">
              <div className="absolute left-20 right-20 top-[6.75rem] hidden border-t-2 border-dotted border-amber-300 md:block" />
              <div className="relative grid gap-4 md:grid-cols-4">
                {localSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-center gap-4 md:flex-col">
                    <img src={STAGE_IMAGES[skill.stage] ?? '/flower-seed.png'} alt="" className="h-24 w-24 object-contain" />
                    <div className="min-w-36 md:min-w-0 md:text-center">
                      <div className="text-sm font-bold text-[#2D4A3A]">{skill.name}</div>
                      <div className="text-sm font-bold text-[#4F6F5E]">{skill.stage}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-sm font-bold text-[#8aa394]">
                {localSkills.length} skills supported by project evidence
              </p>
            </div>
          )}
          {suggestError && (
            <p className="mt-2 text-center text-xs font-bold text-rose-600">
              ⚠ {suggestError}
            </p>
          )}
          {showModal && (
            <SuggestSkillsPopup
              suggestions={suggestedSkills}
              onConfirm={handleConfirm}
              onCancel={() => setShowModal(false)}
            />
          )}
        </Section>

        <Section
          number="3"
          title="Key Moments"
          action={
            <button
              type="button"
              className="rounded-md border border-[#C5D6CC] px-4 py-2 text-xs font-bold text-[#4F6F5E] transition hover:bg-[#EAF0EA]"
            >
              View all moments
            </button>
          }
        >
          {loading ? (
            <div className="py-4 text-center text-sm text-[#8aa394]">Loading moments...</div>
          ) : moments.length === 0 ? (
            <div className="py-4 text-center text-sm text-[#8aa394]">No moments linked to this project yet.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#C5D6CC] bg-[#FBFAF5]">
              {moments.map((m) => (
                <div
                  key={m.id}
                  className="grid gap-3 border-b border-[#e2e8e2] px-4 py-3 last:border-b-0 md:grid-cols-[4rem_8rem_1fr_10rem_1fr] md:items-center"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-md text-xl ${m.type === 'accomplishment' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {m.type === 'accomplishment' ? '🏆' : '⚡'}
                  </span>
                  <span className="text-sm font-bold text-[#2D4A3A] capitalize">{m.type}</span>
                  <span className="font-bold text-[#2D4A3A]">{m.description}</span>
                  <span className="text-sm font-bold text-[#6b8275]">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  {m.skill && (
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#6b8275]">
                      Skills:
                      <SkillPill>{m.skill}</SkillPill>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section number="4" title="Evidence">
          <div className="grid gap-4 md:grid-cols-3">
            {defaultLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                className="grid h-20 grid-cols-[5rem_1fr_2rem] items-center gap-3 rounded-md border border-[#C5D6CC] bg-[#FBFAF5] px-4 text-left transition hover:border-[#4F6F5E]"
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-[#2D4A3A] text-3xl font-bold text-white">
                  {item.icon}
                </span>
                <span className="text-sm font-bold text-[#2D4A3A]">{item.label}</span>
                <span aria-hidden="true" className="text-2xl font-bold text-[#4F6F5E]">↗</span>
              </button>
            ))}
          </div>
        </Section>
      </main>

      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
    </div>
  );
}