// import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

// export interface AuthState {
//   token: string | null;
//   user: { id: string; email: string } | null;
//   isAuthenticated: boolean;
//   loginTime: string | null;
//   loginHistory: Array<{ loginTime: string }>;
//   userEvents: Array<Event>;
// }

// export interface Event {
//   type: 'emailChange' | 'passwordChange' | 'credit' | 'debit' | 'login';
//   time: string;
//   amount?: number;
// }

// export interface AuthAction {
//   type: 
//     | 'LOGIN' 
//     | 'LOGOUT' 
//     | 'SET_USER' 
//     | 'CHANGE_EMAIL' 
//     | 'CHANGE_PASSWORD' 
//     | 'CHANGE_BALANCE' 
//     | 'ADD_EVENT'; 
//   payload?: any;
// }

// const initialAuthState: AuthState = {
//   token: null,
//   user: null,
//   isAuthenticated: false,
//   loginTime: null,
//   loginHistory: [],
//   userEvents: [],
// };

// export const AuthContext = createContext<{
//   state: AuthState;
//   dispatch: React.Dispatch<AuthAction>;
// } | null>(null);

// function isValidEvent(event: any): event is Event {
//   const validTypes = ['emailChange', 'passwordChange', 'credit', 'debit', 'login'];
//   return (
//     typeof event === 'object' &&
//     event !== null &&
//     validTypes.includes(event.type) &&
//     typeof event.time === 'string' &&
//     (event.amount === undefined || typeof event.amount === 'number')
//   );
// }

// // Utility functions for localStorage operations
// const getUserEventsKey = (userId: string) => `userEvents_${userId}`;

// const getStoredEvents = (userId: string): Event[] => {
//   const eventsKey = getUserEventsKey(userId);
//   const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
//   return Array.isArray(storedEvents) ? storedEvents.filter(isValidEvent) : [];
// };

// const saveEvents = (userId: string, events: Event[]) => {
//   const eventsKey = getUserEventsKey(userId);
//   localStorage.setItem(eventsKey, JSON.stringify(events));
// };

// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case 'LOGIN': {
//       const newLoginTime = new Date().toISOString();
//       const { user, token } = action.payload;
//       console.log('LOGIN action payload:', action.payload);

//       if (!user?.id) {
//         console.error('User ID is missing in the payload!');
//         return state; // Do not proceed if userId is missing
//       }

//       const userId = user.id;
//       const newLoginEvent: Event = { type: 'login', time: newLoginTime };

//       // Retrieve previous events and update them
//       const previousEvents = getStoredEvents(userId);
//       const updatedUserEvents = [...previousEvents, newLoginEvent];

//       // Save to localStorage
//       saveEvents(userId, updatedUserEvents);
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('currentUserId', userId);

//       console.log('Token saved:', token);
//       console.log('User saved:', user);
//       console.log('Current userId saved:', userId);

//       return {
//         ...state,
//         token,
//         user,
//         isAuthenticated: true,
//         loginTime: newLoginTime,
//         loginHistory: [...state.loginHistory, { loginTime: newLoginTime }],
//         userEvents: updatedUserEvents,
//       };
//     }

//     case 'LOGOUT': {
//       const userId = state.user?.id;

//       if (userId) {
//         localStorage.removeItem(getUserEventsKey(userId));
//         localStorage.removeItem(`loginHistory_${userId}`);
//       }

//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('currentUserId');

//       return {
//         ...state,
//         token: null,
//         user: null,
//         isAuthenticated: false,
//         loginTime: null,
//         loginHistory: [],
//         userEvents: [],
//       };
//     }

//     case 'CHANGE_EMAIL': {
//       if (!state.user?.id) return state;

//       const userId = state.user.id;
//       const emailChangeEvent: Event = { type: 'emailChange', time: new Date().toISOString() };

//       const previousEvents = getStoredEvents(userId);
//       const updatedUserEvents = [...previousEvents, emailChangeEvent];

//       saveEvents(userId, updatedUserEvents);

//       return { ...state, userEvents: updatedUserEvents };
//     }

//     case 'CHANGE_PASSWORD': {
//       if (!state.user?.id) return state;

//       const userId = state.user.id;
//       const passwordChangeEvent: Event = { type: 'passwordChange', time: new Date().toISOString() };

//       const previousEvents = getStoredEvents(userId);
//       const updatedUserEvents = [...previousEvents, passwordChangeEvent];

//       saveEvents(userId, updatedUserEvents);

//       return { ...state, userEvents: updatedUserEvents };
//     }

//     case 'CHANGE_BALANCE': {
//       if (!state.user?.id) return state;

//       const userId = state.user.id;
//       const balanceChangeEvent: Event = {
//         type: action.payload.amount > 0 ? 'credit' : 'debit',
//         time: new Date().toISOString(),
//         amount: Math.abs(action.payload.amount),
//       };

//       const previousEvents = getStoredEvents(userId);
//       const updatedUserEvents = [...previousEvents, balanceChangeEvent];

//       saveEvents(userId, updatedUserEvents);

//       return { ...state, userEvents: updatedUserEvents };
//     }

//     default:
//       return state;
//   }
// };

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialAuthState);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
//     const userId = localStorage.getItem('currentUserId'); // Retrieve userId

//     console.log('Stored token:', storedToken);
//     console.log('Stored user:', storedUser);
//     console.log('Stored currentUserId:', userId);

//     if (storedToken && storedUser && userId) {
//       const parsedUser = JSON.parse(storedUser);

//       dispatch({
//         type: 'SET_USER',
//         payload: {
//           token: storedToken,
//           user: parsedUser,
//           loginHistory: JSON.parse(localStorage.getItem(`loginHistory_${userId}`) || '[]'),
//           loginTime: localStorage.getItem('loginTime'),
//           userEvents: getStoredEvents(userId),
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
      const userId = state.user?.id;
      const eventsKey = userId ? `userEvents_${userId}` : 'userEvents';

      const newLoginEvent: Event = { type: 'login', time: newLoginTime };

      // Отримуємо події з `localStorage` і фільтруємо тільки валідні
      const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');
      const previousEvents: Event[] = Array.isArray(storedEvents)
        ? storedEvents.filter(isValidEvent)
        : [];

      const updatedUserEvents = [...previousEvents, newLoginEvent];
      if (userId) localStorage.setItem(eventsKey, JSON.stringify(updatedUserEvents));

      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loginTime: newLoginTime,
        loginHistory: [...state.loginHistory, { loginTime: newLoginTime }],
        userEvents: updatedUserEvents,
      };      
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

    if (storedToken && storedUser) {
      dispatch({
        type: 'SET_USER',
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
          loginHistory: JSON.parse(localStorage.getItem(loginKey) || '[]') as Array<{ loginTime: string }>,
          loginTime: localStorage.getItem('loginTime'),
          userEvents: JSON.parse(localStorage.getItem(eventsKey) || '[]') as Event[],
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


