import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export interface AuthState {
  token: string | null; // Токен буде null спочатку
  user: any | null;
  isAuthenticated: boolean; // Додайте це поле
}

export interface AuthAction {
  type: 'LOGIN' | 'LOGOUT' | 'SET_USER';
  payload?: any;
}

const initialAuthState: AuthState = {
  token: null, 
  user: null,
  isAuthenticated: false, 
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true, 
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
  localStorage.removeItem('user');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false, 
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload ? true : false,
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
    if (storedUser && storedToken) {
      dispatch({ type: 'LOGIN', payload: { token: storedToken, user: storedUser } });
    } else if (storedUser) {
      dispatch({ type: 'SET_USER', payload: storedUser });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};