export default function TopStatsBar({ profile, beeDancing }) {
  const { userName, userTitle, season, water, streak, journeyProgress } = profile;

  return (
    <div className="flex items-center gap-6 bg-slate-900 text-white rounded-2xl px-6 py-4">

      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-amber-300 flex items-center justify-center text-2xl transition-transform ${beeDancing ? 'animate-bounce' : ''}`}>
          🐝
        </div>
        <div>
          <div className="font-bold text-lg leading-tight">{userName}</div>
          <div className="text-xs text-slate-400">{userTitle}</div>
        </div>
      </div>

      <div className="border-l border-slate-700 pl-6">
        <div className="text-xs text-slate-400">Season</div>
        <div className="font-semibold">🌸 {season}</div>
      </div>

      <div className="border-l border-slate-700 pl-6">
        <div className="text-xs text-slate-400">Water</div>
        <div className="font-semibold">💧 {water.current} / {water.goal}</div>
      </div>

      <div className="border-l border-slate-700 pl-6">
        <div className="text-xs text-slate-400">Streak</div>
        <div className="font-semibold">🔥 {streak} days</div>
      </div>

      <div className="border-l border-slate-700 pl-6 flex-1">
        <div className="text-xs text-slate-400">Journey Progress</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400" style={{ width: `${journeyProgress}%` }}></div>
          </div>
          <span className="text-sm font-semibold">{journeyProgress}%</span>
        </div>
      </div>

      <button className="border border-slate-600 rounded-lg px-4 py-2 text-sm hover:bg-slate-800">
        📅 Season Recap
      </button>

    </div>
  );
}
