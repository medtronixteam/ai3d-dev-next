
import HomeIcon from '../../../assets/icon/HomeIcon.svg';
import WhiteHomeIcon from '../../../assets/icon/WhiteHome.svg';
import ScanIcon from '../../../assets/icon/ScanIcon.svg';
import WhiteScan from '../../../assets/icon/WhiteScan.svg';
import SubscriptionIcon from '../../../assets/icon/SubscriptionIcon.svg';
import WhiteSubscription from '../../../assets/icon/WhiteSubscription.svg';
import SdkIcon from '../../../assets/icon/SdkIcon.svg';
import WhiteSdk from '../../../assets/icon/WhiteSDK.svg';
import ProjectIcon from '../../../assets/icon/ProjectIcon.svg';
import WhiteProject from '../../../assets/icon/WhiteProjects.svg';
import SettingsIcon from '../../../assets/icon/SettingIcon.svg';
import WhiteSetting from '../../../assets/icon/WhiteSetting.svg';
import SupportIcon from '../../../assets/icon/SupportIcon.svg';
import WhiteSupport from '../../../assets/icon/WhiteSupport.svg';

export const sitemap = [
  {
    id: 1,
    title: 'Home',
    icon: {
      light: HomeIcon,
      dark: WhiteHomeIcon,
      active: HomeIcon,
    },
    path: '/3dio/',
  },
  {
    id: 2,
    title: 'Scan new',
    icon: {
      light: ScanIcon,
      dark: WhiteScan,
      active: ScanIcon,
    },
    path: '/3dio/new/scan',
  },
  {
    id: 3,
    title: 'Subscription',
    icon: {
      light: SubscriptionIcon,
      dark: WhiteSubscription,
      active: SubscriptionIcon,
    },
    path: '/3dio/subscription',
  },
  {
    id: 4,
    title: 'API & SDK',
    icon: {
      light: SdkIcon,
      dark: WhiteSdk,
      active: SdkIcon,
    },
    path: '/3dio/api-sdk',
  },
  {
    id: 5,
    title: 'Recent projects',
    icon: {
      light: ProjectIcon,
      dark: WhiteProject,
      active: ProjectIcon,
    },
    path: '/3dio/recent-projects',
    authRequired: true,
  },
];

export const bottomLinks = [
  {
    id: 7,
    title: 'Settings',
    icon: {
      light: SettingsIcon,
      dark: WhiteSetting,
      active: SettingsIcon,
    },
    path: '/3dio/settings/profile',
    authRequired: true,
  },
  {
    id: 8,
    title: 'Support',
    icon: {
      light: SupportIcon,
      dark: WhiteSupport,
      active: SupportIcon,
    },
    path: '/3dio/support',
  },
];
