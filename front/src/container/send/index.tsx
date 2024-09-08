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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Проста валідація
    if (!email || !sum) {
      setError("Введіть email та суму");
      return;
    }

    if (isNaN(Number(sum))) {
      setError("Сума має бути числом");
      return;
    }

    navigate("/confirmation");
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
        </form>
      </div>
    </Page>
  );
};

export default SendSum;