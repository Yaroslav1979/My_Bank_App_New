import React from 'react';
import './index.css';

interface NotificationProps {
  icon:  React.ReactNode;
  title: string;
  timeAgo: string;
  type: string;
 
}

const Notification = ({ icon, title, timeAgo, type }: NotificationProps) => {
  return (    
    <div className="notification__wrapper">
      {icon}
      <div className="notification">
        <div className="notification__title">{title}</div>
        <div className="notification__time">{timeAgo} {" - "}
          <span className="notification__type">{type}</span>
        </div>
      </div>
     
    </div>
  );
};

export default Notification;