import React from "react";

export default function SkillDetail({ skill, onBack }) {
  if (!skill) return null;

  const history = skill.progressHistory || [];
  const max = Math.max(...history, 100);

  // Build simple polyline points for SVG chart
  const points = history
    .map((v, i) => {
      const x = (i / Math.max(history.length - 1, 1)) * 100;
      const y = 100 - (v / max) * 100; // invert y for SVG
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-start gap-6">
          <button onClick={onBack} className="text-sm text-teal-600 px-3 py-2 rounded hover:bg-teal-50">← Back</button>

          <div className="flex-1 flex items-center gap-6">
            <div className="w-36 h-36 bg-emerald-50 rounded-xl flex items-center justify-center text-6xl">🌼</div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{skill.title}</h1>
              <div className="mt-2 text-sm text-gray-500">{skill.description}</div>

              <div className="mt-4 flex items-center gap-4">
                <div className="text-xs text-gray-400">Level</div>
                <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">{skill.level}</div>

                <div className="ml-6 text-xs text-gray-400">Progress</div>
                <div className="flex items-center gap-2 w-48">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${skill.progress}%` }}></div>
                  </div>
                  <div className="text-sm font-semibold">{skill.progress}%</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Body: chart + moments + evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Progress over time</h3>
            <div className="w-full h-48 bg-white rounded-lg p-3 border border-gray-100">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  points={points}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Fill under curve */}
                <polygon
                  points={`${points} 100,100 0,100`}
                  fill="#a7f3d0"
                  opacity="0.12"
                />
              </svg>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Moments</h4>
              <ul className="flex flex-col gap-3">
                <li className="bg-white p-3 rounded-lg border">Fixed the authentication bug — June 25, 2026</li>
                <li className="bg-white p-3 rounded-lg border">Understood full auth flow — June 23, 2026</li>
                <li className="bg-white p-3 rounded-lg border">Recovered from merge conflict — June 20, 2026</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Evidence</h4>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border p-3 text-sm">GitHub Commit</div>
              <div className="rounded-lg border p-3 text-sm">Working Login Screenshot</div>
              <div className="rounded-lg border p-3 text-sm">Final Presentation Deck</div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
              <p className="text-sm text-gray-500">This page is a front-end mock for the skill detail. Later we will replace the SVG with a graph that reads real task data.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
