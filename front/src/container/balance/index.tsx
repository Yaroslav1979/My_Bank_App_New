import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from "../../component/title";
import Subtitle from "../../component/subtitle";
import BackgroundBalance from "../../png/bg-small.png";
import SettingsButton from "../../svg/setting.svg";
import NotificationsButton from "../../svg/bell-white.svg";
import Transaction from "../../component/transaction";  
import ReceiveButton from "../../svg/arrow-down-right.svg";
import SendButton from "../../svg/people-upload.svg";
import FormLink from "../../component/form-link";
import Button from "../../component/button"; 
import "./index.css";

const BalancePage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const response = await fetch('http://localhost:4000/balance', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',            
          },          
        }
      );
        
        if (!response.ok) {
          throw new Error('Не вдалося завантажити дані про баланс');
        }

        const data = await response.json();
        console.log("Дані балансу:", data);
        setBalance(data.balance);
        setTransactions(data.transactions);
       
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBalanceData();
    
  }, []);

  // Функція для обробки кліка на транзакцію
  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transaction/${transactionId}`); // Перенаправлення на сторінку транзакції
  };

  return (
    <section className="start balance"> 
      <img src={BackgroundBalance} alt="background" className="bgd-small" />
      
      <div className="head head__balance">     
        <div className="subhead">
          <FormLink linkHref="/settings" linkText={<img src={SettingsButton} alt="Settings" className="icon" />} />
          <Subtitle> <div className="subtitle__balance"> Main wallet</div> </Subtitle>
          <FormLink linkHref="/notifications" linkText={<img src={NotificationsButton} alt="Notifications" className="icon" />} />
        </div>

        <Title> 
          <div className="title__balance ">
            $ <span className="dollar">{`${balance}`}<span className="cent">{`.00`}</span ></span> 
          </div>
        </Title>
      </div>

      <div className="buttons__wrapper">
        <button className="button__transaction" onClick={() => navigate("/receive")}>
          <img src={ReceiveButton} alt="Receive" className="icon icon__transaction" />
          <p>Receive</p>
        </button>

        <button className="button__transaction" onClick={() => navigate("/send")}>
          <img src={SendButton} alt="Send" className="icon icon__transaction" />
          <p>Send</p>
        </button>
      </div>

      <div className="transaction-history">
  {transactions.length > 0 ? (
    transactions.map((transaction) => (
      <Button
        key={transaction.id}
        onClick={() => handleTransactionClick(transaction.id)}
        className="transaction-item" // Вкажіть необхідний клас для стилів
      >
        <Transaction
          logo={transaction.logo}
          name={transaction.name || transaction.system}
          time={transaction.date}
          type={transaction.type === 'debit' ? 'Sending' : 'Receipt'}
          amount={transaction.amount}
          amountClass={transaction.type === 'credit' ? 'amount-credit' : 'amount-debit'}
        />
      </Button>
          ))
        ) : (
          <p>Транзакцій ще немає</p>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
};

export default BalancePage;



//---------------------------------------------------------------

// // import { Link } from 'react-router-dom';
// import Title from "../../component/title";
// // import Button from '../../component/button';
// import Subtitle from "../../component/subtitle";
// import BackgroundBalance from "../../png/bg-small.png";
// import SettingsButton from "../../svg/setting.svg";
// import NotificationsButton from "../../svg/bell-white.svg";
// import Transaction from "../../component/transaction";
// import ReceiveButton from "../../svg/arrow-down-right.svg";
// import SendButton from "../../svg/people-upload.svg";
// import FormLink from "../../component/form-link";
// import { useNavigate } from 'react-router-dom';

// import "./index.css";

// export default function Container(
//   {children}: {children?: React.ReactNode,
//     onCreate?: boolean,
//     placeholder?: string,
//     button?: boolean,
//     id?: string,    
//   } ): JSX.Element {
//     const navigate = useNavigate();
//     return (
//       <section className="start balance"> 
//       <img src={BackgroundBalance} alt="background" className="bgd-small" />
      
//       <div className="head head__balance">     
//         <div className="subhead">
        
//         <FormLink linkHref="/settings" linkText={<img src={SettingsButton} alt="Settings" className="icon" />} />

//         <Subtitle > <div className="subtitle__balance"> Main wallet</div> </Subtitle>
        
//         <FormLink linkHref="/notifications" linkText={<img src={NotificationsButton} alt="Notifications" className="icon" />} />
        
//       </div>

//         <Title> <div className="title__balance ">$ <span className="dollar">{`${100}`}<span className="cent">{`.00`}</span ></span> </div></Title>
//       </div>

//       <div className="buttons__wrapper">
//         <button className="button__transaction" onClick={() => navigate("/receive")}>
//           <img src={ReceiveButton} alt="Receive" className="icon icon__transaction" />
//           <p>Receive</p>
//         </button>

//         <button className="button__transaction" onClick={() => navigate("/send")}>
//           <img src={SendButton} alt="Send" className="icon icon__transaction" />
//           <p>Send</p>
//         </button>
//       </div>

//       <div className="balance__buttons">  
              
//       <div className="transaction-link">
//       <FormLink linkHref="/transaction" linkText={
//         <Transaction
//         logo="../../svg/stripe.svg"
//         name={<p className="transaction-link__name"> Stripe</p>}
//         time="12:25"
//         type="Sending"
//         amount={+125.00}
//       />}
//        />

//       <FormLink linkHref="/transaction" linkText={
//          <Transaction
//          logo="../../svg/human.svg"
//          name={<p className="transaction-link__name"> Oleg V.</p>}
//          time="12:25"
//          type="Receipt"
//          amount={-200.50}
//        />}  
//        />
    
     
     
//     </div>
        
//       </div>
//     </section>
//   );
// }




