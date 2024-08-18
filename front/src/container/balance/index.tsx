// import { Link } from 'react-router-dom';
import Title from "../../component/title";
// import Button from '../../component/button';
import Subtitle from "../../component/subtitle";
import BackgroundBalance from "../../png/bg-small.png";
import SetingsButton from "../../svg/seting.svg";
import NotificationsButton from "../../svg/bell-white.svg";
import Transaction from "../../component/transaction";
import ReceiveButton from "../../svg/arrow-down-right.svg";
import SendButton from "../../svg/people-upload.svg";

import "./index.css";

export default function Container(
  {children}: {children?: React.ReactNode,
    onCreate?: boolean,
    placeholder?: string,
    button?: boolean,
    id?: string,    
  } ): JSX.Element {
    return (
      <section className="start balance"> 
      <img src={BackgroundBalance} alt="background" className="bgd-small" />
      
      <div className="head head__balance">     
        <div className="subhead">
        <img src={SetingsButton} alt="Setings" className="icon" />
        <Subtitle > <div className="subtitle__balance"> Main wallet</div> </Subtitle>
        <img src={NotificationsButton} alt="Notifications" className="icon" />
      </div>

        <Title> <div className="title__balance ">$ <span className="dollar">{`${100}`}<span className="cent">`${.00}`</span ></span> </div></Title>
      </div>

      <div className="buttons__wrapper">
        <button className="button__transaction">
          <img src={ReceiveButton} alt="Receive" className="icon icon__transaction" />
          <p>Receiv</p>
        </button>

        <button className="button__transaction">
          <img src={SendButton} alt="Send" className="icon icon__transaction" />
          <p>Send</p>
        </button>
      </div>

      <div className="balance__buttons">  
              
      <div>
      <Transaction
        logo="https://example.com/logo.png"
        name="John Doe"
        time="2024-08-06 12:34"
        type="Receipt"
        amount={+100.50}
      />
      <Transaction
        logo="https://example.com/logo.png"
        name="PayPal"
        time="2024-08-05 09:21"
        type="Sending"
        amount={-50.75}
      />
    </div>
        
      </div>
    </section>
  );
}




