export const STAGES = [0, 25, 50, 75, 100];

export const stageLabels = {
  0: "Seed",
  25: "Sprout",
  50: "Bud",
  75: "Blooming",
  100: "Bloom",
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
    season: "Spring 2026",
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
      skills: [
        { id: "react", name: "React", flowerType: "daisy", stage: 50 },
        { id: "debugging", name: "Debugging", flowerType: "tulip", stage: 100 },
        { id: "api-integration", name: "API Integration", flowerType: "default", stage: 25 },
        { id: "git", name: "Git", flowerType: "daisy", stage: 0 },
      ],
    },
    {
      id: "communication",
      name: "Communication",
      icon: "💬",
      colorClass: "bg-blue-50",
      skills: [
        { id: "presenting", name: "Presenting", flowerType: "tulip", stage: 50 },
        { id: "teamwork", name: "Teamwork", flowerType: "default", stage: 100 },
        { id: "documentation", name: "Documentation", flowerType: "daisy", stage: 25 },
      ],
    },
    {
      id: "creativity",
      name: "Creativity",
      icon: "🎨",
      colorClass: "bg-rose-50",
      skills: [
        { id: "ui-design", name: "UI Design", flowerType: "tulip", stage: 100 },
        { id: "storytelling", name: "Storytelling", flowerType: "default", stage: 50 },
        { id: "experimentation", name: "Experimentation", flowerType: "daisy", stage: 0 },
      ],
    },
    {
      id: "life-wellbeing",
      name: "Life & Wellbeing",
      icon: "🌳",
      colorClass: "bg-emerald-50",
      skills: [
        { id: "fitness", name: "Fitness", flowerType: "default", stage: 50 },
        { id: "rest", name: "Rest", flowerType: "daisy", stage: 25 },
        { id: "relationships", name: "Relationships", flowerType: "tulip", stage: 100 },
        { id: "hobbies", name: "Hobbies", flowerType: "default", stage: 0 },
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
