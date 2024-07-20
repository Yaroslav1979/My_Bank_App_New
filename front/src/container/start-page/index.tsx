import React from "react";
import Title from "../../component/title"
import Button from '../../component/button';
import Subtitle from "../../component/subtitle";
import background from "../../png/bg-big.png";
import picture from "../../png/bg-picture.png";

import "./index.css";


export default function Container(
  {children}: {children?: React.ReactNode,
    onCreate?: boolean,
    placeholder?: string,
    button?: boolean,
    id?: string,    
  } ): JSX.Element {
    return (
      <section className="start"> 
      <img src={background} alt="backgrond" className="bgd-main" />
      <img src={picture} alt="backgrond" className="bgd-second" />
      <div className="head">     
        <Title> <div className="title__intro"> Hellow! </div></Title>
        <Subtitle > <div className="subtitle__intro"> Wellcome to bank app</div> </Subtitle>
      </div>
      <div className="start__buttons">
    <Button>Sign Up</Button> 
    <Button>Sign In</Button> 
    </div>
    
    </section>
  );
}
