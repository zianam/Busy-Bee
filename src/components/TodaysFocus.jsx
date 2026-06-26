import { useState } from 'react';

export default function TodaysFocus({ microWins, todaysFocus, skillCategories, onLogMoment }) {
  const [checked, setChecked] = useState({});

  const focusItems = todaysFocus.map(id => microWins.find(w => w.id === id)).filter(Boolean);

  const categoryMap = Object.fromEntries(
    skillCategories.map(cat => [cat.id, { name: cat.name, badgeClass: cat.badgeClass }])
  );

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">✅ TODAY'S FOCUS</h2>
      <ul className="flex flex-col gap-3 text-sm">
        {focusItems.map(item => {
          const category = categoryMap[item.categoryId];
          return (
            <li key={item.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 accent-teal-500"
                checked={checked[item.id] ?? item.completed}
                onChange={() => toggle(item.id)}
              />
              <span className={`font-medium text-gray-800 ${checked[item.id] ? 'line-through text-gray-400' : ''}`}>
                {item.itemName}
              </span>
              {category && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${category.badgeClass}`}>
                  {category.name}
                </span>
              )}
              <button
                onClick={onLogMoment}
                className="ml-auto text-xs text-teal-600 hover:underline whitespace-nowrap"
              >
                + Log as a Moment
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
