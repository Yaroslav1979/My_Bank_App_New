import React, { useState } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import { useNavigate } from 'react-router-dom';
import './index.css';

import Stripe from '../../svg/stripe.svg';
import StripePayment from '../../svg/payment-stripe.svg';
import Coinbase from '../../svg/coinbase.svg';
import CoinbasePayment from '../../svg/payment-coinbase.svg';

const ReceiveSum: React.FC = () => {
  
  const [sum, setSum] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    
    if ( !sum) {
      setError("Введіть суму");
      return;
    }

    if (isNaN(Number(sum))) {
      setError("Сума має бути числом");
      return;
    }

    navigate("/confirmation");
  };

  return (
    <div className='page--settings'>
    <Page pageTitle="Receive">
      <div>
        <form className="form" onSubmit={handleSubmit}>
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
          <Button type="submit" 
          className='payment-btn'
          >
            <div className='payment-wrapper'> 
            <img src={Stripe} alt="Stripe" /> 
            <span className='payment-name'> Stripe </span> 
            <img src={StripePayment} alt="" />
            </div>
          </Button>

          <Button type="submit" 
          className='payment-btn'
          >
            <div className='payment-wrapper'> 
            <img src={Coinbase} alt="Coinbase" /> 
            <span className='payment-name'> Coinbase </span> 
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