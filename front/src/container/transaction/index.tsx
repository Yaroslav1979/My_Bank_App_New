import React from 'react';
import './index.css';
import Title from "../../component/title";
import Page from '../../component/page';




export default function Container(
  {children}: {children?: React.ReactNode,
     
  } ): JSX.Element {
    return (
      <Page pageTitle="Transaction"> 
      <div className='transaction-wrapper'>
      <Title children={ <h1 className='transaction-title__sum'>{100.20}</h1> }/>
        <div className='transaction-block'>
          <p className='transaction__note'> Date: <span>25 May, 15:20</span> </p>
          <p className='transaction__note'> Address: <span>user@email.uk</span> </p>
          <p className='transaction__note'> Type: <span>Receive</span> </p>
        </div>
          </div>
      </Page>
      

  );
}