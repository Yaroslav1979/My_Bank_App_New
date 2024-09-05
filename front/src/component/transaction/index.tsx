import React from 'react';
import './index.css';

interface TransactionProps {
  logo: string;
  name: string;
  time: string;
  type: 'Receipt' | 'Sending';
  amount: number;
}

const Transaction: React.FC<TransactionProps> = ({ logo, name, time, type, amount }) => {
  return (
    <div className="transaction-row">
      <img src={logo} alt="Payment Logo" className="transaction-logo" />
      <div className="transaction-details">
        <div className="transaction-name">{name}</div>
        <div className="transaction-time">{time} {""}
          <span className="transaction-type">{type}</span>
        </div>
      </div>
      <div className={`transaction-amount ${amount >= 0 ? 'positive' : 'negative'}`}>
        {amount >= 0 ? '+' : '-'}${Math.abs(amount).toFixed(2)}
      </div>
    </div>
  );
};

export default Transaction;