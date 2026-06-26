import { defaultBusyBeeData, stageLabels, stageEmojis } from './data/busyBeeData';

function buildTimeline(moments) {
  const today = new Date();
  const timeline = [];
  let lastProgress = 0;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const moment = moments.find(m => m.date === dateStr);
    if (moment) lastProgress = moment.progress;

    timeline.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      progress: lastProgress,
      hasActivity: !!moment,
    });
  }
  return timeline;
}

function ProgressChart({ timeline }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 mb-4">30-Day Progression</h3>
      <div className="flex items-end justify-between h-48 gap-1 bg-gradient-to-b from-rose-50 to-white p-4 rounded-lg border border-rose-200">
        {timeline.map((point, idx) => {
          const height = (point.progress / 100) * 100;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative"
              title={`${point.date}: ${stageLabels[point.progress]}`}
            >
              <div
                className={`w-full rounded-t transition-all duration-300 hover:opacity-100 opacity-75 ${point.hasActivity ? 'bg-rose-500' : 'bg-rose-300'}`}
                style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0px' }}
              />
              <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {point.date}: {stageLabels[point.progress]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function HabitGrid({ timeline }) {
  const bgColor = (progress) => {
    if (progress >= 100) return '#fce7f3';
    if (progress >= 75) return '#fbcfe8';
    if (progress >= 50) return '#f9a8d4';
    if (progress >= 25) return '#fda4af';
    return '#ffe4e6';
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Activity</h3>
      <div className="grid grid-cols-7 gap-2">
        {timeline.slice(-28).map((point, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-1 transition-transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: point.hasActivity ? bgColor(point.progress) : '#f3f4f6' }}
            >
              {point.hasActivity ? stageEmojis[point.progress] : '·'}
            </div>
            <div className="text-xs text-gray-500">{point.date.split(' ')[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsPanel({ skillName, skill, timeline }) {
  const improving = timeline[timeline.length - 1].progress > timeline[0].progress;
  const bestProgress = Math.max(...timeline.map(p => p.progress));

  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Insights</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>
          {improving ? '✓' : '→'} You{improving ? "'ve been consistently improving" : "'re building momentum"} in <strong>{skillName}</strong>
        </li>
        <li>✓ Current streak: <strong>{skill.streak} days</strong> of activity</li>
        <li>✓ Best level reached: <strong>{stageLabels[bestProgress]} {stageEmojis[bestProgress]}</strong></li>
      </ul>
    </div>
  );
}

export default function SkillHistory({ skill: skillName, onClose }) {
  const skillData = defaultBusyBeeData.skillCategories
    .flatMap(cat => cat.skills)
    .find(s => s.name === skillName);

  const timeline = buildTimeline(skillData?.moments ?? []);
  const avgProgress = Math.round(timeline.reduce((sum, d) => sum + d.progress, 0) / timeline.length);
  const currentStage = skillData?.stage ?? 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{skillName} Progress Tracker</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded"
          >
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-500">{avgProgress}%</div>
            <div className="text-sm text-gray-600">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-500">{currentStage}%</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl">{stageEmojis[currentStage]}</div>
            <div className="text-sm text-gray-600">{stageLabels[currentStage]}</div>
          </div>
        </div>

        {/* Chart, grid, insights */}
        <div className="flex-1 p-6 overflow-y-auto">
          <ProgressChart timeline={timeline} />
          <HabitGrid timeline={timeline} />
          {skillData && <InsightsPanel skillName={skillName} skill={skillData} timeline={timeline} />}
        </div>

      </div>
    </div>
  );
}
