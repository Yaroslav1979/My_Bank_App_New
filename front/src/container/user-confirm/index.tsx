import React from "react";
import Title from "../../component/title"
import RegisterForm from '../../component/fields';
import Subtitle from "../../component/subtitle";
import Page from "../../component/page"

import "./index.css";


export default function Container(
  {children}: {children?: React.ReactNode,
    onCreate?: boolean,
    placeholder?: string,
    button?: boolean,
    id?: string,    
  } ): JSX.Element {
    return (
      <Page>
      <div className="head">     
        <Title>Confirm account {children} </Title>
        <Subtitle> Write the code you received </Subtitle>
        <RegisterForm />     
      </div> 
      </Page>   
  );
}
