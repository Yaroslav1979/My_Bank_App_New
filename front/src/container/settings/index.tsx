import React, { useState, useContext } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import ButtonLogout from "../../component/button-logout";
import Success from "../../component/success";
import { AuthContext } from '../../context/authContext';
import './index.css';

const Settings: React.FC = () => {
  const authContext = useContext(AuthContext);

  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authContext) {
    return <p>Помилка: неможливо отримати дані користувача</p>;
  }

  const { state } = authContext;
  const userId = state.user?.id;

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Введіть вірно електронну адресу");
      return;
    }

    if (!state.token || !userId) {
      setError("Не вдалося ідентифікувати користувача");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/settings-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ userId, newEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Email успішно змінено!");
        authContext.dispatch({ type: 'CHANGE_EMAIL', payload: { user: data.user, token: data.token } });
      } else {
        setError(data.error || "Не вдалося змінити email");
      }
    } catch (error) {
      setError("Щось пішло не так");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!oldPassword || !newPassword) {
      setError("Заповніть усі поля");
      return;
    }

    if (!state.token || !userId) {
      setError("Не вдалося ідентифікувати користувача");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/settings-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Пароль успішно змінено!");
        authContext.dispatch({ type: 'CHANGE_PASSWORD', payload: { user: data.user, token: data.token } });
      } else {
        setError(data.error || "Не вдалося змінити пароль");
      }
    } catch (error) {
      setError("Щось пішло не так");
    }
  };

  return (
    <Page pageTitle="Settings">
      <div>
        <form className="form" onSubmit={handleEmailChange}>
          <p className='recieve-subtitle'>Змінити email</p>
          <div className="form-container">
            <FormInput
              label="Новий email"
              type="email"
              name="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <FormInput
              label="Пароль"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className='setting-btn'>Зберегти Email</Button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        <form className="form" onSubmit={handlePasswordChange}>
          <p className='recieve-subtitle'>Змінити пароль</p>
          <div className="form-container">
            <FormInput
              label="Старий пароль"
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <FormInput
              label="Новий пароль"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" className='setting-btn'>Зберегти Пароль</Button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        <ButtonLogout />

        {successMessage && <Success message={successMessage} />}
      </div>
    </Page>
  );
};

export default Settings;