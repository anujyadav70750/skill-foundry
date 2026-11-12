export type AuthorProfile = {
  id: string;
  name: string;
  role: string;
  handle?: string;
  instagramUrl?: string;
  image: string;
  description: string;
  about: string[];
  expertise: Array<{ title: string; description: string }>;
};

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  'skill-foundry': {
    id: 'skill-foundry',
    name: 'Skill Foundry',
    role: 'Creator & Author',
    handle: '@skillfoundary',
    instagramUrl: 'https://www.instagram.com/skillfoundary/',
    image: '/images/skill-foundry-author.jpg',
    description: 'Creating practical guides and clear workflows that help people understand useful skills and put them to work.',
    about: [
      'I created Skill Foundry to make useful skills easier to understand and apply. I build practical tutorials and workflows that explain the steps, tools and decisions behind a result—not just the finished example.',
      'The aim is to help people learn by doing, understand how a process works, and adapt what they learn to their own projects. Skill Foundry is growing as a place for practical skills that make creating and everyday work easier, including areas beyond AI.'
    ],
    expertise: [
      { title: 'AI Image & Video Creation', description: 'Prompt-led visual creation, reference workflows and practical generation techniques.' },
      { title: 'Automation', description: 'Useful systems and workflows that reduce repetitive tasks.' },
      { title: 'Content Creation & Editing', description: 'Planning, creating and improving content from the first idea to the final result.' },
      { title: 'Design & Templates', description: 'Reusable layouts, templates and visual resources for practical projects.' },
      { title: 'Practical Digital Skills', description: 'Tools, techniques and everyday workflows that help people work more effectively.' }
    ]
  }
};
