import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../config';

const planLabel = (sub) =>
  String(sub?.type || sub?.name || sub?.plan || sub?.plan_name || '').toLowerCase();

const subscriptionEnded = (sub) => {
  const end = sub?.ends_at || sub?.expiry_date || sub?.expired_at;
  if (!end) return false;
  const time = new Date(end).getTime();
  return Number.isFinite(time) && time < Date.now();
};

export const getTeamAccess = (subscriptions) => {
  const list = Array.isArray(subscriptions) ? subscriptions : [];
  const premiumSubs = list.filter((sub) => planLabel(sub).includes('premium'));
  const active = premiumSubs.find(
    (sub) => String(sub?.status || '').toLowerCase() === 'active' && !subscriptionEnded(sub),
  );
  if (active) return 'premium';
  if (premiumSubs.length) return 'expired';
  return 'other';
};

export const teamAccessMessage = (access) => {
  if (access === 'expired') {
    return 'Your Premium plan has expired. Renew your plan to create a team.';
  }
  return 'Only Premium users can create a team.';
};

export const canCreateTeam = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const subscriptions = res.data?.subscriptions || res.data?.data || [];
    const access = getTeamAccess(subscriptions);
    if (access === 'premium') return true;
    toast.info(teamAccessMessage(access));
    return false;
  } catch (err) {
    toast.error('Could not verify your plan. Please try again.');
    return false;
  }
};
