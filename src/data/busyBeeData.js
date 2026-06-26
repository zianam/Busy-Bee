export const STAGES = [0, 25, 50, 75, 100];

export const stageLabels = {
  0: "Seed",
  25: "Sprout",
  50: "Bud",
  75: "Blooming",
  100: "Bloom",
};

export const stageEmojis = {
  0: '🌱',
  25: '🌿',
  50: '🌷',
  75: '🌸',
  100: '🌸',
};

export const flowerTypes = {
  default: {
    name: "Garden Flower",
    stages: STAGES,
  },
  daisy: {
    name: "Daisy",
    stages: STAGES,
  },
  tulip: {
    name: "Tulip",
    stages: STAGES,
  },
};

export const houseTypes = {
  cottage: {
    name: "Cottage",
    stages: STAGES,
  },
  townhouse: {
    name: "Townhouse",
    stages: STAGES,
  },
  studio: {
    name: "Studio",
    stages: STAGES,
  },
};

export const defaultBusyBeeData = {
  profile: {
    displayName: "Busy Bee",
    subtitle: "Skill Tracker",
    userName: "Camari",
    userTitle: "Bee Gardener",
    season: "Spring 2026",
    journeyProgress: 64,
    water: {
      current: 3,
      goal: 5,
    },
    streak: 8,
    streakSchedule: "weekdays",
    affirmations: [
      "Small wins still count.",
      "Progress grows when you notice it.",
      "One focused step is enough to begin.",
    ],
  },
  skillCategories: [
    {
      id: "technical",
      name: "Technical Skills",
      icon: "</>",
      colorClass: "bg-sky-50",
      badgeClass: "bg-sky-100 text-sky-700",
      skills: [
        {
          id: "react", name: "React", flowerType: "daisy", stage: 50, streak: 6,
          moments: [
            { date: "2026-05-28", progress: 0 },
            { date: "2026-06-03", progress: 25 },
            { date: "2026-06-10", progress: 25 },
            { date: "2026-06-18", progress: 50 },
            { date: "2026-06-22", progress: 50 },
          ],
        },
        {
          id: "debugging", name: "Debugging", flowerType: "tulip", stage: 100, streak: 10,
          moments: [
            { date: "2026-05-27", progress: 25 },
            { date: "2026-06-01", progress: 50 },
            { date: "2026-06-08", progress: 75 },
            { date: "2026-06-15", progress: 100 },
            { date: "2026-06-20", progress: 100 },
            { date: "2026-06-25", progress: 100 },
          ],
        },
        {
          id: "api-integration", name: "API Integration", flowerType: "default", stage: 25, streak: 3,
          moments: [
            { date: "2026-06-10", progress: 0 },
            { date: "2026-06-20", progress: 25 },
            { date: "2026-06-23", progress: 25 },
          ],
        },
        {
          id: "git", name: "Git", flowerType: "daisy", stage: 0, streak: 1,
          moments: [
            { date: "2026-06-25", progress: 0 },
          ],
        },
      ],
    },
    {
      id: "communication",
      name: "Communication",
      icon: "💬",
      colorClass: "bg-blue-50",
      badgeClass: "bg-blue-100 text-blue-700",
      skills: [
        {
          id: "presenting", name: "Presenting", flowerType: "tulip", stage: 50, streak: 5,
          moments: [
            { date: "2026-05-29", progress: 0 },
            { date: "2026-06-05", progress: 25 },
            { date: "2026-06-14", progress: 25 },
            { date: "2026-06-20", progress: 50 },
            { date: "2026-06-24", progress: 50 },
          ],
        },
        {
          id: "teamwork", name: "Teamwork", flowerType: "default", stage: 100, streak: 8,
          moments: [
            { date: "2026-05-26", progress: 25 },
            { date: "2026-06-02", progress: 50 },
            { date: "2026-06-09", progress: 75 },
            { date: "2026-06-16", progress: 100 },
            { date: "2026-06-23", progress: 100 },
            { date: "2026-06-25", progress: 100 },
          ],
        },
        {
          id: "documentation", name: "Documentation", flowerType: "daisy", stage: 25, streak: 4,
          moments: [
            { date: "2026-06-08", progress: 0 },
            { date: "2026-06-18", progress: 25 },
            { date: "2026-06-22", progress: 25 },
          ],
        },
      ],
    },
    {
      id: "creativity",
      name: "Creativity",
      icon: "🎨",
      colorClass: "bg-rose-50",
      badgeClass: "bg-rose-100 text-rose-700",
      skills: [
        {
          id: "ui-design", name: "UI Design", flowerType: "tulip", stage: 100, streak: 7,
          moments: [
            { date: "2026-05-26", progress: 50 },
            { date: "2026-06-02", progress: 75 },
            { date: "2026-06-12", progress: 100 },
            { date: "2026-06-18", progress: 100 },
            { date: "2026-06-24", progress: 100 },
          ],
        },
        {
          id: "storytelling", name: "Storytelling", flowerType: "default", stage: 50, streak: 5,
          moments: [
            { date: "2026-05-30", progress: 25 },
            { date: "2026-06-06", progress: 25 },
            { date: "2026-06-15", progress: 50 },
            { date: "2026-06-21", progress: 50 },
          ],
        },
        {
          id: "experimentation", name: "Experimentation", flowerType: "daisy", stage: 0, streak: 1,
          moments: [
            { date: "2026-06-22", progress: 0 },
          ],
        },
      ],
    },
    {
      id: "life-wellbeing",
      name: "Life & Wellbeing",
      icon: "🌳",
      colorClass: "bg-emerald-50",
      badgeClass: "bg-emerald-100 text-emerald-700",
      skills: [
        {
          id: "fitness", name: "Fitness", flowerType: "default", stage: 50, streak: 6,
          moments: [
            { date: "2026-05-28", progress: 0 },
            { date: "2026-06-04", progress: 25 },
            { date: "2026-06-11", progress: 25 },
            { date: "2026-06-19", progress: 50 },
            { date: "2026-06-24", progress: 50 },
          ],
        },
        {
          id: "rest", name: "Rest", flowerType: "daisy", stage: 25, streak: 4,
          moments: [
            { date: "2026-06-05", progress: 0 },
            { date: "2026-06-15", progress: 25 },
            { date: "2026-06-21", progress: 25 },
          ],
        },
        {
          id: "relationships", name: "Relationships", flowerType: "tulip", stage: 100, streak: 9,
          moments: [
            { date: "2026-05-27", progress: 50 },
            { date: "2026-06-03", progress: 75 },
            { date: "2026-06-12", progress: 100 },
            { date: "2026-06-19", progress: 100 },
            { date: "2026-06-25", progress: 100 },
          ],
        },
        {
          id: "hobbies", name: "Hobbies", flowerType: "default", stage: 0, streak: 1,
          moments: [
            { date: "2026-06-20", progress: 0 },
          ],
        },
      ],
    },
  ],
  projectCategories: [
    {
      id: "personal-projects",
      name: "Personal Projects",
      projects: [
        {
          id: "project-atlas",
          name: "Project Atlas",
          houseType: "cottage",
          stage: 100,
        },
        {
          id: "portfolio-refresh",
          name: "Portfolio Refresh",
          houseType: "studio",
          stage: 75,
        },
      ],
    },
  ],
  microWins: [
    {
      id: "finish-login-flow",
      itemName: "Finish login flow",
      completed: false,
      categoryId: "technical",
    },
    {
      id: "practice-project-presentation",
      itemName: "Practice project presentation",
      completed: false,
      categoryId: "communication",
    },
    {
      id: "go-to-the-gym",
      itemName: "Go to the gym",
      completed: false,
      categoryId: "life-wellbeing",
    },
  ],
  todaysFocus: [
    "finish-login-flow",
    "practice-project-presentation",
    "go-to-the-gym",
  ],
};
