import { Scenario } from '@/types';

export const SCENARIOS: Scenario[] = [
  // ─── Interview ──────────────────────────────────────────────────────────────
  {
    id: 'interview-sde',
    type: 'interview',
    title: 'SDE Interview',
    subtitle: 'Software Developer',
    description: 'Practice technical and behavioral questions for software engineering roles. Covers system design, coding, and culture fit.',
    icon: '💻',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
  },
  {
    id: 'interview-hr',
    type: 'interview',
    title: 'HR Round',
    subtitle: 'Behavioral Interview',
    description: 'Master common HR questions — tell me about yourself, strengths & weaknesses, conflict resolution, and career goals.',
    icon: '🤝',
    difficulty: 'beginner',
    estimatedMinutes: 10,
  },
  {
    id: 'interview-manager',
    type: 'interview',
    title: 'Manager Interview',
    subtitle: 'Leadership Role',
    description: 'Prepare for management interviews with questions about leadership style, team management, and strategic thinking.',
    icon: '👔',
    difficulty: 'advanced',
    estimatedMinutes: 20,
  },

  // ─── Sales ──────────────────────────────────────────────────────────────────
  {
    id: 'sales-pitch',
    type: 'sales',
    title: 'Sales Pitch',
    subtitle: 'Product Presentation',
    description: 'Practice delivering compelling product pitches. Learn to handle objections and close deals effectively.',
    icon: '📊',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
  },
  {
    id: 'sales-cold-call',
    type: 'sales',
    title: 'Cold Calling',
    subtitle: 'Lead Generation',
    description: 'Simulate cold calling scenarios. Build confidence in opening conversations and qualifying prospects.',
    icon: '📞',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
  },

  // ─── Client Communication ──────────────────────────────────────────────────
  {
    id: 'client-update',
    type: 'client',
    title: 'Client Update',
    subtitle: 'Project Status',
    description: 'Practice presenting project updates, managing expectations, and handling client concerns professionally.',
    icon: '📋',
    difficulty: 'beginner',
    estimatedMinutes: 10,
  },
  {
    id: 'client-negotiation',
    type: 'client',
    title: 'Negotiation',
    subtitle: 'Deal Discussion',
    description: 'Master negotiation tactics — pricing discussions, scope changes, and contract renewals.',
    icon: '🤔',
    difficulty: 'advanced',
    estimatedMinutes: 15,
  },

  // ─── Workplace ──────────────────────────────────────────────────────────────
  {
    id: 'workplace-standup',
    type: 'workplace',
    title: 'Daily Standup',
    subtitle: 'Team Meeting',
    description: 'Practice clear, concise standup updates — what you did, what you plan, and any blockers.',
    icon: '☕',
    difficulty: 'beginner',
    estimatedMinutes: 5,
  },
  {
    id: 'workplace-presentation',
    type: 'workplace',
    title: 'Presentation',
    subtitle: 'Team or All-Hands',
    description: 'Rehearse giving professional presentations — storytelling, data-driven arguments, and audience engagement.',
    icon: '🎤',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
  },
];

export const SCENARIO_CATEGORIES = [
  {
    type: 'interview' as const,
    title: 'Interview Prep',
    subtitle: 'Ace your next interview',
    gradient: ['#6C63FF', '#8B5CF6'],
    icon: '💼',
  },
  {
    type: 'sales' as const,
    title: 'Sales & Pitching',
    subtitle: 'Close more deals',
    gradient: ['#00E676', '#00C853'],
    icon: '💰',
  },
  {
    type: 'client' as const,
    title: 'Client Comms',
    subtitle: 'Impress your clients',
    gradient: ['#00D9FF', '#00B8D9'],
    icon: '🌐',
  },
  {
    type: 'workplace' as const,
    title: 'Workplace English',
    subtitle: 'Daily communication',
    gradient: ['#FFB74D', '#FF9800'],
    icon: '🏢',
  },
];
