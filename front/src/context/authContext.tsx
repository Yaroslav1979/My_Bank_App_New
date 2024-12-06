import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loginTime: string | null;
  loginHistory: Array<{ loginTime: string }>;
  userEvents: Array<Event>;
}

export interface Event {
  type: 'emailChange' | 'passwordChange' | 'credit' | 'debit' | 'login';
  time: string;
  amount?: number;
}

export interface AuthAction {
  type: 
    | 'LOGIN' 
    | 'LOGOUT' 
    | 'SET_USER' 
    | 'CHANGE_EMAIL' 
    | 'CHANGE_PASSWORD' 
    | 'CHANGE_BALANCE' 
    | 'ADD_EVENT'; 
  payload?: any;
}

const initialAuthState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loginTime: null,
  loginHistory: [],
  userEvents: [],
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

function isValidEvent(event: any): event is Event {
  const validTypes = ['emailChange', 'passwordChange', 'credit', 'debit', 'login'];
  return (
    typeof event === 'object' &&
    event !== null &&
    validTypes.includes(event.type) &&
    typeof event.time === 'string' &&
    (event.amount === undefined || typeof event.amount === 'number')
  );
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN': {
      const newLoginTime = new Date().toISOString();
      const { token, user } = action.payload;
      const userId = user?.id;
      const eventsKey = userId ? `userEvents_${userId}` : 'userEvents';
      // const balanceKey = userId ? `balance_${userId}` : 'balance';

      // Завантажуємо попередні події з localStorage
      const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
      const previousEvents: Event[] = Array.isArray(storedEvents)
        ? storedEvents.filter(isValidEvent)
        : [];

      // Додаємо подію входу
      const newLoginEvent: Event = { type: 'login', time: newLoginTime };
      const updatedUserEvents = [...previousEvents, newLoginEvent];

      // Зберігаємо події у localStorage
      localStorage.setItem(eventsKey, JSON.stringify(updatedUserEvents));

      // Відновлення балансу
      // const storedBalance = parseFloat(localStorage.getItem(balanceKey) || '0');

      return {
        ...state,
        token,
        user,
        isAuthenticated: true,
        loginTime: newLoginTime,
        loginHistory: [...state.loginHistory, { loginTime: newLoginTime }],
        userEvents: updatedUserEvents, // Завантажуємо попередні події
      };
    }

    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('loginHistory');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loginTime: null,
        loginHistory: [], 
        userEvents: [],
      };

    case 'CHANGE_EMAIL': {
      const emailChangeEvent: Event = { type: 'emailChange', time: new Date().toISOString() };
      const userId = state.user?.id;
      const eventsKey = userId ? `userEvents_${userId}` : 'userEvents';

      const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
      const previousEvents: Event[] = Array.isArray(storedEvents)
        ? storedEvents.filter(isValidEvent)
        : [];

      const updatedUserEvents = [...previousEvents, emailChangeEvent];
      if (userId) localStorage.setItem(eventsKey, JSON.stringify(updatedUserEvents));

      return { ...state, userEvents: updatedUserEvents };
    };

    case 'CHANGE_PASSWORD': {
      const passwordChangeEvent: Event = { type: 'passwordChange', time: new Date().toISOString() };
      const userId = state.user?.id;
      const eventsKey = userId ? `userEvents_${userId}` : 'userEvents';

      const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
      const previousEvents: Event[] = Array.isArray(storedEvents)
        ? storedEvents.filter(isValidEvent)
        : [];

      const updatedUserEvents = [...previousEvents, passwordChangeEvent];
      if (userId) localStorage.setItem(eventsKey, JSON.stringify(updatedUserEvents));

      return { ...state, userEvents: updatedUserEvents };
    }

    case 'CHANGE_BALANCE': {
      const balanceChangeEvent: Event = {
        type: action.payload.amount > 0 ? 'credit' : 'debit',
        time: new Date().toISOString(),
        amount: Math.abs(action.payload.amount),
      };
      const userId = state.user?.id;
      const eventsKey = userId ? `userEvents_${userId}` : 'userEvents';

      const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
      const previousEvents: Event[] = Array.isArray(storedEvents)
        ? storedEvents.filter(isValidEvent)
        : [];

      const updatedUserEvents = [...previousEvents, balanceChangeEvent];
      if (userId) localStorage.setItem(eventsKey, JSON.stringify(updatedUserEvents));

      return { ...state, userEvents: updatedUserEvents };
    }

    case 'ADD_EVENT': {
      const updatedUserEvents = [...state.userEvents, action.payload.event];
      localStorage.setItem('userEvents', JSON.stringify(updatedUserEvents));
      return {
        ...state,
        userEvents: updatedUserEvents,
      };
    }


    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const loginKey = userId ? `loginHistory_${userId}` : 'loginHistory';
    const eventsKey = userId ? `userEvents_${userId}` : 'userEvents';
    const balanceKey = userId ? `balance_${userId}` : 'balance';
  
    if (storedToken && storedUser) {
      const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
      const storedBalance = parseFloat(localStorage.getItem(balanceKey) || '0');
  
      dispatch({
        type: 'SET_USER',
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
          loginHistory: JSON.parse(localStorage.getItem(loginKey) || '[]') as Array<{ loginTime: string }>,
          loginTime: localStorage.getItem('loginTime'),
          userEvents: Array.isArray(storedEvents) ? storedEvents.filter(isValidEvent) : [],
          balance: storedBalance,
        },
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};


