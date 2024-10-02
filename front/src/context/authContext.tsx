import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loginTime: string | null;
  loginHistory: Array<{ loginTime: string }> | null;
}

export interface AuthAction {
  type: 'LOGIN' | 'LOGOUT' | 'SET_USER';
  payload?: any;
}

const initialAuthState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loginTime: null,
  loginHistory: [], // Порожній масив історії входів
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      const newLoginTime = new Date().toISOString(); // Час входу
      const updatedLoginHistory = [...(state.loginHistory || []), { loginTime: newLoginTime }]; // Оновлюємо історію входів

      // Зберігаємо історію входів та час останнього входу в localStorage
      localStorage.setItem('loginTime', newLoginTime);
      localStorage.setItem('loginHistory', JSON.stringify(updatedLoginHistory));

      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loginTime: newLoginTime,
        loginHistory: updatedLoginHistory, // Оновлюємо стан історії входів
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
      
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        loginTime: action.payload.loginTime,
        loginHistory: action.payload.loginHistory,
        isAuthenticated: !!action.payload.user,
      };
      
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

    if (storedUser && storedToken) {
      dispatch({
        type: 'SET_USER',
        payload: {
          user: storedUser,
          loginTime: storedLoginTime,
          loginHistory: storedLoginHistory, // Завантажуємо історію входів
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
//   loginHistory: Array<{ loginTime: string, eventType: string }> | null;
// }

// export interface AuthAction {
//   type: 'LOGIN' | 'LOGOUT' | 'SET_USER' | 'EMAIL_CHANGE' | 'PASSWORD_CHANGE';
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
//       const newLoginTime = new Date().toISOString();
//       localStorage.setItem('token', action.payload.token); // Зберігаємо токен
//       localStorage.setItem('user', JSON.stringify(action.payload.user)); // Зберігаємо користувача
//       const updatedLoginHistory = [
//         ...(state.loginHistory || []),
//         { loginTime: newLoginTime, eventType: 'login' },
//       ];
//       localStorage.setItem('loginTime', newLoginTime);
//       localStorage.setItem('loginHistory', JSON.stringify(updatedLoginHistory));

//       return {
//         ...state,
//         token: action.payload.token,
//         user: action.payload.user,
//         isAuthenticated: true,
//         loginTime: newLoginTime,
//         loginHistory: updatedLoginHistory,
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
//         loginHistory: [],
//       };

//     case 'SET_USER':
//       return {
//         ...state,
//         user: action.payload.user,
//         loginTime: action.payload.loginTime,
//         loginHistory: action.payload.loginHistory,
//         isAuthenticated: true,
//       };
    
//     case 'EMAIL_CHANGE':
//       const emailChangeTime = new Date().toISOString();
//       const updatedEmailHistory = [...(state.loginHistory || []), { loginTime: emailChangeTime, eventType: 'email-change' }];
//       localStorage.setItem('loginHistory', JSON.stringify(updatedEmailHistory));
//       return {
//         ...state,
//         loginHistory: updatedEmailHistory,
//       };

//     case 'PASSWORD_CHANGE':
//       const passwordChangeTime = new Date().toISOString();
//       const updatedPasswordHistory = [...(state.loginHistory || []), { loginTime: passwordChangeTime, eventType: 'password-change' }];
//       localStorage.setItem('loginHistory', JSON.stringify(updatedPasswordHistory));
//       return {
//         ...state,
//         loginHistory: updatedPasswordHistory,
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
//           loginHistory: storedLoginHistory, // Завантажуємо історію входів
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


// import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

// export interface AuthState {
//   token: string | null; // Токен буде null спочатку
//   user: any | null;
//   isAuthenticated: boolean; // Додайте це поле
// }

// export interface AuthAction {
//   type: 'LOGIN' | 'LOGOUT' | 'SET_USER';
//   payload?: any;
// }

// const initialAuthState: AuthState = {
//   token: null, 
//   user: null,
//   isAuthenticated: false, 
// };

// export const AuthContext = createContext<{
//   state: AuthState;
//   dispatch: React.Dispatch<AuthAction>;
// } | null>(null);

// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case 'LOGIN':
//       return {
//         ...state,
//         token: action.payload.token,
//         user: action.payload.user,
//         isAuthenticated: true, 
//       };
//     case 'LOGOUT':
//       localStorage.removeItem('token');
//   localStorage.removeItem('user');
//       return {
//         ...state,
//         token: null,
//         user: null,
//         isAuthenticated: false, 
//       };
//     case 'SET_USER':
//       return {
//         ...state,
//         user: action.payload,
//         isAuthenticated: action.payload ? true : false,
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
//     if (storedUser && storedToken) {
//       dispatch({ type: 'LOGIN', payload: { token: storedToken, user: storedUser } });
//     } else if (storedUser) {
//       dispatch({ type: 'SET_USER', payload: storedUser });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };