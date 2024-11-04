
import React, { useContext } from 'react'; 
import './index.css';
import Notification from '../../component/notification';
import Page from '../../component/page';
import IconWarning from '../../svg/danger.svg';
import IconSuccess from '../../svg/bell-black.svg';
import { AuthContext } from '../../context/authContext';

const getTimeAgo = (eventTime: string | null): string => {
  if (!eventTime) return 'Щойно';
  const eventDate = new Date(eventTime);
  const now = new Date();
  const timeDifference = now.getTime() - eventDate.getTime();
  const minutesAgo = Math.floor(timeDifference / (1000 * 60));
  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
  if (minutesAgo < 1) return 'Менше хвилини тому';
  else if (minutesAgo < 60) return `${minutesAgo} хв. тому`;
  return `${hoursAgo} год. тому`;
};

export default function Notifications(): JSX.Element {
  const authContext = useContext(AuthContext);
  const userEvents = authContext?.state.userEvents || [];

  return (
    <Page pageTitle="Notifications">
      <div className="notification-block">
        {userEvents.length > 0 ? (
          userEvents.slice().reverse().map((event, index) => {
            if (!event || !event.type) return null;
            let title = '';
            let icon = null;

            switch (event.type) {
              case 'login':
                title = 'Новий вхід';
                icon = <img src={IconWarning} alt="Новий вхід" className="notification__type-icon" />;
                break;
              case 'emailChange':
                title = 'Зміна електронної пошти';
                icon = <img src={IconSuccess} alt="Зміна email" className="notification__type-icon" />;
                break;
              case 'passwordChange':
                title = 'Зміна пароля';
                icon = <img src={IconSuccess} alt="Зміна пароля" className="notification__type-icon" />;
                break;
              case 'credit':
                title = `Ваш баланс поповнено на суму +${event.amount}`;
                icon = <img src={IconSuccess} alt="Поповнення балансу" className="notification__type-icon" />;
                break;
              case 'debit':
                title = `З вашого балансу знято суму -${event.amount}`;
                icon = <img src={IconSuccess} alt="Зняття з балансу" className="notification__type-icon" />;
                break;
              default:
                title = 'Невідома подія';
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

//-----------------------------------------------
