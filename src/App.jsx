import { useEffect, useMemo, useState } from "react";
import { isFirebaseConfigured } from "./firebase";
import { flowerTypes, houseTypes, stageLabels } from "./data/busyBeeData";
import {
  loadBusyBeeData,
  saveBusyBeeData,
  updateMicroWinStatus,
} from "./services/busyBeeStore";

const stageToFlowerSize = {
  0: "text-lg",
  25: "text-2xl",
  50: "text-3xl",
  75: "text-4xl",
  100: "text-4xl",
};

const categoryBadgeClasses = {
  technical: "bg-sky-100 text-sky-700",
  communication: "bg-blue-100 text-blue-700",
  creativity: "bg-rose-100 text-rose-700",
  "life-wellbeing": "bg-emerald-100 text-emerald-700",
};

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [status, setStatus] = useState("Loading dashboard...");

  useEffect(() => {
    let isMounted = true;

    loadBusyBeeData()
      .then((data) => {
        if (!isMounted) return;
        setDashboardData(data);
        setStatus(
          isFirebaseConfigured
            ? "Synced with Firebase"
            : "Using local demo data until Firebase env vars are set",
        );
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus(`Could not load dashboard: ${error.message}`);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryMap = useMemo(() => {
    if (!dashboardData) return {};

    return Object.fromEntries(
      dashboardData.skillCategories.map((category) => [category.id, category]),
    );
  }, [dashboardData]);

  const todaysFocus = useMemo(() => {
    if (!dashboardData) return [];

    const winsById = Object.fromEntries(
      dashboardData.microWins.map((item) => [item.id, item]),
    );

    return dashboardData.todaysFocus
      .map((id) => winsById[id])
      .filter(Boolean);
  }, [dashboardData]);

  const journeyProgress = useMemo(() => {
    if (!dashboardData) return 0;

    const skillStages = dashboardData.skillCategories.flatMap((category) =>
      category.skills.map((skill) => skill.stage),
    );
    const projectStages = dashboardData.projectCategories.flatMap((category) =>
      category.projects.map((project) => project.stage),
    );
    const allStages = [...skillStages, ...projectStages];

    return Math.round(
      allStages.reduce((total, stage) => total + stage, 0) / allStages.length,
    );
  }, [dashboardData]);

  const affirmation = useMemo(() => {
    if (!dashboardData) return "";
    return dashboardData.profile.affirmations[0] ?? "";
  }, [dashboardData]);

  const handleToggleMicroWin = async (microWinId, completed) => {
    const nextData = updateMicroWinStatus(dashboardData, microWinId, completed);
    setDashboardData(nextData);
    setStatus("Saving...");

    try {
      await saveBusyBeeData(nextData);
      setStatus(isFirebaseConfigured ? "Saved to Firebase" : "Saved locally");
    } catch (error) {
      setDashboardData(dashboardData);
      setStatus(`Save failed: ${error.message}`);
    }
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-stone-50 p-4 text-slate-800">
        {status}
      </div>
    );
  }

  const { profile, projectCategories, skillCategories } = dashboardData;

  return (
    <div className="min-h-screen bg-stone-50 p-4 pb-28">
      <div className="flex flex-col gap-4 rounded-lg bg-slate-900 px-4 py-4 text-white lg:flex-row lg:items-center lg:gap-6 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-2xl">
            🐝
          </div>
          <div>
            <div className="text-lg font-bold leading-tight">{profile.displayName}</div>
            <div className="text-xs text-slate-400">{profile.subtitle}</div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4 lg:flex lg:items-center lg:gap-6">
          <div className="lg:border-l lg:border-slate-700 lg:pl-6">
            <div className="text-xs text-slate-400">Season</div>
            <div className="font-semibold">🌸 {profile.season}</div>
          </div>

          <div className="lg:border-l lg:border-slate-700 lg:pl-6">
            <div className="text-xs text-slate-400">Water</div>
            <div className="font-semibold">
              💧 {profile.water.current} / {profile.water.goal}
            </div>
          </div>

          <div className="lg:border-l lg:border-slate-700 lg:pl-6">
            <div className="text-xs text-slate-400">Streak</div>
            <div className="font-semibold">
              🔥 {profile.streak} {profile.streak === 1 ? "day" : "days"}
            </div>
            <div className="text-[11px] capitalize text-slate-500">
              {profile.streakSchedule}
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 lg:min-w-56 lg:flex-1 lg:border-l lg:border-slate-700 lg:pl-6">
            <div className="text-xs text-slate-400">Journey Progress</div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full bg-teal-400"
                  style={{ width: `${journeyProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{journeyProgress}%</span>
            </div>
          </div>
        </div>

        <button className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800">
          📅 Season Recap
        </button>
      </div>

      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <span className="font-semibold">Affirmation:</span> {affirmation}
        <span className="ml-3 text-xs text-amber-700">{status}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="min-h-[400px] rounded-lg bg-gray-200 p-4 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">🏡</span>
            <h2 className="text-sm font-bold tracking-wide text-gray-700">PROJECTS</h2>
          </div>

          <div className="flex flex-col gap-4">
            {projectCategories.flatMap((category) =>
              category.projects.map((project) => {
                const houseType = houseTypes[project.houseType];

                return (
                  <div key={project.id} className="relative rounded-lg bg-white p-3 shadow-md">
                    {project.stage === 100 && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white shadow">
                        ✓
                      </div>
                    )}
                    <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-4xl">
                      🏠
                    </div>
                    <div className="mt-3 font-semibold text-gray-800">{project.name}</div>
                    <div className="text-xs text-gray-500">{houseType?.name}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${project.stage}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        {project.stage}%
                      </span>
                    </div>
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
          {skillCategories.map((category) => (
            <div
              key={category.id}
              className={`${category.colorClass} min-h-[190px] rounded-lg p-4 shadow-sm`}
            >
              <h2 className="mb-4 text-sm font-bold tracking-wide text-gray-700">
                {category.icon} {category.name.toUpperCase()}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:flex sm:justify-around">
                {category.skills.map((skill) => {
                  const flowerType = flowerTypes[skill.flowerType];

                  return (
                    <div key={skill.id} className="flex flex-col items-center gap-1 text-center">
                      <span className={stageToFlowerSize[skill.stage]}>🌸</span>
                      <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                      <span className="text-xs text-gray-400">
                        {stageLabels[skill.stage]} · {flowerType?.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-gray-700">🌱 GROWTH KEY</h2>
          <ul className="flex flex-col gap-3 text-sm">
            {Object.entries(stageLabels).map(([stage, label]) => (
              <li key={stage} className="flex items-start gap-2">
                <span className="text-base leading-none">🌸</span>
                <span>
                  <span className="font-semibold text-gray-800">{label}</span>{" "}
                  <span className="text-gray-500">{stage}% growth stage</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-gray-700">
            ✅ TODAY'S FOCUS
          </h2>
          <ul className="flex flex-col gap-3 text-sm">
            {todaysFocus.map((item) => {
              const category = categoryMap[item.categoryId];

              return (
                <li key={item.id} className="flex items-center gap-3">
                  <input
                    checked={item.completed}
                    className="h-4 w-4 accent-teal-500"
                    type="checkbox"
                    onChange={(event) =>
                      handleToggleMicroWin(item.id, event.target.checked)
                    }
                  />
                  <span
                    className={`font-medium ${
                      item.completed ? "text-gray-400 line-through" : "text-gray-800"
                    }`}
                  >
                    {item.itemName}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      categoryBadgeClasses[item.categoryId] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category?.name ?? "Focus"}
                  </span>
                  <button className="ml-auto whitespace-nowrap text-xs text-teal-600 hover:underline">
                    + Log as a Moment
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-gray-700">⚖️ BALANCE CHECK</h2>
          <div className="flex flex-col gap-2 text-sm">
            {skillCategories.map((category) => {
              const completedDots = Math.round(
                category.skills.reduce((total, skill) => total + skill.stage, 0) /
                  category.skills.length /
                  20,
              );

              return (
                <div key={category.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{category.name}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index < completedDots ? "bg-teal-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-gray-600">
            <span className="font-semibold text-amber-700">✨ AI Insight:</span>{" "}
            You've leaned into Technical work lately. Consider a small Creativity moment
            this week to keep your garden balanced.
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-rose-500 px-6 py-4 font-bold text-white shadow-lg shadow-rose-500/50 transition hover:bg-rose-600">
        <span className="text-2xl leading-none">+</span>
        <span className="text-sm tracking-wide">ADD MOMENT</span>
      </button>
    </div>
  );
}

export default App;
