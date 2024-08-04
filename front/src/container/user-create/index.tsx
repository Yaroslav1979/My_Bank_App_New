import React, { useState } from 'react';
import Title from "../../component/title";
import RegisterForm from '../../component/register-form';
import Subtitle from "../../component/subtitle";
import FormLink from "../../component/form-link";
import Page from "../../component/page";
import warning from "../../svg/warning.svg";
import "./index.css";

interface ContainerProps {
  children?: React.ReactNode;      
}

const Container: React.FC<ContainerProps> = ({children}) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleError = (message: string) => {
    setWarningMessage(message);
  };

  return (
    <Page>     
      <div className="head">     
        <Title>Sign up</Title>
        <Subtitle>Choose a registration method</Subtitle>
      </div>
      <RegisterForm onError={handleError}>
        <FormLink text="Already have an account? " linkText="Sign In" linkHref='/user-enter' />
      </RegisterForm> 
      {warningMessage && (
        <span className="warning">
          <img src={warning} alt="error" /> <span>{warningMessage}</span>
        </span>
      )}
      {children} 
    </Page>
  );
}

export default Container;