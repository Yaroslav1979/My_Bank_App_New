import React from 'react';
import Title from "../../component/title";
import RegisterForm from '../../component/register-form';
import Subtitle from "../../component/subtitle";
import FormLink from "../../component/form-link";
import Page from "../../component/page";
import "./index.css";

const Container: React.FC = () => {
  return (
    <Page> 
        
      <div className="head">     
        <Title>Sign in</Title>
        <Subtitle>Select login method</Subtitle>
      </div>
      <RegisterForm onError={() => { /* Handle error if needed */ }}>
        <FormLink text="Forgot your password? " linkText="Restore" linkHref='/recovery' />
      </RegisterForm>
     
    </Page>
  );
}

export default Container;