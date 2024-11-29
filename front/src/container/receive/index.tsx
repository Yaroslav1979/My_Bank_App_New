import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import './index.css';

import Stripe from '../../svg/stripe.svg';
import StripePayment from '../../svg/payment-stripe.svg';
import Coinbase from '../../svg/coinbase.svg';
import CoinbasePayment from '../../svg/payment-coinbase.svg';

const ReceiveSum: React.FC = () => {
  const [sum, setSum] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  console.log('AuthContext:', authContext); // Логування контексту
  console.log('User from AuthContext:', authContext?.state.user); //

  const dispatch = authContext?.dispatch;
  
  // Отримуємо userId безпосередньо з state
  

  if (!authContext || !authContext.state.user?.id) {
    console.error('User ID is missing. Cannot proceed with payment.');
    return (
      <div className="error">
        <p>Не вдалося визначити користувача. Будь ласка, увійдіть у свій акаунт.</p>
      </div>
    );
  }
  const userId = authContext.state.user.id;

  const handlePayment = async (paymentSystem: string) => {
    setError(null);
  
    if (!sum || Number(sum) <= 0 || isNaN(Number(sum))) {
      setError("Сума має бути більша за 0 і бути числом");
      return;
    }
  
    const requestData = {
      amount: Number(sum),
      type: 'credit', // Поповнення (credit)
      system: paymentSystem,
      userId, // Додаємо userId
    };
  
    console.log("Sending request with data:", requestData);  // Логування даних
  
    try {
      const response = await fetch('http://localhost:4000/balance-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext?.state.token}`
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error('Помилка при поповненні');
      }
  
      if (dispatch) {
        dispatch({
          type: 'CHANGE_BALANCE',
          payload: { amount: +Number(sum) }, // дотатнє значення для зарахування коштів
        });
      }
  
      navigate("/balance");  // Переходимо на сторінку балансу після успішного поповнення
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className='page--settings'>
      <Page pageTitle="Receive">
        <div>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <p className='recieve-subtitle'>Receive amount</p>
            <div className="form-container">
              <FormInput
                label=""
                type="number"
                name="sum"
                value={sum}
                onChange={(e) => setSum(e.target.value)}
                required
                icon="$"
              />
            </div>
            <hr className='separator'/>
            <p className='recieve-subtitle'>Payment system</p>
            <Button type="button" className='payment-btn' onClick={() => handlePayment('Stripe')}>
              <div className='payment-wrapper'>
                <img src={Stripe} alt="Stripe" />
                <span className='payment-name'>Stripe</span>
                <img src={StripePayment} alt="" />
              </div>
            </Button>

            <Button type="button" className='payment-btn' onClick={() => handlePayment('Coinbase')}>
              <div className='payment-wrapper'>
                <img src={Coinbase} alt="Coinbase" />
                <span className='payment-name'>Coinbase</span>
                <img src={CoinbasePayment} alt="" />
              </div>
            </Button>

            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </Page>
    </div>
  );
};

export default ReceiveSum;

