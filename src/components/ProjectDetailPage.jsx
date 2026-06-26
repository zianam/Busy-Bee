import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Sprout, Star, TrendingUp } from 'lucide-react';

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
  const [skills, setSkills] = useState([]);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectProp.id)
        .single();

      if (proj) setProject(proj);
      else setProject({
        id: projectProp.id,
        name: projectProp.name,
        description: projectProp.description ?? '',
        status: projectProp.status ?? (projectProp.stage >= 100 ? 'Completed' : 'In Progress'),
        progress: projectProp.progress ?? projectProp.stage ?? 0,
      });

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
        setSkills(withStages);
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

  const displayProject = project ?? {
    name: projectProp.name,
    description: '',
    status: 'In Progress',
    progress: projectProp.progress ?? projectProp.stage ?? 0,
  };

  const houseImg = displayProject.progress >= 100 ? '/house-done.png' : '/house-wip.png';

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
            {displayProject.progress >= 100 && (
              <div className="absolute right-4 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#6f9580] text-2xl font-bold text-white shadow">✓</div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 border-b border-[#C5D6CC] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <h1 className="text-4xl font-bold leading-tight text-[#2D4A3A]">{displayProject.name}</h1>
            <dl className="grid gap-3 text-sm">
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl text-green-600">●</span>
                <dt className="font-bold text-[#6b8275]">Status</dt>
                <dd className="font-bold text-[#4F6F5E]">{displayProject.status}</dd>
              </div>
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <TrendingUp size={16} color="#2D4A3A" />
                <dt className="font-bold text-[#6b8275]">Progress</dt>
                <dd className="flex items-center gap-3 font-bold">
                  {displayProject.progress}%
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#d8e6e0]">
                    <span className="block h-full rounded-full bg-[#159a93]" style={{ width: `${displayProject.progress}%` }} />
                  </span>
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

        <Section number="2" title="Skills Grown">
          {loading ? (
            <div className="text-sm text-[#8aa394] py-4 text-center">Loading skills...</div>
          ) : skills.length === 0 ? (
            <div className="text-sm text-[#8aa394] py-4 text-center">No skills linked to this project yet — connect skills from the dashboard.</div>
          ) : (
            <div className="relative overflow-hidden px-2 pb-1 pt-2">
              <div className="absolute left-20 right-20 top-[6.75rem] hidden border-t-2 border-dotted border-amber-300 md:block" />
              <div className="relative grid gap-4 md:grid-cols-4">
                {skills.map(skill => (
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
                {skills.length} skills supported by project evidence
              </p>
            </div>
          )}
        </Section>

        <Section number="3" title="Key Moments">
          {loading ? (
            <div className="text-sm text-[#8aa394] py-4 text-center">Loading moments...</div>
          ) : moments.length === 0 ? (
            <div className="text-sm text-[#8aa394] py-4 text-center">No moments linked to this project yet.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#C5D6CC] bg-[#F5F3EC]">
              {moments.map(m => (
                <div key={m.id} className="grid gap-3 border-b border-[#e2e8e2] px-4 py-3 last:border-b-0 md:grid-cols-[4rem_8rem_1fr_8rem] md:items-center">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-md text-xl ${m.type === 'accomplishment' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'}`}>
                    {m.type === 'accomplishment' ? '🏆' : '⚡'}
                  </span>
                  <span className="text-sm font-bold text-[#2D4A3A] capitalize">{m.type}</span>
                  <span className="font-bold text-[#2D4A3A]">{m.description}</span>
                  <span className="text-sm font-bold text-[#6b8275]">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-[#fff9ec] px-5 py-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-amber-700">
                <span aria-hidden="true" className="text-2xl">✨</span>
                4. AI Project Story
              </h2>
              <p className="max-w-3xl text-sm font-bold leading-6 text-[#2d3447]">
                {displayProject.story ?? 'Log moments and connect skills to generate your project story.'}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className="inline-flex h-11 items-center justify-center gap-3 rounded-md border border-amber-300 bg-white/50 px-6 text-sm font-bold text-amber-700 transition hover:bg-white">
                <span aria-hidden="true">✎</span> Edit Story
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-md border border-amber-300 bg-white/50 px-6 text-sm font-bold text-amber-700 transition hover:bg-white"
              >
                <Star size={16} />
                Add to Season Recap
              </button>
            </div>
          </div>
          <img src="/flower-bloom-red.png" alt="" className="pointer-events-none absolute bottom-1 right-2 hidden h-16 w-16 object-contain opacity-90 md:block" />
        </section>

      </main>

      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
    </div>
  );
}