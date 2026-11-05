import { useEffect, useState } from 'react';
import { baseURL } from '../config';
import { useAuth } from '../context/AuthContext';

const COST_KEYS = ['text_to_3d', 'image_to_3d', 'images_to_3d', 'video_to_3d'];

const toAmount = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  return null;
};

export const emptyGenerationCoinCosts = () => ({
  text_to_3d: null,
  image_to_3d: null,
  images_to_3d: null,
  video_to_3d: null,
});

export const parseGenerationCoinCosts = (payload) => {
  const costs = emptyGenerationCoinCosts();
  const source = payload?.credit_costs || payload?.data?.credit_costs;
  if (!source || typeof source !== 'object') return costs;

  COST_KEYS.forEach((key) => {
    const amount = toAmount(source[key]);
    if (amount != null && amount >= 0) costs[key] = amount;
  });

  return costs;
};

export const readCreditBalance = (payload) => {
  const amount = toAmount(payload?.credits ?? payload?.data?.credits);
  return amount != null && amount >= 0 ? amount : 0;
};

export const parseCreditShortage = (message) => {
  const text = String(message || '').trim();
  if (!/not enough credit|insufficient credit/i.test(text)) return null;
  const neededMatch = text.match(/need(?:s)?\s+(\d+)/i);
  const balanceMatch = text.match(/have\s+(\d+)/i);
  return {
    needed: neededMatch ? Number(neededMatch[1]) : null,
    balance: balanceMatch ? Number(balanceMatch[1]) : 0,
  };
};

const fetchUserPayload = async (token) => {
  if (!token) return null;

  const response = await fetch(`${baseURL}/user`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
};

export const fetchGenerationCoinCosts = async (token) => {
  const data = await fetchUserPayload(token);
  if (!data) return emptyGenerationCoinCosts();
  return parseGenerationCoinCosts(data);
};

export const useGenerationCoinCosts = () => {
  const { token } = useAuth() || {};
  const [costs, setCosts] = useState(emptyGenerationCoinCosts);

  useEffect(() => {
    if (!token) {
      setCosts(emptyGenerationCoinCosts());
      return undefined;
    }

    let cancelled = false;
    fetchGenerationCoinCosts(token)
      .then((next) => {
        if (!cancelled) setCosts(next);
      })
      .catch(() => {
        if (!cancelled) setCosts(emptyGenerationCoinCosts());
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return costs;
};
