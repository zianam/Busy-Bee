import { useState, useEffect } from 'react';
import { defaultBusyBeeData } from './data/busyBeeData';
import { supabase } from './supabaseClient';
import MomentModal from './components/MomentModal';
import TodaysMoments from './components/TodaysMoments';
import SkillHistory from './components/SkillHistory';
import ProjectDetailPage from './components/ProjectDetailPage';
import LoadingScreen from './components/LoadingScreen';
import TopStatsBar from './components/TopStatsBar';import BeeCompanion from './components/BeeCompanion';
import {
  Home, Sprout, Scale, MessageCircle, Palette, Leaf,
  Atom, Bug, Plug, GitBranch, Presentation, Users, FileText, MessageSquare,
  Layers, BookOpen, FlaskConical, Lightbulb, Dumbbell, Moon, Heart, Smile,
} from 'lucide-react';

const { profile } = defaultBusyBeeData;

const SKILL_ICONS = {
  'React': Atom,
  'Debugging': Bug,
  'API Integration': Plug,
  'Git': GitBranch,
  'Presenting': Presentation,
  'Teamwork': Users,
  'Documentation': FileText,
  'Feedback': MessageSquare,
  'UI Design': Layers,
  'Storytelling': BookOpen,
  'Experimentation': FlaskConical,
  'Ideation': Lightbulb,
  'Fitness': Dumbbell,
  'Rest': Moon,
  'Relationships': Heart,
  'Hobbies': Smile,
};

const STAGE_IMAGES = {
  Seed: 'flower-seed.png',
  Sprout: 'flower-sprout.png',
  Bud: 'flower-bud.png',
  Bloom: 'flower-bloom-pink.png',
};

const CATEGORY_META = [
  { title: 'TECHNICAL SKILLS', label: '</>', mono: true, bg: 'bg-[#EAF0F0]' },
  { title: 'COMMUNICATION', Icon: MessageCircle, bg: 'bg-[#EAF0F0]' },
  { title: 'CREATIVITY', Icon: Palette, bg: 'bg-[#F4ECEC]' },
  { title: 'LIFE & WELLBEING', Icon: Leaf, bg: 'bg-[#EAF0EA]' },
];

function App() {
  const [showMomentModal, setShowMomentModal] = useState(false);
  const [beeDancing, setBeeDancing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [skillStages, setSkillStages] = useState({});
  const [skillsData, setSkillsData] = useState(CATEGORY_META.map(c => ({ ...c, skills: [] })));
  const [showAddSkill, setShowAddSkill] = useState(null);
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 6500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchAllMoments = async () => {
      const { data, error } = await supabase
        .from('moments')
        .select('skill, stage, created_at')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const stages = {};
        data.forEach(m => {
          if (m.skill && m.stage) stages[m.skill] = m.stage;
        });
        setSkillStages(stages);
      }
    };
    fetchAllMoments();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setSkillsData(CATEGORY_META.map(cat => ({
          ...cat,
          skills: data.filter(s => s.category === cat.title).map(s => s.name),
        })));
      }
    };
    fetchSkills();
  }, [refreshTrigger]);

  const handleMomentConfirm = () => {
    setBeeDancing(true);
    setTimeout(() => setBeeDancing(false), 1500);
    setShowMomentModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddSkill = async (categoryTitle) => {
    if (!newSkillName.trim()) return;
    const { error } = await supabase
      .from('skills')
      .insert({ name: newSkillName.trim(), category: categoryTitle });
    if (!error) {
      setSkillsData(prev => prev.map(cat =>
        cat.title === categoryTitle
          ? { ...cat, skills: [...cat.skills, newSkillName.trim()] }
          : cat
      ));
    }
    setNewSkillName('');
    setShowAddSkill(null);
  };

  if (selectedProject) {
    return (
      <ProjectDetailPage
        project={selectedProject}
        profile={{
          displayName: "Bloom",
          subtitle: "Proof-of-Skill Ledger",
          userName: profile.userName,
          season: profile.season,
        }}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (

    
    <div className="min-h-screen bg-[#DCE8E0]">
      {loading && <LoadingScreen />}

      <div className="w-full px-6 pt-4 pb-28">

        <TopStatsBar beeDancing={beeDancing} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3">

          <div className="lg:col-span-1 bg-[#F5F3EC] rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <Home size={16} color="#2D4A3A" />
              <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A]">PROJECTS</h2>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject({ id: "project-atlas", name: "Project Atlas", houseType: "cottage", stage: 100 })}
                className="relative bg-[#F5F3EC] rounded-2xl shadow-md p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-[#6f9580] flex items-center justify-center text-white text-xs shadow">✓</div>
                <div className="rounded-xl bg-[#ECE9E0] flex items-center justify-center p-2">
                  <img src="/house-done.png" alt="" className="object-contain" style={{ width: '140px', height: '100px' }} />
                </div>
                <div className="mt-2 font-semibold text-[#2D4A3A]">Project Atlas</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#cdd8cf] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6f9580]" style={{ width: "100%" }}></div>
                  </div>
                  <span className="text-xs font-semibold text-[#4a6553]">100%</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProject({ id: "portfolio-refresh", name: "Portfolio Refresh", houseType: "studio", stage: 65, category: "Portfolio Site", team: "1 member", description: "Portfolio Refresh is a personal site update focused on stronger case studies, clearer visual polish, and a smoother presentation flow." })}
                className="relative bg-[#F5F3EC] rounded-2xl shadow-md p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="rounded-xl bg-[#ECE9E0] flex items-center justify-center p-2">
                  <img src="/house-wip.png" alt="" className="object-contain" style={{ width: '140px', height: '100px' }} />
                </div>
                <div className="mt-2 font-semibold text-[#2D4A3A]">Portfolio Refresh</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#cdd8cf] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7a9a87]" style={{ width: "65%" }}></div>
                  </div>
                  <span className="text-xs font-semibold text-[#4a6553]">65%</span>
                </div>
              </button>
            </div>

            <button className="w-full mt-3 rounded-lg border border-[#b9ccc0] text-[#4F6F5E] text-sm py-2 hover:bg-[#EAF0EA] transition">
              See all projects
            </button>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsData.map(cat => (
              <div key={cat.title} className={`${cat.bg} rounded-2xl p-3 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] flex items-center gap-1.5">
                    {cat.mono ? <span className="font-mono">{cat.label}</span> : <cat.Icon size={16} color="#2D4A3A" />}
                    {cat.title}
                  </h2>
                  <button
                    onClick={() => setShowAddSkill(cat.title)}
                    className="text-xs text-[#4F6F5E] hover:underline font-medium"
                  >
                    + add
                  </button>
                </div>

                {showAddSkill === cat.title && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddSkill(cat.title)}
                      placeholder="Skill name..."
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-[#C5D6CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#4F6F5E]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleAddSkill(cat.title)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#4F6F5E] text-white"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setShowAddSkill(null); setNewSkillName(''); }}
                      className="text-xs px-2 py-1.5 rounded-lg border border-[#C5D6CC] text-[#6b8275]"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center pt-2">
                  {cat.skills.length === 0 ? (
                    <div className="text-xs text-[#8aa394] text-center py-4">
                      No skills yet — add one above
                    </div>
                  ) : (
                    cat.skills.map(name => {
                      const stage = skillStages[name] ?? 'Seed';
                      const img = STAGE_IMAGES[stage] ?? 'flower-seed.png';
                      const SkillIcon = SKILL_ICONS[name];
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setSelectedSkill(name)}
                          className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition"
                        >
                          <img src={`/${img}`} alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                          <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center gap-1">
                            {SkillIcon && <SkillIcon size={14} color="#2D4A3A" className="shrink-0" />}
                            {name}
                          </span>
                          <span className="text-xs text-[#8aa394]">{stage}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">

          <div className="bg-[#F5F3EC] rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2 flex items-center gap-1.5"><Sprout size={16} color="#2D4A3A" /> GROWTH KEY</h2>
            <ul className="flex flex-col gap-3 text-sm">
              {[['/growth-seed.png','Seed','newly added skill'],['/growth-sprout.png','Sprout','one related micro-win'],['/growth-bud.png','Bud','applied in a project'],['/growth-bloom.png','Bloom','repeated evidence & reflection']].map(([img, label, desc]) => (
                <li key={label} className="flex items-start gap-2">
                  <img src={img} alt="" className="w-8 h-8 object-contain inline" />
                  <span><span className="font-semibold text-[#2D4A3A]">{label}</span> <span className="text-[#6b8275]">— {desc}</span></span>
                </li>
              ))}
            </ul>
          </div>

          <TodaysMoments onAddMoment={() => setShowMomentModal(true)} refreshTrigger={refreshTrigger} />

          <div className="bg-[#F5F3EC] rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] flex items-center gap-1.5"><Scale size={16} color="#2D4A3A" /> BALANCE CHECK</h2>
            <p className="text-sm text-[#8aa394] mb-2">where your attention has gone lately</p>
            <div className="flex flex-col gap-3 text-sm">
              {[['Technical',4],['Communication',3],['Creativity',2],['Life & Wellbeing',3]].map(([label, filled]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[#2D4A3A]">{label}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`w-2 h-2 rounded-full ${i <= filled ? 'bg-[#7a9a87]' : 'bg-[#cdd8cf]'}`}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-[#4a6553]">
              <span className="font-semibold text-amber-700">✨ AI Insight:</span> You've leaned into Technical work lately — consider a small Creativity moment this week to keep your garden balanced.
            </div>
          </div>

        </div>

        <button
          onClick={() => setShowMomentModal(true)}
          className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-amber-300 text-[#2D4A3A] font-bold px-6 py-4 shadow-lg shadow-amber-300/50 hover:bg-amber-400 transition"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-sm tracking-wide">ADD MOMENT</span>
        </button>

        {showMomentModal && (
          <MomentModal onClose={() => setShowMomentModal(false)} onConfirm={handleMomentConfirm} />
        )}

        {selectedSkill && (
          <SkillHistory skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
        )}

      </div>
    </div>
  );
}

export default App;