
import React, { useContext, useEffect, useState } from 'react';
import './index.css';
import Notification from '../../component/notification';
import Page from '../../component/page';
import IconWarning from '../../svg/danger.svg';
import IconSuccess from '../../svg/bell-black.svg';
import { AuthContext } from '../../context/authContext';

interface UserEvent {
  type: string;
  amount?: number;
  time?: string;
}

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
  const { state, dispatch } = authContext || { state: null, dispatch: () => null };
  const [loading, setLoading] = useState(true);

  const userEvents: UserEvent[] = state?.userEvents || [];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/notifications', {
          method: 'GET',
          headers: { Authorization: `Bearer ${state?.token}` },
        });

        if (response.ok) {
          const { notifications } = await response.json();
          console.log('Fetched notifications:', notifications);

          // Зберігаємо нотифікації в контекст
          dispatch({ type: 'ADD_EVENT', payload: notifications });
        } else {
          console.error('Failed to fetch notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [state?.token, dispatch]);

  if (loading) {
    return <p>Завантаження...</p>;
  }

  return (
    <Page pageTitle="Notifications">
      <div className="notification-block">
        {userEvents.length > 0 ? (
          userEvents.slice().reverse().map((event: UserEvent, index: number) => {
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
                timeAgo={getTimeAgo(event.time || null)}
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