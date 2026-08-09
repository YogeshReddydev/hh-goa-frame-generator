export const ROLES_AND_STACKS = [
  'AI / Machine Learning',
  'Cybersecurity',
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'Cloud / DevOps',
  'Data Science & Analytics',
  'Open Source Development',
  'Product & UX Design',
  'Mobile App Development',
  'Robotics & Embedded Systems',
  'Smart Contracts / Web3',
  'Other',
];

export const INDIAN_CITIES = [
  'Bengaluru, India',
  'Hyderabad, India',
  'Chennai, India',
  'Mumbai, India',
  'Pune, India',
  'New Delhi, India',
  'Kolkata, India',
  'Kochi, India',
  'Ahmedabad, India',
  'Jaipur, India',
  'Chandigarh, India',
  'Bhubaneswar, India',
  'Visakhapatnam, India',
  'Vijayawada, India',
  'Goa, India',
  'Other',
];

export const BUILDER_TITLES = [
  'THE AI ARCHITECT',
  'THE SECURITY ARCHITECT',
  'THE SYSTEM BUILDER',
  'THE PIXEL ENGINEER',
  'THE SYSTEMS BUILDER',
  'THE CLOUD CAPTAIN',
  'THE DATA EXPLORER',
  'THE SHIP-IT ENGINEER',
  'THE OPEN SOURCE NOMAD',
  'THE PRODUCT ALCHEMIST',
  'THE APP ARCHITECT',
  'THE MACHINE TINKERER',
  'THE CODE CARTOGRAPHER',
  'THE LATENCY KILLER',
  'THE PROMPT SURFER',
  'THE COMPILER WARRIOR',
  'THE TROPICAL CODE-SLINGER',
  'THE DEBUGGING PIRATE',
];

export function getRandomBuilderTitle(currentTitle?: string): string {
  const filtered = currentTitle 
    ? BUILDER_TITLES.filter(t => t !== currentTitle)
    : BUILDER_TITLES;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index] || BUILDER_TITLES[0];
}

export function generateTitleForRole(role: string): string {
  const r = role.toUpperCase();
  if (r.includes('AI') || r.includes('MACHINE') || r.includes('LLM')) {
    return 'THE AI ARCHITECT';
  }
  if (r.includes('CYBER') || r.includes('SECURITY') || r.includes('PENETRATION')) {
    return 'THE SECURITY ARCHITECT';
  }
  if (r.includes('FULL') || r.includes('STACK') || r.includes('REACT')) {
    return 'THE SYSTEM BUILDER';
  }
  if (r.includes('FRONTEND') || r.includes('UI') || r.includes('DESIGN') || r.includes('UX')) {
    return 'THE PIXEL ENGINEER';
  }
  if (r.includes('BACKEND') || r.includes('SYSTEMS') || r.includes('NODE') || r.includes('GO')) {
    return 'THE SYSTEMS BUILDER';
  }
  if (r.includes('CLOUD') || r.includes('DEVOPS') || r.includes('AWS') || r.includes('KUBERNETES')) {
    return 'THE CLOUD CAPTAIN';
  }
  if (r.includes('DATA') || r.includes('ANALYTICS') || r.includes('PYTHON')) {
    return 'THE DATA EXPLORER';
  }
  if (r.includes('OPEN SOURCE') || r.includes('KERNEL') || r.includes('LINUX')) {
    return 'THE OPEN SOURCE NOMAD';
  }
  if (r.includes('PRODUCT') || r.includes('MANAGER')) {
    return 'THE PRODUCT ALCHEMIST';
  }
  if (r.includes('MOBILE') || r.includes('FLUTTER') || r.includes('IOS') || r.includes('ANDROID')) {
    return 'THE APP ARCHITECT';
  }
  if (r.includes('ROBOTICS') || r.includes('HARDWARE') || r.includes('IOT') || r.includes('EMBEDDED')) {
    return 'THE MACHINE TINKERER';
  }
  return getRandomBuilderTitle();
}

export interface SampleParticipant {
  name: string;
  role: string;
  city: string;
  builderTitle: string;
  buildingText: string;
}

export const SAMPLE_INDIAN_PARTICIPANTS: SampleParticipant[] = [
  {
    name: 'Ananya Rao',
    role: 'AI / Machine Learning',
    city: 'Hyderabad, India',
    builderTitle: 'THE AI ARCHITECT',
    buildingText: 'Fine-tuning open-source LLMs & multimodal vision agents for tropical hackathons.',
  },
  {
    name: 'Aarav Sharma',
    role: 'Full Stack Development',
    city: 'Bengaluru, India',
    builderTitle: 'THE SYSTEM BUILDER',
    buildingText: 'Building scalable distributed systems & local AI agents for web apps.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Cybersecurity',
    city: 'Pune, India',
    builderTitle: 'THE SECURITY ARCHITECT',
    buildingText: 'Creating automated zero-trust security audits & smart contract fuzzers.',
  },
  {
    name: 'Priya Nair',
    role: 'Frontend Development',
    city: 'Kochi, India',
    builderTitle: 'THE PIXEL ENGINEER',
    buildingText: 'Crafting high-performance UI components & tropical web animations.',
  },
  {
    name: 'Kabir Verma',
    role: 'Cloud Engineering',
    city: 'New Delhi, India',
    builderTitle: 'THE CLOUD CAPTAIN',
    buildingText: 'Architecting multi-region serverless infrastructure for hackathon projects.',
  },
  {
    name: 'Meera Iyer',
    role: 'Data Science',
    city: 'Chennai, India',
    builderTitle: 'THE DATA EXPLORER',
    buildingText: 'Building real-time analytics pipelines & predictive ML tools.',
  },
];

