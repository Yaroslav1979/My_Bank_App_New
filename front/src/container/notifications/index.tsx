import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import Notification from '../../component/notification';
import Page from '../../component/page';
import IconWarning from '../../svg/danger.svg'; // Іконка для попереджень
// import IconSuccess from '../../svg/success.svg'; // Іконка для успіху (зміни email/password)
import { AuthContext } from '../../context/authContext';

// Функція для обчислення часу з моменту події
const getTimeAgo = (eventTime: string | null): string => {
  if (!eventTime) return 'Щойно';

  const eventDate = new Date(eventTime);
  const now = new Date();
  const timeDifference = now.getTime() - eventDate.getTime();

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

interface Event {
  type: 'login' | 'passwordChange' | 'emailChange';
  time: string;
}

export default function Notifications(): JSX.Element {
  const authContext = useContext(AuthContext);
  const [userEvents, setUserEvents] = useState<Event[] | null>(null);

  // Отримання історії подій користувача (входи, зміни email і пароля)
  useEffect(() => {
    if (authContext?.state.loginHistory || authContext?.state.userEvents) {
      const combinedEvents: Event[] = [];

      // Додавання історії входів
      if (authContext.state.loginHistory) {
        authContext.state.loginHistory.forEach((entry: { loginTime: string }) => {
          combinedEvents.push({ type: 'login', time: entry.loginTime });
        });
      }

      // Додавання історії змін email і пароля
      if (authContext.state.userEvents) {
        authContext.state.userEvents.forEach((event: { type: string, time: string }) => {
          combinedEvents.push({
            type: event.type === 'emailChange' ? 'emailChange' : 'passwordChange',
            time: event.time,
          });
        });
      }

      setUserEvents(combinedEvents);
    }
  }, [authContext?.state.loginHistory, authContext?.state.userEvents]);

  return (
    <Page pageTitle="Сповіщення">
      <div className="notification-block">
        {userEvents && userEvents.length > 0 ? (
          userEvents.map((event, index) => {
            let title = '';
            let icon = null;

            if (event.type === 'login') {
              title = 'Новий вхід';
              icon = <img src={IconWarning} alt="Іконка входу" className="notification__type-icon" />;
            } else if (event.type === 'emailChange') {
              title = 'Зміна електронної пошти';
              icon = <img src={IconWarning} alt="Іконка зміни email" className="notification__type-icon" />;
            } else if (event.type === 'passwordChange') {
              title = 'Зміна пароля';
              icon = <img src={IconWarning} alt="Іконка зміни пароля" className="notification__type-icon" />;
            }

            return (
              <Notification
                key={index}
                icon={icon}
                title={title}
                timeAgo={getTimeAgo(event.time)}
                type={event.type === 'login' ? 'Warning' : 'Success'}
              />
            );
          })
        ) : (
          <p>Немає записів про події.</p>
        )}
      </div>
    </Page>
  );
}

// import React, { useContext, useEffect, useState } from 'react';
// import './index.css';
// import Notification from '../../component/notification';
// import Page from '../../component/page';
// import Iconworning from '../../svg/danger.svg';
// import { AuthContext } from '../../context/authContext';

// const getTimeAgo = (loginTime: string | null): string => {
//   if (!loginTime) return 'Щойно';

//   const loginDate = new Date(loginTime);
//   const now = new Date();
//   const timeDifference = now.getTime() - loginDate.getTime();

//   const minutesAgo = Math.floor(timeDifference / (1000 * 60));
//   const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

//   if (minutesAgo < 1) {
//     return 'Менше хвилини тому'; 
//   } else if (minutesAgo < 60) {
//     return `${minutesAgo} хв. тому`; 
//   } else {
//     return `${hoursAgo} год. тому`; 
//   }
// };

// export default function Container({ children }: { children?: React.ReactNode }): JSX.Element {
//   const authContext = useContext(AuthContext);
//   const [loginHistory, setLoginHistory] = useState<Array<{ loginTime: string }> | null>(null);

//   useEffect(() => {
//     if (authContext?.state.loginHistory) {
//       setLoginHistory(authContext.state.loginHistory);
//     }
//   }, [authContext?.state.loginHistory]);

//   return (
//     <Page pageTitle="Notifications">
//       <div className="notification-block">
//         {loginHistory && loginHistory.length > 0 ? (
//           loginHistory.map((entry, index) => (
//             <Notification
//               key={index}
//               icon={<img src={Iconworning} alt="Notification Icon" className="notification__type-icon" />}
//               title="Новий вхід"
//               timeAgo={getTimeAgo(entry.loginTime)}
//               type="Warning"
//             />
//           ))
//         ) : (
//           <p>Немає записів про вхід.</p>
//         )}
//       </div>
//     </Page>
//   );
// }