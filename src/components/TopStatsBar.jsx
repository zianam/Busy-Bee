import { useState } from 'react';

const skills = [
  { name: 'React', category: 'Technical', stage: 'Bud', moments: 4 },
  { name: 'Debugging', category: 'Technical', stage: 'Bloom', moments: 9 },
  { name: 'API Integration', category: 'Technical', stage: 'Sprout', moments: 2 },
  { name: 'Git', category: 'Technical', stage: 'Seed', moments: 1 },
  { name: 'Presenting', category: 'Communication', stage: 'Bud', moments: 3 },
  { name: 'Teamwork', category: 'Communication', stage: 'Bloom', moments: 7 },
  { name: 'Documentation', category: 'Communication', stage: 'Sprout', moments: 2 },
  { name: 'Feedback', category: 'Communication', stage: 'Seed', moments: 0 },
  { name: 'UI Design', category: 'Creativity', stage: 'Bloom', moments: 8 },
  { name: 'Storytelling', category: 'Creativity', stage: 'Bud', moments: 3 },
  { name: 'Experimentation', category: 'Creativity', stage: 'Seed', moments: 1 },
  { name: 'Ideation', category: 'Creativity', stage: 'Sprout', moments: 2 },
  { name: 'Fitness', category: 'Life & Wellbeing', stage: 'Bud', moments: 3 },
  { name: 'Rest', category: 'Life & Wellbeing', stage: 'Sprout', moments: 2 },
  { name: 'Relationships', category: 'Life & Wellbeing', stage: 'Bloom', moments: 5 },
  { name: 'Hobbies', category: 'Life & Wellbeing', stage: 'Seed', moments: 1 },
];

const stageStyle = {
  Bloom: 'bg-pink-100 text-pink-700',
  Bud: 'bg-teal-100 text-teal-700',
  Sprout: 'bg-green-100 text-green-700',
  Seed: 'bg-stone-100 text-stone-500',
};

export default function TopStatsBar({ beeDancing }) {
  const [showGlance, setShowGlance] = useState(false);

  const projectsDone = 3;
  const momentsLogged = 47;
  const skillsGrown = skills.filter(s => s.stage !== 'Seed').length;
  const totalSkills = skills.length;

  return (
    <>
      <div className="flex items-center gap-4 bg-[#4F6F5E] text-white rounded-2xl px-5 py-3">

        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-xl bg-amber-300 flex items-center justify-center overflow-hidden shrink-0 transition-transform ${beeDancing ? 'animate-bounce' : ''}`}>
            <img src="/bee.png" alt="" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Camari</div>
            <div className="text-xs text-[#cbddd2]">Fall 2026 · Year 1</div>
          </div>
        </div>

        <div className="border-l border-[#3f5b4d] pl-5">
          <div className="text-xs text-[#cbddd2]">Projects</div>
          <div className="font-semibold text-teal-300">{projectsDone} <span className="text-[#cbddd2] font-normal text-xs">done</span></div>
        </div>

        <div className="border-l border-[#3f5b4d] pl-5">
          <div className="text-xs text-[#cbddd2]">Moments logged</div>
          <div className="font-semibold">{momentsLogged}</div>
        </div>

        <div className="border-l border-[#3f5b4d] pl-5">
          <div className="text-xs text-[#cbddd2]">Skills grown</div>
          <div className="font-semibold">{skillsGrown} <span className="text-[#cbddd2] font-normal text-xs">of {totalSkills}</span></div>
        </div>

        <button
          onClick={() => setShowGlance(true)}
          className="ml-auto border border-[#6b8a78] rounded-lg px-4 py-2 text-sm hover:bg-[#3f5b4d] whitespace-nowrap"
        >
          ✦ At a glance
        </button>

      </div>

      {showGlance && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowGlance(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2D4A3A]">At a glance</h2>
              <button onClick={() => setShowGlance(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-teal-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-teal-600">{projectsDone}</div>
                <div className="text-sm text-slate-500 mt-1">Projects completed</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{momentsLogged}</div>
                <div className="text-sm text-slate-500 mt-1">Moments logged</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{skillsGrown}</div>
                <div className="text-sm text-slate-500 mt-1">Skills grown</div>
              </div>
            </div>

            <h3 className="font-semibold text-slate-700 mb-3">All skills</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-500 font-medium">Skill</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Category</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Stage</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Moments</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(skill => (
                  <tr key={skill.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 font-medium text-[#2D4A3A]">{skill.name}</td>
                    <td className="py-2 text-slate-500">{skill.category}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageStyle[skill.stage]}`}>
                        {skill.stage}
                      </span>
                    </td>
                    <td className="py-2 text-slate-500">{skill.moments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}