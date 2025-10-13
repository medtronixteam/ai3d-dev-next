import React, { useEffect, useMemo, useState } from 'react';
import './ReferralPage.css';
import airoplan from '../../assets/images/airoplan.png';
import branded_stars from '../../assets/images/token-branded_stars.png';
import partyCard from '../../assets/images/party-card.png';
import launching from '../../assets/images/launching.png';
import checkCircle from '../../assets/images/check-circle.png';
import Substars from '../../assets/images/SubStars.svg';
import ReferalShare from '../../assets/images/referalShare.svg';
import Whatsapp from '../../assets/images/Whatsapp.svg';
import Telegram from '../../assets/images/Telegram.png';
import CopyLink from '../../assets/images/CopyLink.png';
import { FiFacebook, FiGithub, FiInstagram, FiLink, FiLinkedin, FiSend } from 'react-icons/fi';
import axios from 'axios';
import { baseURL } from '../../config';
import { GiTick } from 'react-icons/gi';
import { FaCheck } from 'react-icons/fa';

const ReferralPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filter, setFilter] = useState('All');
  const [referralList, setReferralList] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    const style = document.createElement('style');
    style.id = 'hide-scrollbar-style';
    style.innerHTML = `
        html, body { 
          scrollbar-width: none !important;
          -ms-overflow-style: none !important; 
        }
        html::-webkit-scrollbar, 
        body::-webkit-scrollbar { 
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;

    const existingStyle = document.getElementById('hide-scrollbar-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('hide-scrollbar-style');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true); // show "Copied"
      setTimeout(() => setCopied(false), 1000); // reset after 1s
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [listRes, linkRes] = await Promise.all([
          axios.get(`${baseURL}/referral/lists`),
          axios.get(`${baseURL}/referral/link`),
        ]);

        setReferralList(listRes.data?.data || []);

        const rawUrl = linkRes.data?.url || '';
        setInviteLink(rawUrl);
      } catch (err) {
        console.error('Failed to fetch referral data:', err);
        setError('Failed to load referral data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendEmail = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      await axios.post(`${baseURL}/referral/email`, { email });
      setEmail('');
    } catch (err) {
      console.error('Failed to send email invite:', err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const counts = useMemo(() => {
    return {
      All: referralList.length,
      Completed: referralList.filter((r) => r.status === 'Completed').length,
      Pending: referralList.filter((r) => r.status === 'Pending').length,
      Expired: referralList.filter((r) => r.status === 'Expired').length,
    };
  }, [referralList]);

  // filter applied data
  const filteredRecords = useMemo(() => {
    if (filter === 'All') return referralList;
    return referralList.filter((r) => r.status === filter);
  }, [filter, referralList]);

  return (
    <section>
      <div className="referal-page-main-container">
        {/* {loading && <p>Loading referrals...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>} */}

        <div className="position-relative">
          <span className="referal-page-star">
            <img src={branded_stars} alt="Star" />
          </span>
        </div>

        <div className="position-relative">
          <span className="referal-page-share">
            <img src={ReferalShare} alt="Star" />
          </span>
        </div>

        <div className="referal-page-sub-container">
          <h1>Spread the Magic. Stack the Rewards.</h1>
          <span style={{ color: '#DE3996' }}>
            Invite your crew,{' '}
            <span>
              unlock milestones, and climb the
              <br />
              leaderboard to earn premium features, merch, and more.
            </span>
          </span>
        </div>

        <div className="position-relative">
          <span className="referal-page-aeroplain">
            <img src={airoplan} alt="" />
          </span>
        </div>

        <div className="position-relative">
          <span className="referal-page-subStars">
            <img src={Substars} alt="Star" />
          </span>
        </div>

        <div className="referal-page-main-header">
          <div className="referal-page-header">
            <div className="referal-page-main-content">
              <div className="img-container">
                <img src={partyCard} alt="image" />
              </div>
              <div>
                <h3>Invite New Friends</h3>
                <span>
                  Share your link with friends new to
                  <br />
                  Ai3D.
                </span>
              </div>
            </div>

            <div
              className="referal-page-main-content"
              style={{ marginTop: isMobile ? '1.5rem' : '0' }}
            >
              <div className="img-container">
                <img src={launching} alt="image" />
              </div>
              <div>
                <h3>They Get a Starter Pack</h3>
                <span>
                  Your friend receives a special pack of
                  <br />
                  textures, templates, and free renders.
                </span>
              </div>
            </div>

            <div
              className="referal-page-main-content"
              style={{ marginTop: isMobile ? '1.5rem' : '0' }}
            >
              <div className="img-container">
                <img src={checkCircle} alt="image" />
              </div>
              <div>
                <h3>You Get a Creator Pack</h3>
                <span>
                  Unlock advanced assets and extra
                  <br />
                  renders once they get started.
                </span>
              </div>
            </div>
          </div>

          <div className="invite-friends-main-container">
            <h1>Invite friends & get a Creator Pack!</h1>

            <label htmlFor="invite link" className="invite-label mt-4">
              Copy your invite link
            </label>
            <div className="invite-friends-input-control">
              <input
                type="text"
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="https://www.AI3D./?utm_source=referral-program"
                className="invite-input"
              />
              <div className="copy-link-button" onClick={handleCopy}>
                {copied ? (
                  <>
                    <FaCheck size={18} />
                    <span>Copied...</span>
                  </>
                ) : (
                  <>
                    <img src={CopyLink} alt="copy" width={18} height={18} />
                    <span>Copy link</span>
                  </>
                )}
              </div>
            </div>

            <label htmlFor="invite link" className="invite-label mt-3">
              Email your invite
            </label>
            <div className="invite-friends-input-control">
              <input
                type="text"
                placeholder="Email"
                className="invite-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="send-button" onClick={handleSendEmail} style={{ backgroundColor: email ? '#de3996' : '#00000080' }}>
                {loading ? (
                  <>
                    <FiSend size={18} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    <span>Send</span>
                  </>
                )}
              </div>
            </div>
            {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}

            <h3>Invite by Social Media</h3>
            <div className="d-flex gap-2 align-items-center justify-content-center">
              <span className="social-media-invite-links-icons">
                <FiLinkedin size={18} />
              </span>
              <span className="social-media-invite-links-icons">
                <FiFacebook size={18} />
              </span>
              <span className="social-media-invite-links-icons">
                <img src={Whatsapp} alt="" width={18} height={18} />
              </span>
              <span className="social-media-invite-links-icons">
                <FiInstagram size={18} />
              </span>
              <span className="social-media-invite-links-icons">
                <img src={Telegram} alt="" width={18} height={18} />
              </span>
            </div>
          </div>
        </div>

        <div className="referal-page-history-container mt-4">
          <h1>Referral History</h1>

          <div className="d-flex gap-3 mt-2">
            <span
              className={`referal-page-history-buttons ${filter === 'All' ? 'active' : ''}`}
              onClick={() => setFilter('All')}
            >
              All ({counts.All})
            </span>
            <span
              className={`referal-page-history-buttons ${filter === 'Completed' ? 'active' : ''}`}
              onClick={() => setFilter('Completed')}
            >
              Completed ({counts.Completed})
            </span>
            <span
              className={`referal-page-history-buttons ${filter === 'Pending' ? 'active' : ''}`}
              onClick={() => setFilter('Pending')}
            >
              Pending ({counts.Pending})
            </span>
            <span
              className={`referal-page-history-buttons ${filter === 'Expired' ? 'active' : ''}`}
              onClick={() => setFilter('Expired')}
            >
              Expired ({counts.Expired})
            </span>
          </div>

          {filteredRecords.map((item, index) => (
            <div className="referal-page-history-track" key={index}>
              {!isMobile ? (
                <div className="referal-page-history-record">
                  <div className="referal-page-person-record">
                    <h3>{item.name}</h3>
                    <p>{item.email}</p>
                    <p>{item.joined}</p>
                    <p>{item.Awaiting}</p>
                  </div>

                  {item.status !== 'Expired' && (
                    <>
                      <div className="referal-page-person-record d-flex flex-column align-items-center justify-content-center">
                        <h3>Recipient Reward</h3>
                        <p style={{ color: '#00C29F', textAlign: 'center' }}>{item.coins || '0'}</p>
                      </div>

                      <div className="referal-page-person-record d-flex flex-column align-items-center justify-content-center">
                        <h3>Your Reward</h3>
                        <p style={{ color: '#824AF0', textAlign: 'center' }}>
                          {item.rewardCoins || '0'}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="referal-page-person-status-record">
                    <span
                      className={
                        item.status === 'Completed'
                          ? 'status-completed'
                          : item.status === 'Expired'
                            ? 'status-expired'
                            : 'status-pending'
                      }
                    >
                      {item.status || 'pending'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Mobile View  */
                <>
                  <div className="referal-page-mobile-history-record">
                    <div className="referal-page-mobile-person-record">
                      <h3>{item.name}</h3>
                      <p>{item.email}</p>
                      <p>{item.joined}</p>
                      <p>{item.Awaiting}</p>
                    </div>

                    <div className="referal-page-mobile-person-status-record">
                      <span
                        className={
                          item.status === 'Completed'
                            ? 'status-completed'
                            : item.status === 'Expired'
                              ? 'status-expired'
                              : 'status-pending'
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {item.status !== 'Expired' && (
                    <div className="d-flex justify-content-between">
                      <div className="referal-page-mobile-person-record d-flex flex-column mt-2">
                        <h3>Recipient Reward</h3>
                        <p style={{ color: '#00C29F' }}>{item.coins || '-'}</p>
                      </div>

                      <div className="referal-page-mobile-person-record d-flex flex-column mt-2">
                        <h3>Your Reward</h3>
                        <p style={{ color: '#824AF0' }}>{item.rewardCoins || '-'}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferralPage;
