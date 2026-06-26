import { stageLabels } from './data/busyBeeData';

const stageSizeClass = {
  0: 'text-lg',
  25: 'text-2xl',
  50: 'text-3xl',
  75: 'text-3xl',
  100: 'text-4xl',
};

export default function SkillButton({ skill, onSelect }) {
  return (
    <button
      onClick={() => onSelect(skill.name)}
      className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-75 transition"
    >
      <span className={stageSizeClass[skill.stage] ?? 'text-2xl'}>🌸</span>
      <span className="text-sm font-medium text-gray-800">{skill.name}</span>
      <span className="text-xs text-gray-400">{stageLabels[skill.stage]}</span>
    </button>
  );
}
