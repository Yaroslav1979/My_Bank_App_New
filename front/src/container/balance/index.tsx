// import { Link } from 'react-router-dom';
import Title from "../../component/title";
// import Button from '../../component/button';
import Subtitle from "../../component/subtitle";
import BackgroundBalance from "../../png/bg-small.png";
import SettingsButton from "../../svg/setting.svg";
import NotificationsButton from "../../svg/bell-white.svg";
import Transaction from "../../component/transaction";
import ReceiveButton from "../../svg/arrow-down-right.svg";
import SendButton from "../../svg/people-upload.svg";
import FormLink from "../../component/form-link";
import { useNavigate } from 'react-router-dom';

import "./index.css";

export default function Container(
  {children}: {children?: React.ReactNode,
    onCreate?: boolean,
    placeholder?: string,
    button?: boolean,
    id?: string,    
  } ): JSX.Element {
    const navigate = useNavigate();
    return (
      <section className="start balance"> 
      <img src={BackgroundBalance} alt="background" className="bgd-small" />
      
      <div className="head head__balance">     
        <div className="subhead">
        
        <FormLink linkHref="/settings" linkText={<img src={SettingsButton} alt="Settings" className="icon" />} />

        <Subtitle > <div className="subtitle__balance"> Main wallet</div> </Subtitle>
        
        <FormLink linkHref="/notifications" linkText={<img src={NotificationsButton} alt="Notifications" className="icon" />} />
        
      </div>

        <Title> <div className="title__balance ">$ <span className="dollar">{`${100}`}<span className="cent">{`.00`}</span ></span> </div></Title>
      </div>

      <div className="buttons__wrapper">
        <button className="button__transaction" onClick={() => navigate("/receive")}>
          <img src={ReceiveButton} alt="Receive" className="icon icon__transaction" />
          <p>Receive</p>
        </button>

        <button className="button__transaction" onClick={() => navigate("/send")}>
          <img src={SendButton} alt="Send" className="icon icon__transaction" />
          <p>Send</p>
        </button>
      </div>

      <div className="balance__buttons">  
              
      <div>
      <Transaction
        logo="../../svg/stripe.svg"
        name="Stripe"
        time="12:25"
        type="Sending"
        amount={+125.00}
      />
      <Transaction
        logo="../../svg/human.svg"
        name="Oleg V."
        time="12:25"
        type="Receipt"
        amount={-200.50}
      />
     
    </div>
        
      </div>
    </section>
  );
}




