import React from 'react';
import UpgradeCoin from '../../assets/images/UpgradeCoin.svg';
import './GenerationCoinCost.css';

const GenerationCoinCost = ({ amount }) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return null;

  return (
    <span className="generation-coin-cost" title={`${value.toLocaleString()} coins will be deducted`}>
      <span className="generation-coin-cost-line" aria-hidden="true" />
      <img src={UpgradeCoin} alt="" />
      <span className="generation-coin-cost-value">{value.toLocaleString()}</span>
    </span>
  );
};

export default GenerationCoinCost;
