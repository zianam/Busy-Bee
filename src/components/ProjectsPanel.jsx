const houseEmojis = {
  cottage: '🏡',
  townhouse: '🏘️',
  studio: '🏠',
};

function ProjectCard({ project }) {
  const { name, houseType, stage } = project;
  const isComplete = stage === 100;

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-3">
      {isComplete && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shadow">
          ✓
        </div>
      )}
      <div className="h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">
        {houseEmojis[houseType] ?? '🏠'}
      </div>
      <div className="mt-3 font-semibold text-gray-800">{name}</div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${isComplete ? 'bg-green-500' : 'bg-teal-400'}`}
            style={{ width: `${stage}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-600">{stage}%</span>
      </div>
    </div>
  );
}

export default function ProjectsPanel({ projectCategories }) {
  return (
    <div className="lg:col-span-1 bg-gray-200 rounded-2xl p-4 min-h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏡</span>
        <h2 className="text-sm font-bold tracking-wide text-gray-700">PROJECTS</h2>
      </div>
      <div className="flex flex-col gap-4">
        {projectCategories.flatMap(cat => cat.projects).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
