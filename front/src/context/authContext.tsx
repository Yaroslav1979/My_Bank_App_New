import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loginTime: string | null;
  loginHistory: Array<{ loginTime: string }> | null;
  userEvents: Array<{ type: 'emailChange' | 'passwordChange', time: string }> | null; // Нова властивість для подій змін
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
      const updatedLoginHistory = [...(state.loginHistory || []), { loginTime: newLoginTime }];
      
      localStorage.setItem('loginTime', newLoginTime);
      localStorage.setItem('loginHistory', JSON.stringify(updatedLoginHistory));

      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loginTime: newLoginTime,
        loginHistory: updatedLoginHistory,
      };
      
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('loginHistory');
      localStorage.removeItem('userEvents');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loginTime: null,
        loginHistory: [],
        userEvents: [], 
      };
      
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        loginTime: action.payload.loginTime,
        loginHistory: action.payload.loginHistory,
        userEvents: action.payload.userEvents || [], 
        isAuthenticated: !!action.payload.user,
      };
      
    case 'CHANGE_EMAIL':
      const emailChangeTime = new Date().toISOString();
      const updatedEmailEvents = [...(state.userEvents || []), { type: 'emailChange' as const, time: emailChangeTime }];
      
      localStorage.setItem('userEvents', JSON.stringify(updatedEmailEvents));

      localStorage.setItem('user', JSON.stringify(action.payload.user));  
      localStorage.setItem('token', action.payload.token);  

      return {
        ...state,

        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,


        userEvents: updatedEmailEvents, 
      };
      
    case 'CHANGE_PASSWORD':
      const passwordChangeTime = new Date().toISOString();
      const updatedPasswordEvents = [...(state.userEvents || []), { type: 'passwordChange' as const, time: passwordChangeTime }];
      
      localStorage.setItem('userEvents', JSON.stringify(updatedPasswordEvents));


      localStorage.setItem('user', JSON.stringify(action.payload.user));  
      localStorage.setItem('token', action.payload.token);  

      return {
        ...state,

        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,

        userEvents: updatedPasswordEvents, 
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
    const storedUserEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');

    if (storedUser && storedToken) {
      dispatch({
        type: 'SET_USER',
        payload: {
          user: storedUser,
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