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

  return (
    <Page pageTitle="Transaction Details">
      <div className='transaction-wrapper'>
        <Title>
          <h1 className='transaction-title__sum'>{transaction.amount}</h1>
        </Title>
        <div className='transaction-block'>
          <p className='transaction__note'> Date: <span>{transaction.date}</span> </p>
          <p className='transaction__note'> Address: <span>{transaction.address || transaction.system}</span> </p>
          <p className='transaction__note'> Type: <span>{transaction.type === 'debit' ? 'Send' : 'Receive'}</span> </p>
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