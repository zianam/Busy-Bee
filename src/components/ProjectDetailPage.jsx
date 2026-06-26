const defaultProject = {
  id: "project-atlas",
  name: "Project Atlas",
  status: "Completed",
  progress: 100,
  category: "Web Application",
  season: "Spring 2026",
  team: "4 members",
  description:
    "Project Atlas is a mentorship platform that helps college students connect with peer mentors and track shared goals.",
  image: "/house-done.png",
  links: [
    { label: "Live Demo", icon: "↗" },
    { label: "GitHub", icon: "◖" },
    { label: "Presentation", icon: "▣" },
  ],
  skills: [
    { name: "React", stage: "Bud", image: "/flower-bud.png", accent: "text-blue-600" },
    { name: "Debugging", stage: "Bloom", image: "/flower-bloom-pink.png", accent: "text-orange-600" },
    { name: "API Integration", stage: "Bloom", image: "/flower-bloom-red.png", accent: "text-orange-600" },
    { name: "Teamwork", stage: "Bud", image: "/flower-bloom-purple.png", accent: "text-blue-600" },
  ],
  moments: [
    {
      type: "Micro-Win",
      title: "Fixed the authentication bug",
      date: "June 25, 2026",
      icon: "🌱",
      tone: "text-green-700 bg-green-100",
      skills: ["Debugging", "API Integration"],
    },
    {
      type: "Breakthrough",
      title: "Understood the full authentication flow",
      date: "June 23, 2026",
      icon: "💡",
      tone: "text-orange-700 bg-amber-100",
      skills: ["APIs", "React"],
    },
    {
      type: "Hardship",
      title: "Recovered from a merge conflict",
      date: "June 20, 2026",
      icon: "⛰",
      tone: "text-rose-700 bg-rose-100",
      skills: ["Git", "Teamwork"],
    },
  ],
  evidence: [
    { label: "GitHub Commit", icon: "◖", image: null },
    { label: "Working Login Screenshot", image: "/house-wip.png" },
    { label: "Final Presentation Deck", icon: "▤", image: null },
  ],
  story:
    "Project Atlas became a strong example of Camari's growth in debugging, API integration, and teamwork. The most important progress came from learning to isolate technical problems, communicate blockers earlier, and turn setbacks into better team processes.",
};

const defaultProfile = {
  displayName: "Bloom",
  subtitle: "Proof-of-Skill Ledger",
  userName: "Camari",
  season: "Spring 2026",
};

function HeaderAction({ icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#2d8990] px-5 text-sm font-bold text-white/90 transition hover:bg-white/10"
    >
      <span aria-hidden="true" className="text-lg leading-none">
        {icon}
      </span>
      {children}
    </button>
  );
}

function Section({ number, title, accent = "text-[#12857f]", children, action }) {
  return (
    <section className="rounded-lg border border-[#cfe3dc] bg-[#fffdf8] px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className={`flex items-center gap-3 text-sm font-bold uppercase tracking-wide ${accent}`}>
          <span>{number}.</span>
          <span>{title}</span>
          <span aria-hidden="true" className="text-base">
            🌿
          </span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function SkillPill({ children }) {
  return (
    <span className="rounded-md bg-[#dff0df] px-3 py-1 text-xs font-bold text-[#357344]">
      {children}
    </span>
  );
}

export default function ProjectDetailPage({
  project = defaultProject,
  profile = defaultProfile,
  onBack,
  onShare,
  onEdit,
}) {
  const projectDetail = {
    ...defaultProject,
    ...project,
    progress: project.progress ?? project.stage ?? defaultProject.progress,
    image:
      project.image ??
      (project.houseType === "studio" || project.stage < 100 ? "/house-wip.png" : defaultProject.image),
    status:
      project.status ??
      ((project.progress ?? project.stage ?? defaultProject.progress) >= 100 ? "Completed" : "In Progress"),
  };

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#102044]">
      <header className="sticky top-0 z-10 border-b border-[#17314b] bg-[#08233d] text-white shadow-sm">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-5 py-3">
          <button
            type="button"
            onClick={onBack}
            className="mr-auto inline-flex items-center gap-3 text-sm font-bold text-white/85 transition hover:text-white"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ←
            </span>
            Back to Projects
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <img src="/flower-bloom-red.png" alt="" className="h-11 w-11 object-contain" />
            <div>
              <div className="text-2xl font-bold leading-tight">{profile.displayName}</div>
              <div className="text-sm font-bold text-white/75">{profile.subtitle}</div>
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            <span className="inline-flex items-center gap-2 border-r border-white/15 pr-4 text-sm font-bold">
              <img src="/bee.png" alt="" className="h-10 w-10 object-contain" />
              {profile.userName}
            </span>
            <span className="inline-flex items-center gap-2 border-r border-white/15 pr-4 text-sm font-bold">
              <img src="/flower-bloom-red.png" alt="" className="h-7 w-7 object-contain" />
              {profile.season}
            </span>
            <HeaderAction icon="⇧" onClick={onShare}>
              Share
            </HeaderAction>
            <HeaderAction icon="✎" onClick={onEdit}>
              Edit
            </HeaderAction>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6">
        <section className="grid gap-6 rounded-lg border border-[#d9ded9] bg-[#fffdf8] p-5 shadow-sm lg:grid-cols-[1.1fr_1fr_1.2fr]">
          <div className="relative flex min-h-56 items-center justify-center border-b border-[#d9ded9] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <img
              src={projectDetail.image}
              alt=""
              className="h-60 w-full max-w-md object-contain"
            />
            <div className="absolute right-4 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#129b95] text-2xl font-bold text-white shadow">
              ✓
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 border-b border-[#d9ded9] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <h1 className="text-4xl font-bold leading-tight text-[#102044]">{projectDetail.name}</h1>

            <dl className="grid gap-3 text-sm">
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl text-green-600">
                  ●
                </span>
                <dt className="font-bold text-[#516076]">Status</dt>
                <dd className="font-bold text-[#12857f]">{projectDetail.status}</dd>
              </div>
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl text-amber-500">
                  ★
                </span>
                <dt className="font-bold text-[#516076]">Progress</dt>
                <dd className="flex items-center gap-3 font-bold">
                  {projectDetail.progress}%
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#d8e6e0]">
                    <span
                      className="block h-full rounded-full bg-[#159a93]"
                      style={{ width: `${projectDetail.progress}%` }}
                    />
                  </span>
                </dd>
              </div>
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl">
                  🌿
                </span>
                <dt className="font-bold text-[#516076]">Category</dt>
                <dd className="font-bold">{projectDetail.category}</dd>
              </div>
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl">
                  ▣
                </span>
                <dt className="font-bold text-[#516076]">Season</dt>
                <dd className="font-bold">{projectDetail.season}</dd>
              </div>
              <div className="grid grid-cols-[1.75rem_6rem_1fr] items-center gap-2">
                <span aria-hidden="true" className="text-xl">
                  ♟
                </span>
                <dt className="font-bold text-[#516076]">Team</dt>
                <dd className="font-bold">{projectDetail.team}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <p className="max-w-md text-base font-bold leading-7 text-[#1c2a45]">
              {projectDetail.description}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {projectDetail.links.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#d6dfdc] bg-white px-3 text-sm font-bold text-[#102044] transition hover:border-[#75b9b8]"
                >
                  <span aria-hidden="true" className="text-xl text-[#12857f]">
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <Section number="2" title="Skills Grown">
          <div className="relative overflow-hidden px-2 pb-1 pt-2">
            <div className="absolute left-20 right-20 top-[6.75rem] hidden border-t-2 border-dotted border-amber-300 md:block" />
            <div className="relative grid gap-4 md:grid-cols-4">
              {projectDetail.skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-center gap-4 md:flex-col">
                  <img src={skill.image} alt="" className="h-24 w-24 object-contain" />
                  <div className="min-w-36 md:min-w-0 md:text-center">
                    <div className="text-sm font-bold text-[#102044]">{skill.name}</div>
                    <div className={`text-sm font-bold ${skill.accent}`}>{skill.stage}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-sm font-bold text-[#7b807c]">
              {projectDetail.skills.length} skills supported by project evidence
            </p>
          </div>
        </Section>

        <Section
          number="3"
          title="Key Moments"
          action={
            <button
              type="button"
              className="rounded-md border border-[#8cc8c5] px-4 py-2 text-xs font-bold text-[#12857f] transition hover:bg-[#eef9f7]"
            >
              View all moments
            </button>
          }
        >
          <div className="overflow-hidden rounded-md border border-[#e4e7e3] bg-white">
            {projectDetail.moments.map((moment) => (
              <div
                key={moment.title}
                className="grid gap-3 border-b border-[#edf0ec] px-4 py-3 last:border-b-0 md:grid-cols-[4rem_10rem_1fr_11rem_1fr] md:items-center"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-md text-xl ${moment.tone}`}
                >
                  {moment.icon}
                </span>
                <span className={`text-sm font-bold ${moment.tone.split(" ")[0]}`}>
                  {moment.type}
                </span>
                <span className="font-bold text-[#102044]">{moment.title}</span>
                <span className="text-sm font-bold text-[#516076]">{moment.date}</span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#516076]">
                  Skills:
                  {moment.skills.map((skill) => (
                    <SkillPill key={skill}>{skill}</SkillPill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section number="4" title="Evidence">
          <div className="grid gap-4 md:grid-cols-3">
            {projectDetail.evidence.map((item) => (
              <button
                key={item.label}
                type="button"
                className="grid h-20 grid-cols-[5rem_1fr_2rem] items-center gap-3 rounded-md border border-[#dde3de] bg-white px-4 text-left transition hover:border-[#84c5c1]"
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-[#08233d] text-3xl font-bold text-white">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    item.icon
                  )}
                </span>
                <span className="text-sm font-bold text-[#102044]">{item.label}</span>
                <span aria-hidden="true" className="text-2xl font-bold text-[#12857f]">
                  ↗
                </span>
              </button>
            ))}
          </div>
        </Section>

        <section className="relative overflow-hidden rounded-lg border border-amber-200 bg-[#fff9ec] px-5 py-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-amber-700">
                <span aria-hidden="true" className="text-2xl">
                  ✨
                </span>
                5. AI Project Story
              </h2>
              <p className="max-w-3xl text-sm font-bold leading-6 text-[#2d3447]">
                {projectDetail.story}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-md border border-amber-300 bg-white/50 px-6 text-sm font-bold text-amber-700 transition hover:bg-white"
              >
                <span aria-hidden="true">✎</span>
                Edit Story
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-md border border-amber-300 bg-white/50 px-6 text-sm font-bold text-amber-700 transition hover:bg-white"
              >
                <span aria-hidden="true">☆</span>
                Add to Season Recap
              </button>
            </div>
          </div>
          <img
            src="/flower-bloom-red.png"
            alt=""
            className="pointer-events-none absolute bottom-1 right-2 hidden h-16 w-16 object-contain opacity-90 md:block"
          />
        </section>
      </main>
    </div>
  );
}
