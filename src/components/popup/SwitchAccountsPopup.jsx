import React, { useEffect, useState } from 'react';
import './SwitchAccountPopup.css';
import CloseVector from '../../assets/images/CloseVector.svg';
import Profile from '../../assets/images/Profile.png';
import VectorTick from '../../assets/images/VectorTick.svg';
import AddAccount from '../../assets/images/AddAccount.svg';
import ManageUsers from '../../assets/images/ManageUsers.svg';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { baseURL } from '../../config';
import { FiPlus, FiUserPlus, FiX } from 'react-icons/fi';

const SwitchAccountsPopup = ({ onClose, onAddAccount, onManageAccount }) => {
  const { tokens, user, switchAccount } = useAuth();
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokens || tokens.length === 0) return;

    setLoading(true);
    const fetchProfiles = async () => {
      const results = {};
      await Promise.all(
        tokens.map(async (acc) => {
          try {
            const res = await axios.get(`${baseURL}/user`, {
              headers: { Authorization: `Bearer ${acc.token}` },
            });
            results[acc.email] = res.data.user || res.data;
          } catch {
            results[acc.email] = null;
          }
        }),
      );
      setProfiles(results);
      setLoading(false);
    };

    fetchProfiles();
  }, [tokens]);

  return (
    <section className="my-team-overlay">
      <div className="switch-account-popup">
        <div className="d-flex justify-content-between">
          <h2 className="switch-account-popup-h2">Switch accounts</h2>
          <FiX onClick={onClose} size={18} className="switch-account-popup-img" />
        </div>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #DE3996',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        ) : (
          <div className='switch-acounts-list-scroll'>
          {[...tokens]
            .sort((a, b) => b.is_active - a.is_active)
            .map((acc) => {
              const profile = profiles[acc.email] || {};
              let profileImg = '';
              if (profile?.avatar) {
                profileImg = profile.avatar.startsWith('http')
                  ? profile.avatar
                  : `storage/${profile.avatar.replace(/^\//, '')}`;
              } else if (profile?.image) {
                profileImg = profile.image.startsWith('http')
                  ? profile.image
                  : `storage/${profile.image.replace(/^\//, '')}`;
              }

              return (
                <div
                  key={acc.email}
                  className="switch-account-content d-flex justify-content-between"
                >
                  <div className="d-flex gap-3 align-items-center justify-content-center">
                    {profileImg ? (
                      <img
                        src={profileImg}
                        alt="User"
                        className="switch-account-img"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <div
                        className="user-avatar"
                        style={{
                          background: '#fceded',
                          color: '#DE3996',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 18,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          margin: '0px',
                          border: '1px solid #DE3996',
                        }}
                      >
                        {(profile?.name
                          ? profile.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)
                          : profile?.email?.[0] || 'U'
                        ).toUpperCase()}
                      </div>
                    )}
                    <div className="d-flex flex-column mt-4">
                      <h2
                        className="switch-account-popup-h2"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      >
                        {profile?.name || ''}
                      </h2>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#8D8D8D',
                          marginTop: '-7px',
                        }}
                      >
                        {profile?.email || ''}
                      </p>
                    </div>
                  </div>
                  {acc.is_active === 1 && <img src={VectorTick} alt="active" />}
                </div>
              );
            })}
          </div>
        )}

        <hr />

        <div className="d-flex flex-column">
          <div className="d-flex gap-3" onClick={onAddAccount}>
            <FiPlus size={18} className="switch-account-popup-img" />
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                color:
                  document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'white'
                    : '#262626',
              }}
            >
              Add another account
            </h2>
          </div>

          <div className="d-flex gap-3 mt-2" onClick={onManageAccount}>
            <FiUserPlus size={18} className="switch-account-popup-img" />
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                color:
                  document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'white'
                    : '#262626',
              }}
            >
              Manage accounts
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ManageAccountsPopup = ({ onClose }) => {
  const { tokens, removeAccount, switchAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (!tokens || tokens.length === 0) return;

    setLoading(true);
    const fetchProfiles = async () => {
      const results = {};
      await Promise.all(
        tokens.map(async (acc) => {
          try {
            const res = await axios.get(`${baseURL}/user`, {
              headers: { Authorization: `Bearer ${acc.token}` },
            });
            results[acc.email] = res.data.user || res.data;
          } catch (err) {
            results[acc.email] = null; // fallback agar fail ho jaye
          }
        }),
      );
      setProfile(results);
      setLoading(false);
    };

    fetchProfiles();
  }, [tokens]);

  return (
    <section className="my-team-overlay">
      <div className="manage-account-popup">
        <div className="d-flex justify-content-between">
          <h2 className="manage-account-popup-h2">Manage accounts</h2>
          <FiX onClick={onClose} size={18} className="switch-account-popup-img" />
        </div>

        <p style={{ fontWeight: 500, fontSize: 14, color: '#525252' }}>
          You can individually remove an account that belongs to you from this device.
        </p>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #DE3996',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        ) : (
          [...tokens]
            .sort((a, b) => b.is_active - a.is_active)
            .map((acc) => {
              const userProfile = profile[acc.email] || {};
              let profileImg = '';

              if (userProfile?.avatar) {
                profileImg = userProfile.avatar.startsWith('http')
                  ? userProfile.avatar
                  : `storage/${userProfile.avatar.replace(/^\//, '')}`;
              } else if (userProfile?.image) {
                profileImg = userProfile.image.startsWith('http')
                  ? userProfile.image
                  : `storage/${userProfile.image.replace(/^\//, '')}`;
              }

              return (
                <div
                  key={acc.email}
                  className="switch-account-content d-flex justify-content-between"
                >
                  <div
                    className="d-flex gap-3 align-items-center justify-content-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      switchAccount(acc.email);
                      window.location.reload();
                    }}
                  >
                    {profileImg ? (
                      <img
                        src={profileImg}
                        alt="User"
                        className="switch-account-img"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <div
                        className="user-avatar"
                        style={{
                          background: '#fceded',
                          color: '#DE3996',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 18,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          margin: '0px',
                          border: '1px solid #DE3996',
                        }}
                      >
                        {(userProfile?.name
                          ? userProfile.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)
                          : userProfile?.email?.[0] || 'U'
                        ).toUpperCase()}
                      </div>
                    )}

                    <div className="d-flex flex-column mt-4">
                      <h2
                        className="manage-account-popup-h2"
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {userProfile?.name || ''}
                      </h2>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#8D8D8D',
                          marginTop: '-7px',
                        }}
                      >
                        {userProfile?.email || ''}
                      </p>
                    </div>
                  </div>

                  {acc.is_active === 1 ? (
                    <button className="manage-account-cancel-btn" style={{ cursor: 'no-drop' }}>
                      Current
                    </button>
                  ) : (
                    <button className="manage-account-btn" onClick={() => removeAccount(acc.email)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })
        )}
      </div>
    </section>
  );
};

export default SwitchAccountsPopup;
