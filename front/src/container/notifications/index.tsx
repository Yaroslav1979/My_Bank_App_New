import React from 'react';
import './index.css';
import Notification from '../../component/notification';
import Page from '../../component/page';

import Iconbell from '../../svg/bell-black.svg';
import Iconworning from '../../svg/danger.svg';


export default function Container(
  {children}: {children?: React.ReactNode,
     
  } ): JSX.Element {
    return (
      <Page pageTitle="Notifications"> 
      <div className='notification-block'>     
        <Notification 
          icon={<img src={Iconbell} alt="Notification Icon" className="notification__type-icon"/>}
          title="New reward system" 
          timeAgo="10 min. ago" 
          type="Announcement"/>
          
          <Notification 
          icon={<img src={Iconworning} alt="Notification Icon" className="notification__type-icon"/>}
          title="New login" 
          timeAgo="20 min. ago" 
          type="Warning"/>
          </div>
      </Page>
      

  );
}