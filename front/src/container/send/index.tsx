import React, { useState } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import { useNavigate } from 'react-router-dom';
import './index.css';

const SendSum: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sum, setSum] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Проста валідація
    if (!email || !sum) {
      setError("Введіть email та суму");
      return;
    }

    if (isNaN(Number(sum))) {
      setError("Сума має бути числом");
      return;
    }

    try {
      // Виконуємо POST-запит на сервер для транзакції
      const response = await fetch('http://localhost:4000/balance-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: Number(sum),
          type: 'debit',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Щось пішло не так');
      }

      // Показуємо повідомлення про успіх
      setSuccess('Транзакцію успішно виконано!');
      
      // Перенаправляємо користувача на сторінку балансу
      navigate('/balance');
    } catch (err: any) {
      // Виводимо повідомлення про помилку, якщо недостатньо коштів або інша помилка
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