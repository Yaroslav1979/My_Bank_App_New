import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loginTime: string | null;
  loginHistory: Array<{ loginTime: string }>;
  userEvents: Array<{ type: 'emailChange' | 'passwordChange', time: string }>;
}

export interface AuthAction {
  type: 'LOGIN' | 'LOGOUT' | 'SET_USER' | 'CHANGE_EMAIL' | 'CHANGE_PASSWORD';
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
      };

    case 'LOGOUT':
      localStorage.clear();
      return initialAuthState;

    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user,
        loginTime: action.payload.loginTime,
        loginHistory: action.payload.loginHistory,
        userEvents: action.payload.userEvents,
      };

    case 'CHANGE_EMAIL':
      const emailChangeEvent = { type: 'emailChange' as const, time: new Date().toISOString() };
      const updatedUserEventsEmail = [...state.userEvents, emailChangeEvent];
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userEvents', JSON.stringify(updatedUserEventsEmail));
      return { ...state, user: action.payload.user, token: action.payload.token, userEvents: updatedUserEventsEmail };

    case 'CHANGE_PASSWORD':
      const passwordChangeEvent = { type: 'passwordChange' as const, time: new Date().toISOString() };
      const updatedUserEventsPassword = [...state.userEvents, passwordChangeEvent];
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userEvents', JSON.stringify(updatedUserEventsPassword));
      return { ...state, user: action.payload.user, token: action.payload.token, userEvents: updatedUserEventsPassword };

    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const storedToken = localStorage.getItem('token');
    const storedLoginTime = localStorage.getItem('loginTime');
    const storedLoginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    const storedUserEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');

    if (storedUser && storedToken) {
      dispatch({
        type: 'SET_USER',
        payload: {
          user: storedUser,
          token: storedToken,
          loginTime: storedLoginTime,
          loginHistory: storedLoginHistory,
          userEvents: storedUserEvents,
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