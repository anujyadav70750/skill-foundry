export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is Skill Foundry?',
    answer: 'Skill Foundry is a practical learning platform that helps people understand useful digital skills, learn how tools and workflows work, and apply that knowledge to their own projects. Instead of simply providing ready-made instructions, we focus on helping you understand the process and develop the ability to create independently.'
  },
  {
    id: 'faq-2',
    question: 'What can I learn on Skill Foundry?',
    answer: 'Skill Foundry focuses on practical digital skills, including AI image and video creation, prompting, creative workflows, automation, content creation, design and productivity. Available resources depend on what has been published in the resource library.'
  },
  {
    id: 'faq-3',
    question: 'What is a Skill Foundry resource or blueprint?',
    answer: 'A resource is a practical guide designed to help you complete a particular task. Depending on the project, it may include recommended tools, reference materials, prompts, settings, step-by-step instructions and example outputs.'
  },
  {
    id: 'faq-4',
    question: 'Who is Skill Foundry for?',
    answer: 'Skill Foundry is for beginners, creators and anyone interested in developing practical digital skills. It helps people move beyond simply following instructions and understand how to apply what they learn.'
  },
  {
    id: 'faq-5',
    question: 'Do I need previous experience?',
    answer: 'No. Many resources are designed to be beginner-friendly and explain the process step by step. Some advanced workflows may require familiarity with particular tools or techniques, which will be explained in the relevant resource.'
  },
  {
    id: 'faq-6',
    question: 'Is Skill Foundry free?',
    answer: 'The Skill Foundry resource library is currently free to access. However, some recommended third-party tools may offer paid features, subscriptions or usage limits. Any applicable costs are determined by those providers, not Skill Foundry.'
  },
  {
    id: 'faq-7',
    question: 'Do I need paid AI tools or software?',
    answer: 'Not necessarily. Tool requirements depend on the particular workflow. Some tools offer free access or free tiers, while others may require payment for specific features. Check the tool requirements in each resource before starting.'
  },
  {
    id: 'faq-8',
    question: 'How should I follow a Skill Foundry resource?',
    answer: 'Start by reviewing the required tools and reference materials. Then follow the instructions in sequence, understand the purpose of each step, and examine the output. Once you understand the process, adapt it to your own requirements.'
  },
  {
    id: 'faq-9',
    question: 'Why might my results look different from the examples?',
    answer: 'Results can vary because of differences in AI models, tool versions, prompts, input materials, settings and generation attempts. Even when you follow the same process, an identical output is not guaranteed.'
  },
  {
    id: 'faq-10',
    question: 'Are Skill Foundry resources tested?',
    answer: 'Yes. Every published resource is personally tested through actual execution before publication. We check the workflow and its instructions to make sure the process can be followed. However, third-party tools may change, and AI-generated results can vary between attempts.'
  },
  {
    id: 'faq-11',
    question: 'Can I adapt prompts and workflows for my own projects?',
    answer: "You can adapt the instructions for your personal and educational projects. Skill Foundry's original prompts, guides, written content and other materials are not licensed for commercial use or redistribution without permission. You must also follow the terms of any third-party tools you use."
  },
  {
    id: 'faq-12',
    question: 'How often are new resources published?',
    answer: 'New resources are added as guides and practical workflows are prepared. There is currently no guaranteed publishing schedule, so check the resource library for the latest additions.'
  },
  {
    id: 'faq-13',
    question: 'How can I suggest a topic or report a problem?',
    answer: 'You can contact Skill Foundry to suggest a topic, report an issue or share feedback. Include the resource name and a description of the problem so we can understand your request.'
  }
];
