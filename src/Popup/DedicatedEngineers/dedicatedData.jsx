import ALML from '../../assets/service/ALML.svg'
import ArrowUp from '../../assets/service/ArrowUp.svg'
import ArrowDown from '../../assets/service/ArrowDown.svg'
import Backend from '../../assets/service/Backend.svg'
import ContractLength from '../../assets/service/Cl.svg'
import Dedicated from '../../assets/service/dedicated.svg'
import DevOps from '../../assets/service/DevOps.svg'
import Flutter from '../../assets/service/Fluttter.svg'
import Stack from '../../assets/service/Stack.svg'
import Meet from '../../assets/service/Meet.svg'
import Need from '../../assets/service/Need.svg'
import OnBoard from '../../assets/service/OnBoard.svg'
import Ship from '../../assets/service/Ship.svg'
import UIUX from '../../assets/service/UIUX.svg'
import ArrowBack from '../../assets/service/ArrowBack.svg'
import elipse from '../../pages/images/heading_ellipse.png';
import ProcessBg from '../../assets/images/WorkTogether.svg'
import Circle from '../../assets/service/Circle.svg'
import AE from '../../assets/service/AE.svg'
import Cbg from '../../assets/service/CBg.svg'
import group from '../../assets/service/gorup.svg'

export const contractLengthOptions = [
  {
    id: 1,
    icon: null,
    label: 'Part',
    description: 'Flexible part-time engagement for your project needs',
  },
  {
    id: 2,
    icon: ContractLength,
    label: 'Contract Length',
    description: 'Choose the right engagement model for your team',
    isCenter: true,
  },
  {
    id: 3,
    icon: null,
    label: 'Role',
    description: 'Select from a wide range of expert roles',
  },
  {
    id: 4,
    icon: null,
    label: 'Space',
    description: 'Remote or on-site — work the way you prefer',
  },
  {
    id: 5,
    icon: null,
    label: 'Scale',
    description: 'Scale your team up or down as your needs evolve',
  },
]

export const availableEngineers = [
  {
    id: 1,
    icon: Backend,
    label: 'Backend Eng.',
    description: 'Node.js, Python, Java, REST APIs & microservices experts',
  },
  {
    id: 2,
    icon: ALML,
    label: 'AI / ML Eng.',
    description: 'Machine learning, NLP, computer vision & AI integration',
  },
  {
    id: 3,
    icon: Flutter,
    label: 'Flutter Eng.',
    description: 'Cross-platform mobile apps with beautiful native UIs',
  },
  {
    id: 4,
    icon: DevOps,
    label: 'DevOps Eng.',
    description: 'CI/CD, cloud infrastructure, Kubernetes & automation',
  },
  {
    id: 5,
    icon: Stack,
    label: 'Full Stack Eng.',
    description: 'End-to-end development across frontend & backend stacks',
    isCenter: true,
  },
  {
    id: 6,
    icon: UIUX,
    label: 'Frontend Eng.',
    description: 'React, Vue, Angular & pixel-perfect UI implementation',
  },
]

export const ourProcess = [
  {
    step: 1,
    icon: Need,
    title: 'Tell us what you need',
    description:
      'Share your project requirements, tech stack preferences, and timeline so we can find the perfect match.',
  },
  {
    step: 2,
    icon: Meet,
    title: 'Meet the engineers',
    description:
      'We hand-pick top candidates and arrange interviews so you can evaluate skills and cultural fit firsthand.',
  },
  {
    step: 3,
    icon: OnBoard,
    title: 'Onboard in 48 hrs',
    description:
      'Once you select your engineer, we handle all the setup so they are ready to contribute from day one.',
  },
  {
    step: 4,
    icon: Ship,
    title: 'Ship it together',
    description:
      'Your dedicated engineer integrates with your team, tools, and workflows — building and shipping with you.',
  },
]

export const arrowAssets = {
  ArrowUp,
  ArrowDown,
  Dedicated,
  ArrowBack,
  elipse,
  ProcessBg,
  ContractLength,
  AE,
  Circle,
  Cbg,
  Backend,
  Flutter,
  UIUX,
  DevOps,
  Stack,
  group
}