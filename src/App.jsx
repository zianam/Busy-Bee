import { useState, useEffect } from 'react';
import { defaultBusyBeeData } from './data/busyBeeData';
import { supabase } from './supabaseClient';
import MomentModal from './components/MomentModal';
import TodaysMoments from './components/TodaysMoments';
import SkillHistory from './components/SkillHistory';
import ProjectDetailPage from './components/ProjectDetailPage';
import LoadingScreen from './components/LoadingScreen';
import TopStatsBar from './components/TopStatsBar';
import BalanceCheck from './components/BalanceCheck';

const { profile } = defaultBusyBeeData;

const STAGE_IMAGES = {
  Seed: 'flower-seed.png',
  Sprout: 'flower-sprout.png',
  Bud: 'flower-bud.png',
  Bloom: 'flower-bloom-pink.png',
};

const CATEGORY_META = [
  { title: 'TECHNICAL SKILLS', label: '</>', mono: true, bg: 'bg-[#EAF0F0]' },
  { title: 'COMMUNICATION', label: '💬', bg: 'bg-[#EAF0F0]' },
  { title: 'CREATIVITY', label: '🎨', bg: 'bg-[#F4ECEC]' },
  { title: 'LIFE & WELLBEING', label: '🌳', bg: 'bg-[#EAF0EA]' },
];

function ProjectPickerModal({ skillName, projects, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F5F3EC] rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-[#2D4A3A]">Add "{skillName}" to a project</h2>
          <button onClick={onClose} className="text-[#6b8275] hover:bg-[#EAF0EA] w-8 h-8 flex items-center justify-center rounded-lg text-xl">×</button>
        </div>
        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#C5D6CC] bg-white hover:bg-[#EAF0EA] text-left transition"
            >
              <span className="text-xl">🏡</span>
              <span className="text-sm font-semibold text-[#2D4A3A]">{p.name}</span>
            </button>
          ))}
          <button
            onClick={() => onSelect(null)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#C5D6CC] hover:bg-[#EAF0EA] text-left transition mt-1"
          >
            <span className="text-xl">🚫</span>
            <span className="text-sm text-[#6b8275]">No project</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SkillMenu({ name, categoryTitle, onEdit, onDelete, onLink }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="text-[#8aa394] hover:text-[#4F6F5E] text-sm px-1 py-0.5 rounded transition"
        title="Options"
      >
        ···
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[#C5D6CC] rounded-xl shadow-lg p-1.5 z-20 w-36">
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="w-full text-xs px-3 py-2 rounded-lg hover:bg-[#EAF0EA] text-[#2D4A3A] text-left flex items-center gap-2"
            >
              ✏️ Rename
            </button>
            <button
              onClick={() => { setOpen(false); onLink(); }}
              className="w-full text-xs px-3 py-2 rounded-lg hover:bg-[#EAF0EA] text-[#2D4A3A] text-left flex items-center gap-2"
            >
              🏡 Add to project
            </button>
            <div className="border-t border-[#EAF0EA] my-1" />
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="w-full text-xs px-3 py-2 rounded-lg hover:bg-red-50 text-red-400 text-left flex items-center gap-2"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AllProjectsModal({ onClose, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
      if (data) setProjects(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F5F3EC] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#dfe7e0]">
          <h2 className="text-lg font-bold text-[#2D4A3A]">🏡 All projects</h2>
          <button onClick={onClose} className="text-[#6b8275] hover:bg-[#EAF0EA] w-8 h-8 flex items-center justify-center rounded-lg text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-sm text-[#8aa394] text-center py-8">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-[#8aa394] text-center py-8">No projects yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onClose(); onSelectProject(p); }}
                  className="bg-white rounded-2xl shadow-sm p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md border border-[#e8e4d9]"
                >
                  <div className="rounded-xl bg-[#ECE9E0] flex items-center justify-center p-2 mb-3">
                    <img
                      src={p.progress >= 100 ? '/house-done.png' : '/house-wip.png'}
                      alt=""
                      className="object-contain"
                      style={{ width: '120px', height: '80px' }}
                    />
                  </div>
                  <div className="font-semibold text-[#2D4A3A] mb-1">{p.name}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 bg-[#cdd8cf] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6f9580] rounded-full" style={{ width: `${p.progress ?? 0}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-[#4a6553]">{p.progress ?? 0}%</span>
                  </div>
                  <div className="text-xs text-[#8aa394]">{p.status ?? 'In Progress'}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const status = progress >= 100 ? 'Completed' : 'In Progress';
    const { data, error } = await supabase
      .from('projects')
      .insert({ name: name.trim(), description: description.trim(), progress, status })
      .select()
      .single();
    if (!error && data) onCreated(data);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F5F3EC] rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#2D4A3A]">🏡 New project</h2>
          <button onClick={onClose} className="text-[#6b8275] hover:bg-[#EAF0EA] w-8 h-8 flex items-center justify-center rounded-lg text-xl">×</button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#4F6F5E] mb-1 block">Project name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Portfolio site"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#C5D6CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#4F6F5E]"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#4F6F5E] mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#C5D6CC] bg-white focus:outline-none focus:ring-1 focus:ring-[#4F6F5E] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#4F6F5E] mb-1 block">Progress — {progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={e => setProgress(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#8aa394] mt-1">
              <span>Just started</span>
              <span>Complete</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="w-full mt-6 bg-[#4F6F5E] text-white py-3 rounded-full font-bold hover:bg-[#3d5a4a] disabled:bg-[#cbd5cd] disabled:text-[#8aa394] transition text-sm"
        >
          {saving ? 'Creating...' : 'Create project'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [projectPicker, setProjectPicker] = useState(null);
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
        data.forEach(m => { if (m.skill && m.stage) stages[m.skill] = m.stage; });
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
    const skillName = newSkillName.trim();
    const { data: projects } = await supabase.from('projects').select('id, name');
    setNewSkillName('');
    setShowAddSkill(null);
    if (projects?.length > 0) {
      setProjectPicker({ skillName, categoryTitle, projects, isNewSkill: true });
    } else {
      await supabase.from('skills').insert({ name: skillName, category: categoryTitle });
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleProjectPickerSelect = async (project) => {
    const { skillName, categoryTitle, isNewSkill } = projectPicker;
    setProjectPicker(null);
    if (isNewSkill) {
      await supabase.from('skills').insert({
        name: skillName,
        category: categoryTitle,
        project_id: project?.id ?? null,
      });
    } else {
      await supabase.from('skills').update({ project_id: project?.id ?? null }).eq('name', skillName);
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditSkill = async (oldName, categoryTitle) => {
    const newName = window.prompt('Rename skill:', oldName);
    if (!newName || newName.trim() === oldName) return;
    const { error } = await supabase
      .from('skills')
      .update({ name: newName.trim() })
      .eq('name', oldName)
      .eq('category', categoryTitle);
    if (!error) setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteSkill = async (name, categoryTitle) => {
    if (!window.confirm(`Delete "${name}"? This won't delete logged moments.`)) return;
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('name', name)
      .eq('category', categoryTitle);
    if (!error) setRefreshTrigger(prev => prev + 1);
  };

  const handleLinkSkillToProject = async (name) => {
    const { data: projects } = await supabase.from('projects').select('id, name');
    if (!projects?.length) { alert('No projects found.'); return; }
    setProjectPicker({ skillName: name, projects, isNewSkill: false });
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
            <div className="flex items-center justify-between mb-3">
  <div className="flex items-center gap-2">
    <span className="text-lg">🏡</span>
    <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A]">PROJECTS</h2>
  </div>
  <button
    onClick={() => setShowAddProject(true)}
    className="text-xs text-[#4F6F5E] hover:underline font-medium"
  >
    + add
  </button>
</div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject({ id: "a1b2c3d4-0000-0000-0000-000000000001", name: "Project Atlas", stage: 100 })}
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
                onClick={() => setSelectedProject({ id: "a1b2c3d4-0000-0000-0000-000000000002", name: "Portfolio Refresh", stage: 65, description: "Portfolio Refresh is a personal site update focused on stronger case studies, clearer visual polish, and a smoother presentation flow." })}
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

            <button onClick={() => setShowAllProjects(true)} className="w-full mt-3 rounded-lg border border-[#b9ccc0] text-[#4F6F5E] text-sm py-2 hover:bg-[#EAF0EA] transition">
  See all projects
</button>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsData.map(cat => (
              <div key={cat.title} className={`${cat.bg} rounded-2xl p-3 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A]">
                    <span className={cat.mono ? 'font-mono' : ''}>{cat.label}</span> {cat.title}
                  </h2>
                  <button onClick={() => setShowAddSkill(cat.title)} className="text-xs text-[#4F6F5E] hover:underline font-medium">
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
                    <button onClick={() => handleAddSkill(cat.title)} className="text-xs px-3 py-1.5 rounded-lg bg-[#4F6F5E] text-white">Add</button>
                    <button onClick={() => { setShowAddSkill(null); setNewSkillName(''); }} className="text-xs px-2 py-1.5 rounded-lg border border-[#C5D6CC] text-[#6b8275]">✕</button>
                  </div>
                )}

                <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center pt-2">
                  {cat.skills.length === 0 ? (
                    <div className="text-xs text-[#8aa394] text-center py-4">No skills yet — add one above</div>
                  ) : (
                    cat.skills.map(name => {
                      const stage = skillStages[name] ?? 'Seed';
                      const img = STAGE_IMAGES[stage] ?? 'flower-seed.png';
                      return (
                        <div key={name} className="flex flex-col items-center text-center w-full gap-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSkill(name)}
                            className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition"
                          >
                            <img src={`/${img}`} alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                            <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">{name}</span>
                            <span className="text-xs text-[#8aa394]">{stage}</span>
                          </button>
                          <SkillMenu
                            name={name}
                            categoryTitle={cat.title}
                            onEdit={() => handleEditSkill(name, cat.title)}
                            onDelete={() => handleDeleteSkill(name, cat.title)}
                            onLink={() => handleLinkSkillToProject(name)}
                          />
                        </div>
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
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">🌱 GROWTH KEY</h2>
            <ul className="flex flex-col gap-3 text-sm">
              {[['🌱','Seed','newly added skill'],['🌿','Sprout','one related micro-win'],['🌷','Bud','applied in a project'],['🌸','Bloom','repeated evidence & reflection']].map(([emoji, label, desc]) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="text-base leading-none">{emoji}</span>
                  <span><span className="font-semibold text-[#2D4A3A]">{label}</span> <span className="text-[#6b8275]">— {desc}</span></span>
                </li>
              ))}
            </ul>
          </div>

        <TodaysMoments onAddMoment={() => setShowMomentModal(true)} refreshTrigger={refreshTrigger} />

          <BalanceCheck refreshTrigger={refreshTrigger} />

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

        {projectPicker && (
          <ProjectPickerModal
            skillName={projectPicker.skillName}
            projects={projectPicker.projects}
            onSelect={handleProjectPickerSelect}
            onClose={() => setProjectPicker(null)}
          />
        )}

      </div>
      {showAllProjects && (
  <AllProjectsModal
    onClose={() => setShowAllProjects(false)}
    onSelectProject={(p) => setSelectedProject(p)}
  />
)}


    </div>
  );
}

export default App;