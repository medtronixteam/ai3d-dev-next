import React from 'react';
import { Link, NavLink } from 'react-router-dom';
// import { FiUser, FiSettings, FiLock, FiLogIn, FiCpu, FiUsers, FiCreditCard } from 'react-icons/fi';
// import { FaReact } from 'react-icons/fa';
import './CustomSidebar.css';
import Logo from 'pages/images/logo.png';
import ProfileIcon from '../../../assets/images/ProfileIcon.svg';
import LoginIcon from '../../../assets/images/loginIcon.svg';
import TeamIcon from '../../../assets/images/team.svg';
import SubscriptionIcon from '../../../assets/images/subscriptionIcon.svg';
import ProjectIcon from '../../../assets/images/project.svg';
import AiModel from '../../../assets/images/aimodal.svg'
import Referal from '../../../assets/images/Referal.svg'
import { Gift } from 'lucide-react';

const CustomSidebar = ({ onClose }) => {
  return (
    <>
      <div className="custom-sidebar custom-sidebar-desktop">
        <div className="custom-sidebar-sticky">
          <div className="mb-2 p-2">
            <Link to="/3dio/">
              <img
                className="sidebar-logo-icon platform-logo"
                src={Logo}
                style={{ marginLeft: '0.6rem' }}
                alt="Logo"
              />
            </Link>
          </div>
          <nav
            className="nav flex-column nav-pills"
            style={{ marginLeft: '0.6rem', marginTop: '1rem' }}
          >
            <NavLink to="/3dio/settings/profile" className="nav-link mb-2">
              <img src={ProfileIcon} alt="" style={{ width: '19px' }} /> Your Profile
            </NavLink>
            <NavLink to="/3dio/settings/login" className="nav-link mb-2">
              <img src={LoginIcon} alt="" style={{ width: '19px' }} /> Login
            </NavLink>
            <NavLink to="/3dio/subscription" className="nav-link mb-2">
              <img src={SubscriptionIcon} alt="" style={{ width: '19px' }} /> Subscription
            </NavLink>
            <NavLink to="/3dio/settings/team" className="nav-link mb-2">
              <img src={TeamIcon} alt="" style={{ width: '19px' }} /> Team
            </NavLink>
            {/* <NavLink to="/3dio/settings/project" className="nav-link mb-2">
              <img src={ProjectIcon} alt="" style={{ width: '19px' }} /> Project
            </NavLink>
            <NavLink to="/3dio/settings/aimodal" className="nav-link mb-2">
              <img src={AiModel} alt="" style={{ width: '19px' }} /> AI Model
            </NavLink> */}
            <NavLink to="/3dio/settings/referal" className="nav-link mb-2">
              <Gift size={19} /> Referral
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};
export default CustomSidebar;
