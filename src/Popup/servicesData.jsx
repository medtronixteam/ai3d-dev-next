import discovery     from '../assets/service/discovery.svg';
import Business      from '../assets/service/Business.svg';
import Desktop       from '../assets/service/Desktop.svg';
import WebsiteDev    from '../assets/service/WebsiteDev.svg';
import Flutter       from '../assets/service/Flutter.svg';
import AIDevelopment from '../assets/service/AIDevelopment.svg';
import CreativeMedia from '../assets/service/CreativeMedia.svg';
import FullStack     from '../assets/service/FullStack.svg';
import BgAIDev       from '../assets/service/BgAIDev.svg';
import DataPrep      from '../assets/service/DataPrep.svg';
import ModelDev      from '../assets/service/ModelDev.svg';
import integrationn  from '../assets/service/integrationn.svg';
import deployment    from '../assets/service/deployment.svg';
import One           from '../assets/service/01.svg';
import Two           from '../assets/service/02.svg';
import Three         from '../assets/service/03.svg';
import Four          from '../assets/service/04.svg';
import Five          from '../assets/service/05.svg';
import ArrowBack from '../assets/service/ArrowBack.svg'
import Project from '../assets/service/Project.svg'
import Curve1 from '../assets/service/Curve1.svg'
import Curve2 from '../assets/service/Curve2.svg'
import ProcessBg from '../assets/images/WorkTogether.svg'
import DP from '../assets/service/Dp.svg'
import MD from '../assets/service/MD.svg'
import DPrep from '../assets/service/DPrep.svg'
import Int from '../assets/service/Int.svg'
import ArrowUp from '../assets/service/ArrowUp.svg'
import ArrowDown from '../assets/service/ArrowDown.svg'
import SehrozSir from '../assets/images/ShehrozSir.jpeg';
import Zeeshan from '../assets/service/Zeeshan.png'
import Ali from '../assets/service/Ali.png'
import haseeb from '../assets/service/haseeb.jpeg'
import Shahwar from '../assets/service/shahwar.jpeg'
import Hira from '../assets/images/HiraMam.svg';
import Samia from '../assets/images/SamiaMam.svg';
import UsamaSir from '../assets/images/UsamaSir.jpeg';
import MudassarSir from '../assets/images/mudassar.jpeg';
import SajeelSir from '../assets/images/SajeelSir.jpeg';

export const PROCESS_STEPS = [
  { icon: discovery,    label: 'Discovery',    desc: 'Requirements gathering, data audit, feasibility analysis.', num: One   },
  { icon: DataPrep,     label: 'Data Prep',    desc: 'Cleaning, labeling, feature engineering.',                  num: Two   },
  { icon: ModelDev,     label: 'Model Dev',    desc: 'Training, evaluation, hyperparameter tuning.',              num: Three },
  { icon: integrationn, label: 'Integration',  desc: 'API wrapping, frontend hooks, testing.',                    num: Four  },
  { icon: deployment,   label: 'Deployment',   desc: 'Cloud deploy, monitoring setup, handover.',                 num: Five  },
];

export const SERVICES = [
  {
    id: 'ai',
    icon: AIDevelopment,
    bgIcon: BgAIDev,
    label: 'AI Development & Solutions',
    heading: 'AI Development & Solutions',
    intro:
      'We build end-to-end AI solutions — from data collection and model training to deployment and monitoring. Our team specializes in NLP, computer vision, predictive analytics, and generative AI integrations.',
    bullets: [
      'Custom AI model design and training',
      'Machine learning & deep learning integrations',
      'Computer vision and 3D data processing',
      'Natural language processing (NLP) solutions',
    ],
    techStack: ['Python', 'TensorFlow/PyTorch', 'FastAPI', 'LangChain', 'OpenAI / Gemini', 'AWS SageMaker', 'Docker', 'PostgreSQL'],
    members: 3,
  },
  {
    id: 'flutter',
    icon: Flutter,
    bgIcon: BgAIDev,
    label: 'Flutter App Development',
    heading: 'Flutter App Development',
    intro:
      'Cross-platform mobile apps for iOS and Android with a single codebase. Pixel-perfect UI, high performance, and seamless integrations.',
    bullets: [
      'iOS & Android from one codebase',
      'Custom UI/UX design',
      'Firebase & REST API integration',
      'App Store & Play Store deployment',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'REST API', 'GetX / Riverpod'],
    members: 4,
  },
  {
    id: 'web',
    icon: WebsiteDev,
    bgIcon: BgAIDev,
    label: 'Website Development',
    heading: 'Website Development',
    intro:
      'Full-stack web development from landing pages to complex web applications. We build fast, scalable, and SEO-friendly websites.',
    bullets: [
      'React / Next.js frontends',
      'Node.js / Django backends',
      'CMS integrations (WordPress, Strapi)',
      'Performance & SEO optimization',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    members: 5,
  },
  {
    id: 'desktop',
    icon: Desktop,
    bgIcon: BgAIDev,
    label: 'Desktop App Development',
    heading: 'Desktop App Development',
    intro:
      'Native and cross-platform desktop applications for Windows, macOS, and Linux. Built for performance and reliability.',
    bullets: [
      'Electron & Tauri apps',
      'Windows / macOS / Linux support',
      'System-level integrations',
      'Auto-update & deployment pipelines',
    ],
    techStack: ['Electron', 'Tauri', 'React', 'Python', 'SQLite'],
    members: 3,
  },
  {
    id: 'business',
    icon: Business,
    bgIcon: BgAIDev,
    label: 'Business Development & Consulting',
    heading: 'Business Development & Consulting',
    intro:
      'Strategic consulting to help you scale, automate, and optimize your business processes using the right technology stack.',
    bullets: [
      'Tech stack advisory',
      'Process automation & optimization',
      'Digital transformation roadmaps',
      'Startup & product strategy',
    ],
    techStack: ['Notion', 'Jira', 'Zapier', 'Make', 'HubSpot'],
    members: 2,
  },
  {
    id: 'creative',
    icon: CreativeMedia,
    bgIcon: BgAIDev,
    label: 'Creative Media',
    heading: 'Creative Media',
    intro:
      'Brand identity, motion graphics, video production, and social media content that makes your brand stand out.',
    bullets: [
      'Logo & brand identity design',
      'Motion graphics & animation',
      'Social media content creation',
      'Video editing & production',
    ],
    techStack: ['Adobe Suite', 'Figma', 'After Effects', 'Premiere Pro', 'Blender'],
    members: 3,
  },
  {
    id: 'fullstack',
    icon: FullStack,
    bgIcon: BgAIDev,
    label: 'Full Stack & AI Engineer',
    heading: 'Full Stack & AI Engineer',
    intro:
      'Hire dedicated full-stack or AI engineers who integrate directly into your team and workflow for long-term projects.',
    bullets: [
      'Vetted senior engineers',
      'Full-time or part-time engagement',
      'Direct Slack/GitHub integration',
      'Weekly progress reports',
    ],
    techStack: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
    members: 6,
  },
];

export const ourProcess = [
  {
    step: 1,
    icon: DP,
    title: 'Discovery',
    description:
      'Requirements gathering, data audit, feasibility analysis.',
  },
  {
    step: 2,
    icon: DPrep,
    title: 'Data Prep',
    description:
      'Cleaning, labeling, feature engineering.',
  },
  {
    step: 3,
    icon: MD,
    title: 'Model Dev',
    description:
      'Training, evaluation, hyperparameter tuning.',
  },
  {
    step: 4,
    icon: Int,
    title: 'Integration',
    description:
      'API wrapping, frontend hooks, testing.',
  },
  {
    step: 5,
    icon: DP,
    title: 'Deployment',
    description:
      'Cloud deploy, monitoring setup, handover.',
  },
]

export const MEMBER_DATA = {
  ai: [
    { src: Ali,   letter: 'A' },
    { src: SajeelSir,   letter: 'S' }
  ],
  flutter: [
    { src: Hira, letter: 'H' },
  ],
  web: [
      { src: SehrozSir, letter: 'S' },
      { src: Zeeshan,   letter: 'Z' },
      { src: haseeb,    letter: 'H' },
  ],
  desktop: [
    { src: SehrozSir, letter: 'S' },
    { src: Zeeshan,   letter: 'Z' },
    { src: haseeb,    letter: 'H' },
  ],
  business: [
    { src: MudassarSir,   letter: 'M' },
    { src: Samia,   letter: 'S' },
  ],
  creative: [
    { src: Hira, letter: 'H' },
    { src: Shahwar, letter: 'S' },
  ],
  fullstack: [
    { src: SehrozSir,   letter: 'S' },
    { src: Ali,   letter: 'A' },
    { src: SajeelSir,   letter: 'S' }
  ],
};

export { ArrowBack, Project, Curve1, Curve2, ProcessBg, ArrowDown, ArrowUp };