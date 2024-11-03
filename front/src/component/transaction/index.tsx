import React from 'react';
import './index.css';
import StripeIcon from '../../svg/stripe.svg';      
import CoinbaseIcon from '../../svg/coinbase.svg';  
import HumanIcon from '../../svg/human.svg';       


interface TransactionProps {
  source: 'stripe' | 'coinbase' | 'human';  
  name: React.ReactNode;
  time: string;
  type: 'Receipt' | 'Sending';
  amount: number;
  amountClass?: string;
}

const Transaction: React.FC<TransactionProps> = ({ source, name, time, type, amount, amountClass }) => {
  const isSending = type === 'Sending';

  // Визначаємо логіку вибору іконки залежно від джерела транзакції
  let logo;
  switch (source) {
    case 'stripe':
      logo = StripeIcon;
      break;
    case 'coinbase':
      logo = CoinbaseIcon;
      break;
    case 'human':
      logo = HumanIcon;
      break;
    default:
      logo = HumanIcon; 
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Додаємо провідний нуль
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Місяці починаються з 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // Додаємо провідний нуль
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Додаємо провідний нуль

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  return (
    <div className="transaction-row">
      <img src={logo} alt="Payment Logo" className="transaction-logo" />
      <div className="transaction-details">
        <div className="transaction-name">{name}</div>
        <div className="transaction-time">
          {formatDate(time)}{" "}
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
