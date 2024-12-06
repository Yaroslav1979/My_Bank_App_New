import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from "../../component/title";
import Page from '../../component/page';
import { AuthContext } from '../../context/authContext';
import './index.css';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  address?: string;
  system?: string;
  type: 'debit' | 'credit';
}

const TransactionPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);

// Функція для форматування дати
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};


    useEffect(() => {
    if (!authContext || !authContext.state.user?.id) {
      console.error('User ID is missing. Cannot proceed with payment.');
      setError('Не вдалося визначити користувача. Будь ласка, увійдіть у свій акаунт.');
      return;
    }

    const userId = authContext.state.user.id;  // Отримуємо userId з контексту

    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/transaction/${transactionId}?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Не вдалося завантажити деталі транзакції');
        }

        const data: Transaction = await response.json();
        setTransaction(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId, authContext]); // Додаємо authContext до списку залежностей

   if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }
  
  if (!transaction) {
    return <div>Завантаження...</div>;
  }

  const isReceiving = transaction.type === 'credit';

  return (
    <Page pageTitle="Transaction Details">
      <div className='transaction-wrapper'>
        <Title>
          <h1 className='transaction-title__sum' style={{ color: isReceiving ? '#26BF80' : '#1D1D1F' }}>
            {isReceiving ? `+${transaction.amount.toFixed(2)}` : `-${transaction.amount.toFixed(2)}`}
          </h1>
        </Title>
        <div className='transaction-block'>
          <p className='transaction__note'> Дата: <span>{formatDate(transaction.date)}</span> </p>
          <p className='transaction__note'> Адреса: <span>{transaction.address || transaction.system}</span> </p>
          <p className='transaction__note'> Тип: <span>{transaction.type === 'debit' ? 'Send' : 'Receive'}</span> </p>
        </div>
      </div>
    </Page>
  );
};

export default TransactionPage;




