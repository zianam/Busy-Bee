const stages = [
  { emoji: '🌱', label: 'Seed', description: 'newly added skill' },
  { emoji: '🌿', label: 'Sprout', description: 'one related micro-win' },
  { emoji: '🌷', label: 'Bud', description: 'applied in a project' },
  { emoji: '🌸', label: 'Bloom', description: 'repeated evidence & reflection' },
];

export default function GrowthKey() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-3">🌱 GROWTH KEY</h2>
      <ul className="flex flex-col gap-3 text-sm">
        {stages.map(({ emoji, label, description }) => (
          <li key={label} className="flex items-start gap-2">
            <span className="text-base leading-none">{emoji}</span>
            <span>
              <span className="font-semibold text-gray-800">{label}</span>{' '}
              <span className="text-gray-500">— {description}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
