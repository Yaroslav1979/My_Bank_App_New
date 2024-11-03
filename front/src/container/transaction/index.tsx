import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from "../../component/title";
import Page from '../../component/page';
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

  // Функція для форматування дати
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Додаємо провідний нуль
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Місяці починаються з 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // Додаємо провідний нуль
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Додаємо провідний нуль

    // Формат дати: "день.місяць.рік години:хвилини"
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/transaction/${transactionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Не вдалося завантажити деталі транзакції');
        }

        const data: Transaction = await response.json(); // Використання типізації
        setTransaction(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Перевірка на помилку
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




// import React from 'react';
// import './index.css';
// import Title from "../../component/title";
// import Page from '../../component/page';




// export default function Container(
//   {children}: {children?: React.ReactNode,
     
//   } ): JSX.Element {
//     return (
//       <Page pageTitle="Transaction"> 
//       <div className='transaction-wrapper'>
//       <Title children={ <h1 className='transaction-title__sum'>{100.20}</h1> }/>
//         <div className='transaction-block'>
//           <p className='transaction__note'> Date: <span>25 May, 15:20</span> </p>
//           <p className='transaction__note'> Address: <span>user@email.uk</span> </p>
//           <p className='transaction__note'> Type: <span>Receive</span> </p>
//         </div>
//           </div>
//       </Page>
      

//   );
// }