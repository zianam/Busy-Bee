import { useState } from "react";
import SkillDetail from "./SkillDetail";

const SKILLS = {
  technical: [
    { id: "debugging", title: "Debugging", emoji: "🌸", level: "Bloom", progress: 78, category: "Technical", description: "Isolating and fixing issues in code methodically.", progressHistory: [10, 18, 22, 30, 38, 45, 50, 55, 62, 70, 74, 78], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [{ type:"Micro-Win", emoji:"🌿", label:"Fixed the authentication bug", date:"June 25, 2026", skills:["Debugging","API Integration"] },{ type:"Breakthrough", emoji:"💡", label:"Understood the full auth flow", date:"June 23, 2026", skills:["APIs","React"] },{ type:"Hardship", emoji:"🪨", label:"Recovered from a merge conflict", date:"June 20, 2026", skills:["Git","Teamwork"] }], evidence: [{ id:1, type:"github", label:"GitHub Commit", icon:"🔗", color:"bg-slate-800 text-white", meta:"auth-fix · Jun 25" },{ id:2, type:"screenshot", label:"Working Login Screenshot", icon:"🖼️", color:"bg-sky-50 text-sky-800", meta:"login-success.png" },{ id:3, type:"deck", label:"Final Presentation Deck", icon:"📊", color:"bg-rose-50 text-rose-800", meta:"Project Atlas · Jun 24" }] },
    { id: "react", title: "React", emoji: "🌸", level: "Bud", progress: 52, category: "Technical", description: "Building component-based UIs with React hooks and state.", progressHistory: [5,10,18,24,30,36,40,45,48,50,52,52], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [{ type:"Micro-Win", emoji:"🌿", label:"Built first custom hook", date:"June 18, 2026", skills:["React"] }], evidence: [] },
    { id: "api", title: "API Integration", emoji: "🌸", level: "Bloom", progress: 65, category: "Technical", description: "Connecting frontends to backend services and third-party APIs.", progressHistory: [8,15,20,28,35,40,45,50,55,60,63,65], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [], evidence: [] },
    { id: "git", title: "Git", emoji: "🌸", level: "Seed", progress: 20, category: "Technical", description: "Version control, branching, merging, and collaboration.", progressHistory: [2,5,8,10,12,14,16,17,18,19,20,20], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [], evidence: [] },
  ],
  communication: [
    { id: "presenting", title: "Presenting", emoji: "🌸", level: "Bud", progress: 55, category: "Communication", description: "Sharing ideas clearly and confidently to an audience.", progressHistory: [10,20,30,35,40,44,48,50,52,53,54,55], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [], evidence: [] },
    { id: "teamwork", title: "Teamwork", emoji: "🌸", level: "Bloom", progress: 80, category: "Communication", description: "Collaborating, communicating blockers, and supporting peers.", progressHistory: [20,30,40,50,55,60,65,70,72,75,78,80], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [], evidence: [] },
    { id: "docs", title: "Documentation", emoji: "🌸", level: "Sprout", progress: 35, category: "Communication", description: "Writing clear READMEs, comments, and project summaries.", progressHistory: [5,10,15,18,22,25,28,30,32,33,34,35], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments: [], evidence: [] },
  ],
};

const flowerSizes = { Seed: "text-lg", Sprout: "text-2xl", Bud: "text-3xl", Bloom: "text-4xl" };

function FlowerSkill({ skill, onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer group"
      onClick={() => onClick(skill)}
    >
      <span className={`${flowerSizes[skill.level] || "text-3xl"} transition-transform group-hover:scale-125 group-hover:drop-shadow-md`}>
        {skill.emoji}
      </span>
      <span className="text-sm font-medium text-gray-800">{skill.title}</span>
      <span className="text-xs text-gray-400">{skill.level}</span>
    </div>
  );
}

function App() {
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (selectedSkill) {
    return <SkillDetail skill={selectedSkill} onBack={() => setSelectedSkill(null)} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4">

      {/* TOP STATS BAR */}
      <div className="flex items-center gap-6 bg-slate-900 text-white rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-300 flex items-center justify-center text-2xl">🐝</div>
          <div>
            <div className="font-bold text-lg leading-tight">Camari</div>
            <div className="text-xs text-slate-400">Bee Gardener</div>
          </div>
        </div>
        <div className="border-l border-slate-700 pl-6">
          <div className="text-xs text-slate-400">Season</div>
          <div className="font-semibold">🌸 Spring 2026</div>
        </div>
        <div className="border-l border-slate-700 pl-6">
          <div className="text-xs text-slate-400">Water</div>
          <div className="font-semibold">💧 3 / 5</div>
        </div>
        <div className="border-l border-slate-700 pl-6">
          <div className="text-xs text-slate-400">Streak</div>
          <div className="font-semibold">🔥 8 days</div>
        </div>
        <div className="border-l border-slate-700 pl-6 flex-1">
          <div className="text-xs text-slate-400">Journey Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400" style={{ width: "64%" }}></div>
            </div>
            <span className="text-sm font-semibold">64%</span>
          </div>
        </div>
        <button className="border border-slate-600 rounded-lg px-4 py-2 text-sm hover:bg-slate-800">📅 Season Recap</button>
      </div>

      {/* MAIN DASHBOARD BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">

        {/* Left column: Projects */}
        <div className="lg:col-span-1 bg-gray-200 rounded-2xl p-4 min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏡</span>
            <h2 className="text-sm font-bold tracking-wide text-gray-700">PROJECTS</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative bg-white rounded-2xl shadow-md p-3">
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shadow">✓</div>
              <div className="h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">🏠</div>
              <div className="mt-3 font-semibold text-gray-800">Project Atlas</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "100%" }}></div>
                </div>
                <span className="text-xs font-semibold text-gray-600">100%</span>
              </div>
            </div>
            <div className="relative bg-white rounded-2xl shadow-md p-3">
              <div className="h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">🏠</div>
              <div className="mt-3 font-semibold text-gray-800">Portfolio Refresh</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: "65%" }}></div>
                </div>
                <span className="text-xs font-semibold text-gray-600">65%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right area: skill category cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Technical Skills */}
          <div className="bg-blue-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-1">
              <span className="font-mono">&lt;/&gt;</span> TECHNICAL SKILLS
            </h2>
            <p className="text-xs text-gray-400 mb-4">Click a flower to see your journey →</p>
            <div className="flex justify-around">
              {SKILLS.technical.map((s) => (
                <FlowerSkill key={s.id} skill={s} onClick={setSelectedSkill} />
              ))}
            </div>
          </div>

          {/* Communication Skills */}
          <div className="bg-blue-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-1">💬 COMMUNICATION</h2>
            <p className="text-xs text-gray-400 mb-4">Click a flower to see your journey →</p>
            <div className="flex justify-around">
              {SKILLS.communication.map((s) => (
                <FlowerSkill key={s.id} skill={s} onClick={setSelectedSkill} />
              ))}
            </div>
          </div>

          {/* Creativity Skills */}
          <div className="bg-purple-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-1">🎨 CREATIVITY</h2>
            <p className="text-xs text-gray-400 mb-4">Click a flower to see your journey →</p>
            <div className="flex justify-around">
              {[{ id:"design", title:"Design", emoji:"🌸", level:"Bud" }, { id:"exp", title:"Experimentation", emoji:"🌸", level:"Seed" }].map((s) => (
                <FlowerSkill key={s.id} skill={{ ...s, progress: 40, category: "Creativity", description: "", progressHistory: [5,10,15,20,25,28,30,33,35,38,39,40], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments:[], evidence:[] }} onClick={setSelectedSkill} />
              ))}
            </div>
          </div>

          {/* Life & Wellbeing */}
          <div className="bg-green-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-1">🌳 LIFE & WELLBEING</h2>
            <p className="text-xs text-gray-400 mb-4">Click a flower to see your journey →</p>
            <div className="flex justify-around">
              {[{ id:"fitness", title:"Fitness", emoji:"🌸", level:"Bud" }, { id:"rest", title:"Rest", emoji:"🌸", level:"Sprout" }, { id:"rel", title:"Relationships", emoji:"🌸", level:"Bloom" }, { id:"hobbies", title:"Hobbies", emoji:"🌸", level:"Seed" }].map((s) => (
                <FlowerSkill key={s.id} skill={{ ...s, progress: 50, category: "Life & Wellbeing", description: "", progressHistory: [10,15,20,25,30,35,38,40,43,45,48,50], historyLabels: ["Jun 1","Jun 3","Jun 5","Jun 7","Jun 9","Jun 11","Jun 13","Jun 15","Jun 17","Jun 19","Jun 22","Jun 25"], moments:[], evidence:[] }} onClick={setSelectedSkill} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">🌱 GROWTH KEY</h2>
          <ul className="flex flex-col gap-3 text-sm">
            {[["🌱","Seed","newly added skill"],["🌿","Sprout","one related micro-win"],["🌷","Bud","applied in a project"],["🌸","Bloom","repeated evidence & reflection"]].map(([e,n,d]) => (
              <li key={n} className="flex items-start gap-2">
                <span className="text-base leading-none">{e}</span>
                <span><span className="font-semibold text-gray-800">{n}</span> <span className="text-gray-500">— {d}</span></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">✅ TODAY'S FOCUS</h2>
          <ul className="flex flex-col gap-3 text-sm">
            {[["Finish login flow","Technical","bg-blue-100 text-blue-700"],["Practice project presentation","Communication","bg-blue-100 text-blue-700"],["Go to the gym","Life & Wellbeing","bg-green-100 text-green-700"]].map(([task,cat,cls]) => (
              <li key={task} className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 accent-teal-500" />
                <span className="font-medium text-gray-800">{task}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{cat}</span>
                <a href="#" className="ml-auto text-xs text-teal-600 hover:underline whitespace-nowrap">+ Log as a Moment</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">⚖️ BALANCE CHECK</h2>
          <div className="flex flex-col gap-2 text-sm">
            {[["Technical",4],["Communication",3],["Creativity",2],["Life & Wellbeing",3]].map(([cat,n]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-gray-700">{cat}</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i <= n ? "bg-teal-500" : "bg-gray-200"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-gray-600">
            <span className="font-semibold text-amber-700">✨ AI Insight:</span> You've leaned into Technical work lately — consider a small Creativity moment this week to keep your garden balanced.
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-rose-500 text-white font-bold px-6 py-4 shadow-lg shadow-rose-500/50 hover:bg-rose-600 transition">
        <span className="text-2xl leading-none">+</span>
        <span className="text-sm tracking-wide">ADD MOMENT</span>
      </button>

    </div>
  );
}

export default App;
