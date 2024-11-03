import React, { useState } from 'react';
import RegisterForm from '../../component/register-form';
import Page from "../../component/page";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import FormLink from "../../component/form-link";
import "./index.css";

const UserEnter: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <Page>
      <div className="head">
        <Title>Sign in</Title>
        <Subtitle>Select login method</Subtitle>
      </div>
      <RegisterForm
        mode="login"
        onError={handleError}
      >
      <FormLink text="Forgot your password? " linkText="Restore" linkHref='/recovery' />
      </RegisterForm>
      {error && <p className="error">{error}</p>}
    </Page>
  );
};

export default UserEnter;