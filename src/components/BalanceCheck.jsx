const TOTAL_DOTS = 5;

function CategoryRow({ category }) {
  const avg = category.skills.reduce((sum, s) => sum + s.stage, 0) / category.skills.length;
  const filled = Math.round(avg / 20);

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{category.name}</span>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_DOTS }, (_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i < filled ? 'bg-teal-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function BalanceCheck({ skillCategories }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">⚖️ BALANCE CHECK</h2>
      <div className="flex flex-col gap-2 text-sm">
        {skillCategories.map(cat => (
          <CategoryRow key={cat.id} category={cat} />
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-gray-600">
        <span className="font-semibold text-amber-700">✨ AI Insight:</span> You've leaned into Technical work lately — consider a small Creativity moment this week to keep your garden balanced.
      </div>
    </div>
  );
}
