import SkillButton from './SkillButton';

export default function SkillCard({ category, onSelectSkill }) {
  const { name, icon, colorClass, skills } = category;

  return (
    <div className={`${colorClass} rounded-2xl p-4 min-h-[190px] shadow-sm`}>
      <h2 className="text-sm font-bold tracking-wide text-gray-700 mb-4">
        {icon === '</>' ? <span className="font-mono">{icon}</span> : icon} {name.toUpperCase()}
      </h2>
      <div className="flex justify-around">
        {skills.map((skill) => (
          <SkillButton key={skill.id} skill={skill} onSelect={onSelectSkill} />
        ))}
      </div>
    </div>
  );
}
