import React from 'react';
import './index.css';

interface TransactionProps {
  logo: string;
  name: React.ReactNode;
  time: string;
  type: 'Receipt' | 'Sending';
  amount: number;
  amountClass?: string;
}

const Transaction: React.FC<TransactionProps> = ({ logo, name, time, type, amount, amountClass }) => {
  const isSending = type === 'Sending';
  return (
    <div className="transaction-row">
      <img src={logo} alt="Payment Logo" className="transaction-logo" />
      <div className="transaction-details">
        <div className="transaction-name">{name}</div>
        <div className="transaction-time">
          {time}{" "}
          <span className={`transaction-type ${isSending ? 'sending' : 'receipt'}`}>
            {type}
          </span>
        </div>
      </div>
      <div
        className={`transaction-amount ${isSending ? 'negative' : 'positive'} ${amountClass || ''}`}
      >
        {isSending ? '-' : '+'}${Math.abs(amount).toFixed(2)}
      </div>
    </div>
  );
};

export default Transaction;
