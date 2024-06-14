import React from "react";
import Title from "../../component/title"
import RegisterForm from '../../component/fields';


export default function Container(
  {children}: {children?: React.ReactNode,
    onCreate?: boolean,
    placeholder?: string,
    button?: boolean,
    id?: string,    
  } ): JSX.Element {
    return (
    <div>     
    <Title>Sign up {children} </Title>
    <RegisterForm />     
  </div>
  );
}
