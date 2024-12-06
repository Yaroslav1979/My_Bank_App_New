import React, { useState, useContext } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import './index.css';

const SendSum: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sum, setSum] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const dispatch = authContext?.dispatch;

  if (!authContext || !authContext.state.user?.id) {
    console.error('User ID is missing. Cannot proceed with payment.');
    return (
      <div className="error">
        <p>Не вдалося визначити користувача. Будь ласка, увійдіть у свій акаунт.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !sum) {
      setError("Введіть email та суму");
      return;
    }

    if (isNaN(Number(sum))) {
      setError("Сума має бути числом");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/balance-transaction/${authContext.state.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext?.state.token} || ''`
        },
        body: JSON.stringify({ 
          amount: Number(sum),
          type: 'debit',
          address: email, 
        }),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
    console.log('Response data:', data);

      if (!data.success) {
        throw new Error(data.error || 'Щось пішло не так');
      }

      setSuccess('Транзакцію успішно виконано!');

      // Додавання події про зняття коштів у нотифікації
      if (dispatch) {
        dispatch({
          type: 'CHANGE_BALANCE',
          payload: { amount: -Number(sum) }, // від'ємне значення для списання коштів
        });
      }

      navigate('/balance');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  return (
    <Page pageTitle="Send">
      <div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-container">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-container">
            <FormInput
              label="Sum"
              type="number"
              name="sum"
              value={sum}
              onChange={(e) => setSum(e.target.value)}
              required
              icon="$"  
            />
          </div>
          <Button type="submit">Send</Button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </Page>
  );
};

export default SendSum;
