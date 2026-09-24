export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is Skill Foundry?',
    answer: 'Skill Foundry is a practical learning library for people who want useful AI skills, prompts, and workflows without unnecessary complexity. Each resource is broken down into clear, step-by-step blueprints designed for real-world projects.'
  },
  {
    id: 'faq-2',
    question: 'Are the resources free to use?',
    answer: 'Skill Foundry is designed to provide practical AI learning resources that are accessible to creators and learners. Individual resources may have their own tool or platform requirements, which will be clearly mentioned where relevant.'
  },
  {
    id: 'faq-3',
    question: 'Do I need prior AI experience?',
    answer: 'No. Skill Foundry is designed to be beginner-friendly. Resources explain the process step by step so you can follow the workflow even if you are new to the tools being used.'
  },
  {
    id: 'faq-4',
    question: 'Which AI tools and platforms do you cover?',
    answer: 'Skill Foundry covers practical AI tools and platforms used for areas such as image generation, video generation, automation, prompting, creative workflows, and other real-world AI projects. The specific tools used are shown inside each relevant resource.'
  },
  {
    id: 'faq-5',
    question: 'Can I use the prompts and workflows in my own projects?',
    answer: 'Yes. The prompts and workflows are provided as practical resources that you can adapt to your own projects, while following the terms and usage rules of the AI tools or platforms involved.'
  },
  {
    id: 'faq-6',
    question: 'How often are new resources added?',
    answer: 'New practical resources will be added regularly as new tools, workflows, and useful AI techniques become relevant.'
  },
  {
    id: 'faq-7',
    question: 'What is a Skill Foundry blueprint?',
    answer: 'A blueprint is an executable, step-by-step guide designed for hands-on production. It includes prompt templates, tool configurations, setup instructions, and practical guidance so you can achieve reliable, repeatable results in your own work.'
  },
  {
    id: 'faq-8',
    question: 'Do I need paid subscriptions to use the AI tools mentioned?',
    answer: 'Many resources can be completed using free tiers or open-source tools. When a workflow utilizes a paid service or premium model, the resource clearly notes this upfront alongside possible free alternatives where available.'
  },
  {
    id: 'faq-9',
    question: 'How do I find blueprints relevant to my specific project?',
    answer: 'You can explore resources by category—such as Image Generation, Video Workflows, Automation, and Prompt Systems—or use the global library search to filter by specific tools, use cases, and tags.'
  },
  {
    id: 'faq-10',
    question: 'Can I adapt the prompt systems to different AI models?',
    answer: 'Yes. While each blueprint is tested against specific models (such as Claude, ChatGPT, Midjourney, or Flux), the underlying prompting principles and structures are designed to be model-agnostic and customizable.'
  },
  {
    id: 'faq-11',
    question: 'Do I need programming knowledge to follow the workflows?',
    answer: 'Most blueprints are designed for direct execution without writing code. For technical workflows involving automation or API integrations, instructions are provided with copy-paste configurations and clear walk-throughs.'
  },
  {
    id: 'faq-12',
    question: 'How are Skill Foundry resources tested and verified?',
    answer: 'Every blueprint in the library is tested through actual hands-on execution before publication to ensure that the prompts, steps, and outputs produce reliable, high-quality results.'
  },
  {
    id: 'faq-13',
    question: 'Can I suggest a tool, workflow, or topic to be covered?',
    answer: 'Yes. You can submit questions, tool suggestions, or workflow requests directly through the question submission form below or via our Contact page.'
  },
  {
    id: 'faq-14',
    question: 'Is there an account or sign-up required to view blueprints?',
    answer: 'No account or sign-up is required. All published blueprints in the library are openly accessible for you to read, reference, and use in your projects immediately.'
  },
  {
    id: 'faq-15',
    question: 'Where can I ask for help if a step in a blueprint does not work for me?',
    answer: 'If you encounter an issue or have a question about a specific workflow, you can send us a message through our Contact page or submit a question right here in the FAQ section.'
  }
];
