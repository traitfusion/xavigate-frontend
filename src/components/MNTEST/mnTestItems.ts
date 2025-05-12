// src/ui-kit/components/MNTEST/mnTestItems.ts

export interface MNTestQuestion {
  id: number;
  text: string;
  trait: string;
}

export const QUESTIONS: MNTestQuestion[] = [
  // Multiple Intelligences
  {
    id: 1,
    text: 'I enjoy physical activities that require coordination and balance.',
    trait: 'Gross Bodily Intelligence',
  },
  {
    id: 2,
    text: "I'm good at detailed work with my hands, like crafts or precise movements.",
    trait: 'Fine Bodily Intelligence',
  },
  {
    id: 3,
    text: 'I can easily sense how others are feeling and adjust my behavior accordingly.',
    trait: 'Interpersonal Intelligence',
  },
  {
    id: 4,
    text: 'I enjoy solving puzzles, patterns, and logical problems.',
    trait: 'Logical Intelligence',
  },
  {
    id: 5,
    text: 'I express myself well through speaking and writing.',
    trait: 'Linguistic Intelligence',
  },
  {
    id: 6,
    text: 'I can easily visualize and create 2D designs, diagrams, or layouts.',
    trait: 'Graphic Visual Intelligence',
  },
  {
    id: 7,
    text: 'I have a good sense of direction and can mentally visualize objects in 3D space.',
    trait: 'Spatial Visual Intelligence',
  },
  {
    id: 8,
    text: 'I have a strong sense of rhythm, melody, or musical patterns.',
    trait: 'Musical Intelligence',
  },
  {
    id: 9,
    text: "I'm good at understanding my own feelings, strengths, and weaknesses.",
    trait: 'Intrapersonal Intelligence',
  },
  {
    id: 10,
    text: 'I notice patterns in nature and enjoy classifying things in the natural world.',
    trait: 'Naturalistic Intelligence',
  },

  // Multiple Natures
  {
    id: 11,
    text: 'I instinctively look out for the safety and security of others.',
    trait: 'Protective Nature',
  },
  {
    id: 12,
    text: 'I enjoy explaining concepts and helping others learn new things.',
    trait: 'Educative Nature',
  },
  {
    id: 13,
    text: 'I naturally organize and create systems to keep things running smoothly.',
    trait: 'Administrative Nature',
  },
  {
    id: 14,
    text: 'I enjoy generating new ideas and expressing myself in original ways.',
    trait: 'Creative Nature',
  },
  {
    id: 15,
    text: "I'm drawn to help others recover, heal, or grow emotionally.",
    trait: 'Healing Nature',
  },
  {
    id: 16,
    text: 'I enjoy making others laugh and creating engaging experiences.',
    trait: 'Entertaining Nature',
  },
  {
    id: 17,
    text: "I get satisfaction from taking care of others' needs.",
    trait: 'Providing Nature',
  },
  {
    id: 18,
    text: "I'm comfortable taking calculated risks and initiating new ventures.",
    trait: 'Entrepreneurial Nature',
  },
  {
    id: 19,
    text: "I'm drawn to new experiences, challenges, and seeking the unknown.",
    trait: 'Adventurous Nature',
  },

  // Additional questions for better sampling
  {
    id: 20,
    text: 'I notice when people are uncomfortable and try to help them feel safe.',
    trait: 'Protective Nature',
  },
  {
    id: 21,
    text: 'I find it rewarding to guide others to understand complex topics.',
    trait: 'Educative Nature',
  },
  {
    id: 22,
    text: 'I naturally set up processes and routines that make work more efficient.',
    trait: 'Administrative Nature',
  },
  {
    id: 23,
    text: 'I often come up with unexpected solutions to problems.',
    trait: 'Creative Nature',
  },
  {
    id: 24,
    text: "I'm naturally attuned to the emotional pain or struggles of others.",
    trait: 'Healing Nature',
  },
];
