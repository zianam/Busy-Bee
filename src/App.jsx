import { useState } from 'react';
import { defaultBusyBeeData } from './data/busyBeeData';
import TopStatsBar from './components/TopStatsBar';
import ProjectsPanel from './components/ProjectsPanel';
import SkillCard from './components/skillCard';
import GrowthKey from './components/GrowthKey';
import TodaysFocus from './components/TodaysFocus';
import BalanceCheck from './components/BalanceCheck';
import MomentModal from './components/MomentModal';
import SkillHistory from './components/SkillHistory';
import AddMomentBtn from './components/AddMomentBtn';

const { profile, skillCategories, projectCategories, microWins, todaysFocus } = defaultBusyBeeData;

function App() {
  const [showMomentModal, setShowMomentModal] = useState(false);
  const [beeDancing, setBeeDancing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const handleMomentConfirm = (momentData) => {
    setBeeDancing(true);
    setTimeout(() => setBeeDancing(false), 1500);
    console.log('Moment saved:', momentData);
    setShowMomentModal(false);
  };

  return (
    <div className="min-h-screen bg-[#DCE8E0]">
      <div className="w-full px-6 py-4">

      {/* TOgiotP STATS BAR */}
      <div className="flex items-center gap-4 bg-[#4F6F5E] text-white rounded-2xl px-5 py-3">

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-xl bg-amber-300 flex items-center justify-center overflow-hidden shrink-0 transition-transform ${beeDancing ? 'animate-bounce' : ''}`}>
            <img src="/bee.png" alt="" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Camari</div>
            <div className="text-xs text-[#cbddd2]">Bee Gardener</div>
          </div>
        </div>

        {/* Season */}
        <div className="border-l border-[#3f5b4d] pl-6">
          <div className="text-xs text-[#cbddd2]">Season</div>
          <div className="font-semibold">🌸 Spring 2026</div>
        </div>

        {/* Water */}
        <div className="border-l border-[#3f5b4d] pl-6">
          <div className="text-xs text-[#cbddd2]">Water</div>
          <div className="font-semibold">💧 3 / 5</div>
        </div>

        {/* Streak */}
        <div className="border-l border-[#3f5b4d] pl-6">
          <div className="text-xs text-[#cbddd2]">Streak</div>
          <div className="font-semibold">🔥 8 days</div>
        </div>

        {/* Journey progress */}
        <div className="border-l border-[#3f5b4d] pl-6 flex-1">
          <div className="text-xs text-[#cbddd2]">Journey Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[#3f5b4d] rounded-full overflow-hidden">
              <div className="h-full bg-[#7a9a87]" style={{ width: "64%" }}></div>
            </div>
            <span className="text-sm font-semibold">64%</span>
          </div>
        </div>

        {/* Recap button */}
        <button className="border border-[#6b8a78] rounded-lg px-4 py-2 text-sm hover:bg-[#3f5b4d]">
          📅 Season Recap
        </button>

      </div>

      {/* MAIN DASHBOARD BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3">

        {/* Left column: Projects (~25%) */}
        <div className="lg:col-span-1 bg-[#F5F3EC] rounded-2xl p-3">

          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏡</span>
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A]">PROJECTS</h2>
          </div>

          {/* Project cards */}
          <div className="flex flex-col gap-3">

            {/* Card 1: Project Atlas (complete) */}
            <div className="relative bg-[#F5F3EC] rounded-2xl shadow-md p-3">
              {/* Completed badge */}
              <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-[#6f9580] flex items-center justify-center text-white text-xs shadow">
                ✓
              </div>
              {/* Image placeholder */}
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
            </div>

            {/* Card 2: Portfolio Refresh */}
            <div className="relative bg-[#F5F3EC] rounded-2xl shadow-md p-3">
              {/* Image placeholder */}
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
            </div>

          </div>

          {/* See all projects */}
          <button className="w-full mt-3 rounded-lg border border-[#b9ccc0] text-[#4F6F5E] text-sm py-2 hover:bg-[#EAF0EA] transition">
            See all projects
          </button>
        </div>

        {/* Right area: 2x2 grid of skill category cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Technical Skills */}
          <div className="bg-[#EAF0F0] rounded-2xl p-3 shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">
              <span className="font-mono">&lt;/&gt;</span> TECHNICAL SKILLS
            </h2>
            <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center pt-4">

              <button type="button" onClick={() => setSelectedSkill('React')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bud.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">React</span>
                <span className="text-xs text-[#8aa394]">Bud</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Debugging')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bloom-purple.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Debugging</span>
                <span className="text-xs text-[#8aa394]">Bloom</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('API Integration')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-sprout.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">API Integration</span>
                <span className="text-xs text-[#8aa394]">Sprout</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Git')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-seed.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Git</span>
                <span className="text-xs text-[#8aa394]">Seed</span>
              </button>

            </div>
          </div>

          {/* Communication Skills */}
          <div className="bg-[#EAF0F0] rounded-2xl p-3 shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">
              💬 COMMUNICATION
            </h2>
            <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center pt-4">

              <button type="button" onClick={() => setSelectedSkill('Presenting')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bud.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Presenting</span>
                <span className="text-xs text-[#8aa394]">Bud</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Teamwork')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bloom-purple.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Teamwork</span>
                <span className="text-xs text-[#8aa394]">Bloom</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Documentation')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-sprout.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Documentation</span>
                <span className="text-xs text-[#8aa394]">Sprout</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Feedback')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-seed.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Feedback</span>
                <span className="text-xs text-[#8aa394]">Seed</span>
              </button>

            </div>
          </div>

          {/* Creativity Skills */}
          <div className="bg-[#F4ECEC] rounded-2xl p-3 shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">
              🎨 CREATIVITY
            </h2>
            <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center pt-4">

              <button type="button" onClick={() => setSelectedSkill('UI Design')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bloom-pink.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">UI Design</span>
                <span className="text-xs text-[#8aa394]">Bloom</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Storytelling')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bud.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Storytelling</span>
                <span className="text-xs text-[#8aa394]">Bud</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Experimentation')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-seed.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Experimentation</span>
                <span className="text-xs text-[#8aa394]">Seed</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Ideation')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-sprout.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Ideation</span>
                <span className="text-xs text-[#8aa394]">Sprout</span>
              </button>

            </div>
          </div>

          {/* Life & Wellbeing Skills */}
          <div className="bg-[#EAF0EA] rounded-2xl p-3 shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">
              🌳 LIFE & WELLBEING
            </h2>
            <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center pt-4">

              <button type="button" onClick={() => setSelectedSkill('Fitness')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bud.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Fitness</span>
                <span className="text-xs text-[#8aa394]">Bud</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Rest')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-sprout.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Rest</span>
                <span className="text-xs text-[#8aa394]">Sprout</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Relationships')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-bloom-red.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Relationships</span>
                <span className="text-xs text-[#8aa394]">Bloom</span>
              </button>

              <button type="button" onClick={() => setSelectedSkill('Hobbies')} className="flex flex-col items-center text-center w-full gap-0.5 cursor-pointer hover:opacity-75 transition">
                <img src="/flower-seed.png" alt="" className="object-contain mx-auto" style={{ width: '80px', height: '80px' }} />
                <span className="text-sm font-semibold text-[#2D4A3A] text-center leading-tight h-10 flex items-center justify-center">Hobbies</span>
                <span className="text-xs text-[#8aa394]">Seed</span>
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3">

        {/* Growth Key */}
        <div className="bg-[#F5F3EC] rounded-2xl shadow-sm p-3">
          <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">🌱 GROWTH KEY</h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌱</span>
              <span><span className="font-semibold text-[#2D4A3A]">Seed</span> <span className="text-[#6b8275]">— newly added skill</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌿</span>
              <span><span className="font-semibold text-[#2D4A3A]">Sprout</span> <span className="text-[#6b8275]">— one related micro-win</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌷</span>
              <span><span className="font-semibold text-[#2D4A3A]">Bud</span> <span className="text-[#6b8275]">— applied in a project</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌸</span>
              <span><span className="font-semibold text-[#2D4A3A]">Bloom</span> <span className="text-[#6b8275]">— repeated evidence &amp; reflection</span></span>
            </li>
          </ul>
        </div>

        {/* Today's Focus */}
        <div className="lg:col-span-2 bg-[#F5F3EC] rounded-2xl shadow-sm p-3">
          <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">✅ TODAY'S FOCUS</h2>
          <ul className="flex flex-col gap-2 text-sm">

            <li className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-[#7a9a87]" />
              <span className="font-medium text-[#2D4A3A]">Finish login flow</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#dde7e2] text-[#2D4A3A]">Technical</span>
              <a href="#" className="ml-auto text-xs text-[#4F6F5E] hover:underline whitespace-nowrap">+ Log as a Moment</a>
            </li>

            <li className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-[#7a9a87]" />
              <span className="font-medium text-[#2D4A3A]">Practice project presentation</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#dde7e2] text-[#2D4A3A]">Communication</span>
              <a href="#" className="ml-auto text-xs text-[#4F6F5E] hover:underline whitespace-nowrap">+ Log as a Moment</a>
            </li>

            <li className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-[#7a9a87]" />
              <span className="font-medium text-[#2D4A3A]">Go to the gym</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#dde7e2] text-[#2D4A3A]">Life & Wellbeing</span>
              <a href="#" className="ml-auto text-xs text-[#4F6F5E] hover:underline whitespace-nowrap">+ Log as a Moment</a>
            </li>

          </ul>
        </div>

        {/* Balance Check */}
        <div className="bg-[#F5F3EC] rounded-2xl shadow-sm p-3">
          <h2 className="text-sm font-bold tracking-wide text-[#2D4A3A] mb-2">⚖️ BALANCE CHECK</h2>
          <div className="flex flex-col gap-2 text-sm">

            <div className="flex items-center justify-between">
              <span className="text-[#2D4A3A]">Technical</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#2D4A3A]">Communication</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#2D4A3A]">Creativity</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#2D4A3A]">Life & Wellbeing</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#7a9a87]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
                <span className="w-2 h-2 rounded-full bg-[#cdd8cf]"></span>
              </div>
            </div>

          </div>

          {/* AI Insight */}
          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-[#4a6553]">
            <span className="font-semibold text-amber-700">✨ AI Insight:</span> You've leaned into Technical work lately — consider a small Creativity moment this week to keep your garden balanced.
          </div>
        </div>

      </div>

      <AddMomentBtn onClick={() => setShowMomentModal(true)} />

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
