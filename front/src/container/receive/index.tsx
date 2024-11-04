import React, { useState, useContext } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
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
  const dispatch = authContext?.dispatch;

  const handlePayment = async (paymentSystem: string) => {
    setError(null);

    if (!sum || Number(sum) <= 0 || isNaN(Number(sum))) {
      setError("Сума має бути більша за 0 і бути числом");
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/balance-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(sum),
          type: 'credit',  // Це поповнення, тому тип "credit"
          system: paymentSystem, // Можна також передавати інформацію про систему
        }),
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

