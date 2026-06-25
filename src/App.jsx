function App() {
  return (
    <div className="min-h-screen bg-stone-50 p-4">

      {/* TOP STATS BAR */}
      <div className="flex items-center gap-6 bg-slate-900 text-white rounded-2xl px-6 py-4">

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-300 flex items-center justify-center text-2xl">
            🐝
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Camari</div>
            <div className="text-xs text-slate-400">Bee Gardener</div>
          </div>
        </div>

        {/* Season */}
        <div className="border-l border-slate-700 pl-6">
          <div className="text-xs text-slate-400">Season</div>
          <div className="font-semibold">🌸 Spring 2026</div>
        </div>

        {/* Water */}
        <div className="border-l border-slate-700 pl-6">
          <div className="text-xs text-slate-400">Water</div>
          <div className="font-semibold">💧 3 / 5</div>
        </div>

        {/* Streak */}
        <div className="border-l border-slate-700 pl-6">
          <div className="text-xs text-slate-400">Streak</div>
          <div className="font-semibold">🔥 8 days</div>
        </div>

        {/* Journey progress */}
        <div className="border-l border-slate-700 pl-6 flex-1">
          <div className="text-xs text-slate-400">Journey Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400" style={{ width: "64%" }}></div>
            </div>
            <span className="text-sm font-semibold">64%</span>
          </div>
        </div>

        {/* Recap button */}
        <button className="border border-slate-600 rounded-lg px-4 py-2 text-sm hover:bg-slate-800">
          📅 Season Recap
        </button>

      </div>

      {/* MAIN DASHBOARD BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">

        {/* Left column: Projects (~25%) */}
        <div className="lg:col-span-1 bg-gray-200 rounded-2xl p-4 min-h-[400px]">

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏡</span>
            <h2 className="text-sm font-bold tracking-wide text-gray-700">PROJECTS</h2>
          </div>

          {/* Project cards */}
          <div className="flex flex-col gap-4">

            {/* Card 1: Project Atlas (complete) */}
            <div className="relative bg-white rounded-2xl shadow-md p-3">
              {/* Completed badge */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shadow">
                ✓
              </div>
              {/* Image placeholder */}
              <div className="h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">
                🏠
              </div>
              <div className="mt-3 font-semibold text-gray-800">Project Atlas</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "100%" }}></div>
                </div>
                <span className="text-xs font-semibold text-gray-600">100%</span>
              </div>
            </div>

            {/* Card 2: Portfolio Refresh */}
            <div className="relative bg-white rounded-2xl shadow-md p-3">
              {/* Image placeholder */}
              <div className="h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">
                🏠
              </div>
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

        {/* Right area: 2x2 grid of skill category cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Technical Skills */}
          <div className="bg-blue-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-4">
              <span className="font-mono">&lt;/&gt;</span> TECHNICAL SKILLS
            </h2>
            <div className="flex justify-around">

              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">React</span>
                <span className="text-xs text-gray-400">Bud</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Debugging</span>
                <span className="text-xs text-gray-400">Bloom</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">API Integration</span>
                <span className="text-xs text-gray-400">Sprout</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">🌸</span>
                <span className="text-sm font-medium text-gray-800">Git</span>
                <span className="text-xs text-gray-400">Seed</span>
              </div>

            </div>
          </div>

          {/* Communication Skills */}
          <div className="bg-blue-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-4">
              💬 COMMUNICATION
            </h2>
            <div className="flex justify-around">

              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Presenting</span>
                <span className="text-xs text-gray-400">Bud</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Teamwork</span>
                <span className="text-xs text-gray-400">Bloom</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Documentation</span>
                <span className="text-xs text-gray-400">Sprout</span>
              </div>

            </div>
          </div>

          {/* Creativity Skills */}
          <div className="bg-pink-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-4">
              🎨 CREATIVITY
            </h2>
            <div className="flex justify-around">

              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">UI Design</span>
                <span className="text-xs text-gray-400">Bloom</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Storytelling</span>
                <span className="text-xs text-gray-400">Bud</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">🌸</span>
                <span className="text-sm font-medium text-gray-800">Experimentation</span>
                <span className="text-xs text-gray-400">Seed</span>
              </div>

            </div>
          </div>

          {/* Life & Wellbeing Skills */}
          <div className="bg-green-50 rounded-2xl p-4 min-h-[190px] shadow-sm">
            <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-4">
              🌳 LIFE & WELLBEING
            </h2>
            <div className="flex justify-around">

              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Fitness</span>
                <span className="text-xs text-gray-400">Bud</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Rest</span>
                <span className="text-xs text-gray-400">Sprout</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">🌸</span>
                <span className="text-sm font-medium text-gray-800">Relationships</span>
                <span className="text-xs text-gray-400">Bloom</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">🌸</span>
                <span className="text-sm font-medium text-gray-800">Hobbies</span>
                <span className="text-xs text-gray-400">Seed</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">

        {/* Growth Key */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">🌱 GROWTH KEY</h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌱</span>
              <span><span className="font-semibold text-gray-800">Seed</span> <span className="text-gray-500">— newly added skill</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌿</span>
              <span><span className="font-semibold text-gray-800">Sprout</span> <span className="text-gray-500">— one related micro-win</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌷</span>
              <span><span className="font-semibold text-gray-800">Bud</span> <span className="text-gray-500">— applied in a project</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base leading-none">🌸</span>
              <span><span className="font-semibold text-gray-800">Bloom</span> <span className="text-gray-500">— repeated evidence &amp; reflection</span></span>
            </li>
          </ul>
        </div>

        {/* Today's Focus */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">✅ TODAY'S FOCUS</h2>
          <ul className="flex flex-col gap-3 text-sm">

            <li className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-teal-500" />
              <span className="font-medium text-gray-800">Finish login flow</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Technical</span>
              <a href="#" className="ml-auto text-xs text-teal-600 hover:underline whitespace-nowrap">+ Log as a Moment</a>
            </li>

            <li className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-teal-500" />
              <span className="font-medium text-gray-800">Practice project presentation</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Communication</span>
              <a href="#" className="ml-auto text-xs text-teal-600 hover:underline whitespace-nowrap">+ Log as a Moment</a>
            </li>

            <li className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-teal-500" />
              <span className="font-medium text-gray-800">Go to the gym</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Life & Wellbeing</span>
              <a href="#" className="ml-auto text-xs text-teal-600 hover:underline whitespace-nowrap">+ Log as a Moment</a>
            </li>

          </ul>
        </div>

        {/* Balance Check */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">⚖️ BALANCE CHECK</h2>
          <div className="flex flex-col gap-2 text-sm">

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Technical</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Communication</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Creativity</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Life & Wellbeing</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
              </div>
            </div>

          </div>

          {/* AI Insight */}
          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-gray-600">
            <span className="font-semibold text-amber-700">✨ AI Insight:</span> You've leaned into Technical work lately — consider a small Creativity moment this week to keep your garden balanced.
          </div>
        </div>

      </div>

      {/* ADD MOMENT BUTTON */}
      <button
        className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-rose-500 text-white font-bold px-6 py-4 shadow-lg shadow-rose-500/50 hover:bg-rose-600 transition"
      >
        <span className="text-2xl leading-none">+</span>
        <span className="text-sm tracking-wide">ADD MOMENT</span>
      </button>

    </div>
  )
}

export default App
