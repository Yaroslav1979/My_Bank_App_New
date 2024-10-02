import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import Notification from '../../component/notification';
import Page from '../../component/page';
import Iconworning from '../../svg/danger.svg';
import { AuthContext } from '../../context/authContext';

const getTimeAgo = (loginTime: string | null): string => {
  if (!loginTime) return 'Щойно';

  const loginDate = new Date(loginTime);
  const now = new Date();
  const timeDifference = now.getTime() - loginDate.getTime();

  const minutesAgo = Math.floor(timeDifference / (1000 * 60));
  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

  if (minutesAgo < 1) {
    return 'Менше хвилини тому'; 
  } else if (minutesAgo < 60) {
    return `${minutesAgo} хв. тому`; 
  } else {
    return `${hoursAgo} год. тому`; 
  }
};

export default function Container({ children }: { children?: React.ReactNode }): JSX.Element {
  const authContext = useContext(AuthContext);
  const [loginHistory, setLoginHistory] = useState<Array<{ loginTime: string }> | null>(null);

  useEffect(() => {
    if (authContext?.state.loginHistory) {
      setLoginHistory(authContext.state.loginHistory);
    }
  }, [authContext?.state.loginHistory]);

  return (
    <Page pageTitle="Notifications">
      <div className="notification-block">
        {loginHistory && loginHistory.length > 0 ? (
          loginHistory.map((entry, index) => (
            <Notification
              key={index}
              icon={<img src={Iconworning} alt="Notification Icon" className="notification__type-icon" />}
              title="Новий вхід"
              timeAgo={getTimeAgo(entry.loginTime)}
              type="Warning"
            />
          ))
        ) : (
          <p>Немає записів про вхід.</p>
        )}
      </div>
    </Page>
  );
}