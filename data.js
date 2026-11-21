const STORAGE_KEY = 'skillbridge_live_state_v1';

const CAREER_GOALS = {
  'fullstack-ai': {
    title: 'Full-Stack AI Engineer',
    skills: [
      { id: 'llm-rag', name: 'LLM Apps & RAG Pipelines', required: 85, current: 55 },
      { id: 'react-ts', name: 'React & TypeScript UI', required: 80, current: 70 },
      { id: 'apis-auth', name: 'Backend APIs & Vector DBs', required: 80, current: 50 },
      { id: 'eval-deploy', name: 'Prompt Eval & Cloud Deploy', required: 75, current: 45 }
    ],
    roadmap: [
      { id: 'rm-1', title: 'Week 1: Embeddings, Chunking & Vector Search Basics', duration: '4 hrs • Live Cohort + Practice', done: true },
      { id: 'rm-2', title: 'Week 2: Build a Retrieval-Augmented Q&A Workflow', duration: '5 hrs • Hands-on Lab', done: true },
      { id: 'rm-3', title: 'Week 3: Connect Streaming APIs to a React Interface', duration: '5 hrs • Project Sprint', done: false },
      { id: 'rm-4', title: 'Week 4: Test Latency, Hallucinations & Deploy App', duration: '4 hrs • Capstone Check', done: false }
    ]
  },
  'data-analyst': {
    title: 'Product Data & SQL Analyst',
    skills: [
      { id: 'sql-joins', name: 'SQL Joins, CTEs & Window Functions', required: 90, current: 65 },
      { id: 'python-pandas', name: 'Python & Pandas Data Cleaning', required: 80, current: 55 },
      { id: 'ab-metrics', name: 'Funnel, Cohort & Retention Metrics', required: 85, current: 60 },
      { id: 'storytelling', name: 'Dashboarding & Insight Storytelling', required: 75, current: 70 }
    ],
    roadmap: [
      { id: 'rm-d1', title: 'Week 1: Multi-Table Joins, CTEs & Window Ranking', duration: '4 hrs • SQL Lab', done: true },
      { id: 'rm-d2', title: 'Week 2: Cohort Retention & Churn Analysis in SQL', duration: '4 hrs • Case Study', done: false },
      { id: 'rm-d3', title: 'Week 3: Automated Cleaning & Outlier Checks in Pandas', duration: '5 hrs • Notebook Lab', done: false },
      { id: 'rm-d4', title: 'Week 4: Executive KPI Summary & Metric Deck', duration: '3 hrs • Final Review', done: false }
    ]
  },
  'frontend-ui': {
    title: 'Modern Frontend & UI Engineer',
    skills: [
      { id: 'react-state', name: 'React Hooks, State & Performance', required: 85, current: 72 },
      { id: 'a11y-css', name: 'Responsive Layout, Tailwind & A11y', required: 85, current: 75 },
      { id: 'testing-ui', name: 'Component Testing & Edge States', required: 75, current: 45 },
      { id: 'design-systems', name: 'Reusable Design Tokens & Components', required: 80, current: 55 }
    ],
    roadmap: [
      { id: 'rm-f1', title: 'Week 1: Accessible Components & Keyboard Navigation', duration: '3.5 hrs • UI Clinic', done: true },
      { id: 'rm-f2', title: 'Week 2: State Architecture & Optimistic Updates', duration: '4.5 hrs • Live Build', done: false },
      { id: 'rm-f3', title: 'Week 3: Design System Tokens & Theme Switching', duration: '4 hrs • Component Kit', done: false },
      { id: 'rm-f4', title: 'Week 4: Bundle Profiling & Core Web Vitals Polish', duration: '3 hrs • Audit Sprint', done: false }
    ]
  },
  'cloud-devops': {
    title: 'Cloud & Backend Microservices Dev',
    skills: [
      { id: 'rest-events', name: 'REST / Event-Driven Service Design', required: 85, current: 60 },
      { id: 'containers', name: 'Docker Containers & CI/CD Pipelines', required: 80, current: 50 },
      { id: 'observability', name: 'Logs, Metrics, Alerts & Rollbacks', required: 80, current: 40 },
      { id: 'db-indexing', name: 'Relational Schema & Query Tuning', required: 80, current: 62 }
    ],
    roadmap: [
      { id: 'rm-c1', title: 'Week 1: Containerizing Services & Multi-Stage Builds', duration: '4 hrs • DevOps Lab', done: true },
      { id: 'rm-c2', title: 'Week 2: Automated CI Checks & Safe Rollouts', duration: '4 hrs • Pipeline Lab', done: false },
      { id: 'rm-c3', title: 'Week 3: Structured Logging & Error Budgets', duration: '4 hrs • Reliability Drill', done: false },
      { id: 'rm-c4', title: 'Week 4: Load Testing & Bottleneck Fixes', duration: '4 hrs • Capstone Lab', done: false }
    ]
  }
};

const TRAINERS = [
  {
    id: 'tr-ananya',
    name: 'Ananya Rao',
    role: 'Principal AI & Data Mentor',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 214,
    style: 'Project-First',
    languages: ['English', 'Telugu'],
    seatPrice: 99,
    bio: 'Guides learners through real-world RAG pipelines, SQL analytics, and live debugging in small cohorts.'
  },
  {
    id: 'tr-kabir',
    name: 'Kabir Sharma',
    role: 'Staff Frontend & UI Architect',
    experienceYears: 6,
    rating: 4.8,
    reviewsCount: 168,
    style: 'Code-Along Live',
    languages: ['English', 'Hindi'],
    seatPrice: 79,
    bio: 'Focuses on clean component patterns, accessible UI states, and live browser walkthroughs.'
  },
  {
    id: 'tr-meera',
    name: 'Meera Nair',
    role: 'Senior Analytics & Cloud Educator',
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 289,
    style: 'Concept & Visual',
    languages: ['English', 'Tamil', 'Kannada'],
    seatPrice: 149,
    bio: 'Breaks complex data models and distributed workflows into clear visual mental models.'
  }
];

const LIVE_CLASSES = [
  {
    id: 'cls-demo-rag',
    title: 'Free Demo: Practical RAG & Prompt Debugging',
    trainerId: 'tr-ananya',
    trainerName: 'Ananya Rao',
    topic: 'AI & LLM',
    language: 'English & Telugu',
    schedule: 'Tomorrow • 6:30 PM IST',
    cohortSize: 24,
    maxSeats: 30,
    price: 0,
    isDemo: true,
    recordingAllowed: true,
    recordingDuration: '42 min demo replay',
    summary: 'Preview how real cohorts debug retrieval quality, chunking, and answer grounding.'
  },
  {
    id: 'cls-sql-cohort',
    title: 'SQL Joins, CTEs & Window Functions Lab',
    trainerId: 'tr-meera',
    trainerName: 'Meera Nair',
    topic: 'SQL & Data',
    language: 'English & Tamil',
    schedule: 'Tue • 7:00 PM IST',
    cohortSize: 19,
    maxSeats: 25,
    price: 99,
    isDemo: false,
    recordingAllowed: true,
    recordingDuration: '68 min session',
    summary: 'Hands-on query writing on multi-table datasets with instant doubt clearing.'
  },
  {
    id: 'cls-react-hooks',
    title: 'React State, Effects & Edge-Case UI Clinic',
    trainerId: 'tr-kabir',
    trainerName: 'Kabir Sharma',
    topic: 'React & UI',
    language: 'English & Hindi',
    schedule: 'Thu • 8:00 PM IST',
    cohortSize: 22,
    maxSeats: 30,
    price: 49,
    isDemo: false,
    recordingAllowed: false,
    recordingDuration: 'Live-only (No recording)',
    summary: 'Affordable ₹49 live clinic covering stale closures, loading states, and clean UI refactoring.'
  },
  {
    id: 'cls-ai-evals',
    title: 'Evaluating LLM Responses & Guardrails Sprint',
    trainerId: 'tr-ananya',
    trainerName: 'Ananya Rao',
    topic: 'AI & LLM',
    language: 'English',
    schedule: 'Sat • 11:00 AM IST',
    cohortSize: 15,
    maxSeats: 20,
    price: 199,
    isDemo: false,
    recordingAllowed: true,
    recordingDuration: '75 min workshop',
    summary: 'Deep-dive cohort on test sets, failure rubrics, and reliable shipping.'
  },
  {
    id: 'cls-demo-ui',
    title: 'Free Demo: Accessible UI & Tailwind Patterns',
    trainerId: 'tr-kabir',
    trainerName: 'Kabir Sharma',
    topic: 'React & UI',
    language: 'English & Hindi',
    schedule: 'Sun • 5:00 PM IST',
    cohortSize: 27,
    maxSeats: 30,
    price: 0,
    isDemo: true,
    recordingAllowed: true,
    recordingDuration: '38 min demo replay',
    summary: 'Try a free interactive walkthrough of responsive layouts, modals, and keyboard focus.'
  },
  {
    id: 'cls-cloud-arch',
    title: 'API Reliability, Retries & Observability',
    trainerId: 'tr-meera',
    trainerName: 'Meera Nair',
    topic: 'System Design',
    language: 'English & Kannada',
    schedule: 'Next Mon • 7:30 PM IST',
    cohortSize: 14,
    maxSeats: 20,
    price: 149,
    isDemo: false,
    recordingAllowed: false,
    recordingDuration: 'Live-only (No recording)',
    summary: 'Practical walkthrough of idempotency, timeouts, structured logs, and alerts.'
  }
];

const OFFLINE_WORKSHOPS = [
  {
    id: 'off-hyd',
    title: 'Weekend SQL & Data Storytelling Clinic',
    city: 'Hyderabad (Madhapur Hub)',
    date: 'Sat, Nov 28 • 10:30 AM',
    seatsLeft: 7,
    verified: true
  },
  {
    id: 'off-blr',
    title: 'Hands-On AI Prompt & Workflow Lab',
    city: 'Bengaluru (Indiranagar Studio)',
    date: 'Sun, Nov 29 • 2:00 PM',
    seatsLeft: 5,
    verified: true
  },
  {
    id: 'off-chn',
    title: 'Frontend UI & Accessibility Code Jam',
    city: 'Chennai (Guindy Tech Space)',
    date: 'Sat, Dec 5 • 11:00 AM',
    seatsLeft: 11,
    verified: true
  }
];

const PEER_PODS = [
  {
    id: 'pod-sql',
    topic: 'Daily 30-Min SQL & Query Drills',
    schedule: 'Daily • 8:00 AM IST',
    members: 9,
    joined: false
  },
  {
    id: 'pod-rag',
    topic: 'Weekend RAG & Mini-Project Peer Review',
    schedule: 'Sat & Sun • 4:00 PM IST',
    members: 6,
    joined: true
  },
  {
    id: 'pod-ui',
    topic: 'Frontend UI Critique & Refactor Pod',
    schedule: 'Wed & Fri • 9:00 PM IST',
    members: 7,
    joined: false
  }
];

const UI_STRINGS = {
  en: {
    brandName: 'SkillBridge Live',
    aiBtn: 'AI Study Assistant',
    skillgapHeading: 'Identify Missing Skills Based on Your Goal',
    skillgapDesc: 'Select your target role and adjust your current skill levels to calculate exact skill gaps and generate a tailored roadmap.'
  },
  hi: {
    brandName: 'स्किलब्रिज लाइव',
    aiBtn: 'AI अध्ययन सहायक',
    skillgapHeading: 'अपने लक्ष्य के आधार पर छूटे हुए कौशल पहचानें',
    skillgapDesc: 'अपना लक्ष्य चुनें और कौशल स्तर समायोजित करके अंतर और रोडमैप तैयार करें।'
  },
  te: {
    brandName: 'స్కిల్‌బ్రిడ్జ్ లైవ్',
    aiBtn: 'AI స్టడీ అసిస్టెంట్',
    skillgapHeading: 'మీ లక్ష్యం ఆధారంగా లోపించిన నైపుణ్యాలను గుర్తించండి',
    skillgapDesc: 'మీ లక్ష్యాన్ని ఎంచుకుని, ప్రస్తుత నైపుణ్య స్థాయిలను సర్దుబాటు చేసి రోడ్‌మ్యాప్ పొందండి.'
  },
  ta: {
    brandName: 'ஸ்கில்பிரிட்ஜ் லைவ்',
    aiBtn: 'AI படிப்பு உதவியாளர்',
    skillgapHeading: 'உங்கள் இலக்கின் அடிப்படையில் விடுபட்ட திறன்களைக் கண்டறியவும்',
    skillgapDesc: 'உங்கள் இலக்கைத் தேர்ந்தெடுத்து, திறன் நிலைகளைச் சரிசெய்து கற்றல் பாதையைப் பெறுங்கள்.'
  },
  kn: {
    brandName: 'ಸ್ಕಿಲ್‌ಬ್ರಿಡ್ಜ್ ಲೈವ್',
    aiBtn: 'AI ಅಧ್ಯಯನ ಸಹಾಯಕ',
    skillgapHeading: 'ನಿಮ್ಮ ಗುರಿಯ ಆಧಾರದ ಮೇಲೆ ಕಾಣೆಯಾದ ಕೌಶಲ್ಯಗಳನ್ನು ಗುರುತಿಸಿ',
    skillgapDesc: 'ನಿಮ್ಮ ಗುರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಕೌಶಲ್ಯ ಮಟ್ಟಗಳನ್ನು ಹೊಂದಿಸಿ ಕಲಿಕೆಯ ಮಾರ್ಗಸೂಚಿ ಪಡೆಯಿರಿ.'
  }
};

function createDefaultState() {
  return {
    activeTab: 'overview',
    language: 'en',
    selectedGoal: 'fullstack-ai',
    goalSkills: JSON.parse(JSON.stringify(CAREER_GOALS)),
    walletBalance: 1450,
    bookedClassIds: ['cls-sql-cohort'],
    reminders: {
      'cls-sql-cohort': true,
      'cls-demo-rag': true
    },
    streakDays: 12,
    checkedInToday: false,
    weekCheckins: [true, true, true, true, true, true, false],
    projects: [
      { id: 'prj-1', title: 'SQL Cohort & Retention Query Pack', done: true },
      { id: 'prj-2', title: 'Interactive Study Roadmap & Notes App', done: false },
      { id: 'prj-3', title: 'Document Q&A Prototype with Citations', done: false }
    ],
    notesText: '• SQL CTEs make multi-step filtering easier to read and debug.\n• Always test retrieval chunks on edge-case queries before tuning prompts.',
    resources: [
      { id: 'res-1', title: 'SQL Joins & Window Cheat Sheet', type: 'Cheatsheet' },
      { id: 'res-2', title: 'RAG Chunking & Evaluation Guide', type: 'PDF Guide' }
    ],
    doubts: [
      {
        id: 'dbt-1',
        classTitle: 'SQL Joins, CTEs & Window Functions Lab',
        timing: 'During Live Class',
        question: 'When should I use ROW_NUMBER() vs DENSE_RANK()?',
        answer: 'Use ROW_NUMBER() when you need a unique 1..N sequence per group; use DENSE_RANK() when ties should share the same rank without skipping numbers.',
        author: 'Meera Nair (Trainer)'
      },
      {
        id: 'dbt-2',
        classTitle: 'Free Demo: Practical RAG & Prompt Debugging',
        timing: 'Post-Class Practice',
        question: 'How large should text chunks be for technical docs?',
        answer: 'Start around 300–600 tokens with 10–15% overlap, then measure recall on real questions rather than guessing.',
        author: 'Ananya Rao (Trainer)'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        classTitle: 'SQL Joins, CTEs & Window Functions Lab',
        trainerName: 'Meera Nair',
        rating: 5,
        tags: ['High Clarity', 'Hands-on Practical'],
        comment: 'Visualizing joins and window frames side by side made tricky queries click immediately.'
      },
      {
        id: 'rev-2',
        classTitle: 'Free Demo: Practical RAG & Prompt Debugging',
        trainerName: 'Ananya Rao',
        rating: 5,
        tags: ['Doubt Friendly', 'Great Pacing'],
        comment: 'Super helpful free demo—saw exactly how the cohort works before booking a paid seat.'
      }
    ],
    exchanges: [
      { id: 'swp-1', offer: 'SQL & Excel Dashboards', want: 'React Hooks & State', owner: 'Karthik M.', status: 'Open' },
      { id: 'swp-2', offer: 'Figma Wireframes & UI Polish', want: 'Python Data Prep', owner: 'Divya S.', status: 'Open' }
    ],
    rsvpedOfflineIds: [],
    peerPods: JSON.parse(JSON.stringify(PEER_PODS)),
    walletTransactions: [
      { id: 'tx-1', title: 'Streak Milestone Reward (10 Days)', amount: 150, type: 'reward', date: '2 days ago' },
      { id: 'tx-2', title: 'Seat Booked: SQL Joins, CTEs & Window Functions Lab', amount: -99, type: 'payment', date: 'Yesterday' },
      { id: 'tx-3', title: 'Refund: Cancelled Evening Slot Credit', amount: 99, type: 'refund', date: 'Today' }
    ],
    assistantMessages: [
      {
        role: 'assistant',
        title: 'Welcome to AI Study Assistant',
        body: 'Enter any topic above and click Explain Concept for a clear breakdown or Practice Questions for self-testing.'
      }
    ]
  };
}

function loadAppState() {
  const fallback = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      goalSkills: parsed.goalSkills || fallback.goalSkills,
      reminders: parsed.reminders || fallback.reminders,
      projects: Array.isArray(parsed.projects) ? parsed.projects : fallback.projects,
      resources: Array.isArray(parsed.resources) ? parsed.resources : fallback.resources,
      doubts: Array.isArray(parsed.doubts) ? parsed.doubts : fallback.doubts,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : fallback.reviews,
      exchanges: Array.isArray(parsed.exchanges) ? parsed.exchanges : fallback.exchanges,
      rsvpedOfflineIds: Array.isArray(parsed.rsvpedOfflineIds) ? parsed.rsvpedOfflineIds : fallback.rsvpedOfflineIds,
      peerPods: Array.isArray(parsed.peerPods) ? parsed.peerPods : fallback.peerPods,
      walletTransactions: Array.isArray(parsed.walletTransactions) ? parsed.walletTransactions : fallback.walletTransactions,
      assistantMessages: Array.isArray(parsed.assistantMessages) ? parsed.assistantMessages : fallback.assistantMessages
    };
  } catch {
    return fallback;
  }
}

let appState = loadAppState();

function saveAppState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch {
    // Storage quota fallback
  }
}
