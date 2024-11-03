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
  type: 'emailChange' | 'passwordChange' | 'balanceCredit' | 'balanceDebit' | 'login';
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

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
  const newLoginTime = new Date().toISOString();
  const updatedLoginHistory = [...state.loginHistory, { loginTime: newLoginTime }];
  
  // Додаємо подію про новий вхід
  const newLoginEvent: Event = { type: 'login', time: newLoginTime };

  const updatedUserEvents = [...state.userEvents, newLoginEvent];

  // Додаємо подію про попередній вхід, якщо він існує
  const lastLoginTime = localStorage.getItem('loginTime');
  if (lastLoginTime) {
    const previousLoginEvent: Event = { type: 'login', time: lastLoginTime };
    updatedUserEvents.unshift(previousLoginEvent);  // Додаємо попередню подію на початок масиву
  }

  // Оновлюємо `localStorage`
  localStorage.setItem('loginTime', newLoginTime);
  localStorage.setItem('loginHistory', JSON.stringify(updatedLoginHistory));
  localStorage.setItem('token', action.payload.token);
  localStorage.setItem('user', JSON.stringify(action.payload.user));

  return {
    ...state,
    token: action.payload.token,
    user: action.payload.user,
    isAuthenticated: true,
    loginTime: newLoginTime,
    loginHistory: updatedLoginHistory,
    userEvents: updatedUserEvents,
  };

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
        loginHistory: [], // Очищаємо історію входів
      };

    case 'CHANGE_EMAIL': {
      const emailChangeEvent: Event = { type: 'emailChange', time: new Date().toISOString() };
      const updatedUserEvents = [...state.userEvents, emailChangeEvent];
      localStorage.setItem('userEvents', JSON.stringify(updatedUserEvents));
      return {
        ...state,
        userEvents: updatedUserEvents,
      };
    }

    case 'CHANGE_PASSWORD': {
      const passwordChangeEvent: Event = { type: 'passwordChange', time: new Date().toISOString() };
      const updatedUserEvents = [...state.userEvents, passwordChangeEvent];
      localStorage.setItem('userEvents', JSON.stringify(updatedUserEvents));
      return {
        ...state,
        userEvents: updatedUserEvents,
      };
    }

    case 'CHANGE_BALANCE': {
      const balanceChangeEvent: Event = {
        type: action.payload.amount > 0 ? 'balanceCredit' : 'balanceDebit',
        time: new Date().toISOString(),
        amount: Math.abs(action.payload.amount),
      };
      const updatedUserEvents = [...state.userEvents, balanceChangeEvent];
      localStorage.setItem('userEvents', JSON.stringify(updatedUserEvents));
      return {
        ...state,
        userEvents: updatedUserEvents,
      };
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
    const storedLoginHistory = localStorage.getItem('loginHistory');
    const storedLoginTime = localStorage.getItem('loginTime');
    const storedUserEvents = localStorage.getItem('userEvents');

    if (storedToken && storedUser) {
      dispatch({
        type: 'SET_USER',
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
          loginHistory: storedLoginHistory ? JSON.parse(storedLoginHistory) : [],
          loginTime: storedLoginTime,
          userEvents: storedUserEvents ? JSON.parse(storedUserEvents) : [],
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



// import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

// export interface AuthState {
//   token: string | null;
//   user: any | null;
//   isAuthenticated: boolean;
//   loginTime: string | null;
//   loginHistory: Array<{ loginTime: string }> | null;
// }

// export interface AuthAction {
//   type: 'LOGIN' | 'LOGOUT' | 'SET_USER';
//   payload?: any;
// }

// const initialAuthState: AuthState = {
//   token: null,
//   user: null,
//   isAuthenticated: false,
//   loginTime: null,
//   loginHistory: [], // Порожній масив історії входів
// };

// export const AuthContext = createContext<{
//   state: AuthState;
//   dispatch: React.Dispatch<AuthAction>;
// } | null>(null);

// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case 'LOGIN':
//       const newLoginTime = new Date().toISOString(); // Час входу
//       const updatedLoginHistory = [...(state.loginHistory || []), { loginTime: newLoginTime }]; // Оновлюємо історію входів

//       // Зберігаємо історію входів та час останнього входу в localStorage
//       localStorage.setItem('loginTime', newLoginTime);
//       localStorage.setItem('loginHistory', JSON.stringify(updatedLoginHistory));

//       return {
//         ...state,
//         token: action.payload.token,
//         user: action.payload.user,
//         isAuthenticated: true,
//         loginTime: newLoginTime,
//         loginHistory: updatedLoginHistory, // Оновлюємо стан історії входів
//       };
      
//     case 'LOGOUT':
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('loginTime');
//       localStorage.removeItem('loginHistory');
//       return {
//         ...state,
//         token: null,
//         user: null,
//         isAuthenticated: false,
//         loginTime: null,
//         loginHistory: [], // Очищаємо історію входів
//       };
      
//     case 'SET_USER':
//       return {
//         ...state,
//         user: action.payload.user,
//         loginTime: action.payload.loginTime,
//         loginHistory: action.payload.loginHistory,
//         isAuthenticated: !!action.payload.user,
//       };
      
//     default:
//       return state;
//   }
// };

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialAuthState);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     const storedToken = localStorage.getItem('token');
//     const storedLoginTime = localStorage.getItem('loginTime');
//     const storedLoginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');

//     if (storedUser && storedToken) {
//       dispatch({
//         type: 'SET_USER',
//         payload: {
//           user: storedUser,
//           loginTime: storedLoginTime,
//           loginHistory: storedLoginHistory, 
//         },
//       });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };