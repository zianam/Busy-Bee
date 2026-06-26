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
    <div className="min-h-screen bg-stone-50 p-4">

      <TopStatsBar profile={profile} beeDancing={beeDancing} />

      {/* MAIN DASHBOARD BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        <ProjectsPanel projectCategories={projectCategories} />
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skillCategories.map((category) => (
            <SkillCard key={category.id} category={category} onSelectSkill={setSelectedSkill} />
          ))}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        <GrowthKey />
        <div className="lg:col-span-2">
          <TodaysFocus
            microWins={microWins}
            todaysFocus={todaysFocus}
            skillCategories={skillCategories}
            onLogMoment={() => setShowMomentModal(true)}
          />
        </div>
        <BalanceCheck skillCategories={skillCategories} />
      </div>

      <AddMomentBtn onClick={() => setShowMomentModal(true)} />

      {showMomentModal && (
        <MomentModal onClose={() => setShowMomentModal(false)} onConfirm={handleMomentConfirm} />
      )}

      {selectedSkill && (
        <SkillHistory skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}

    </div>
  );
}

export default App;
