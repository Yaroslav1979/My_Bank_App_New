import React, { useContext, ReactNode } from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from "./container/user-create";
import WellcomePage from "./container/start-page";
import SigninPage from "./container/user-enter";
import RecoveryPage from "./container/recovery";
import RecoveryConfirmPage from "./container/recovery-confirm";
import BalancePage from "./container/balance";
import Notifications from "./container/notifications";
import Settings from "./container/settings";
import ReceiveSum from "./container/receive";
import SendSum from "./container/send";
// import TransactionPage from "./container/transaction-page";
// import Error from "./component/error-page";
// import SignupConfirmPage from "./container/user-confirm";
import { AuthProvider, AuthContext } from './context/authContext';

import VerifyEmail from "./container/verify-email";
import Success from "./component/success";



const AuthRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  console.log('Auth state:', authContext);

  if (authContext && authContext.state.token) {
    return <Navigate to="/balance" />;
  }

  return <>{children}</>;
};

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext); 
  console.log('Auth state in PrivateRoute:', authContext?.state);


  if (!authContext || !authContext.state.token) {
    console.log('Token not found, redirecting to /user-enter');
    return <Navigate to="/user-enter" />;   
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      
          <Routes>
            <Route
              index
              element={
                <AuthRoute>
                  <WellcomePage />
                </AuthRoute>
              }
            />
            
            <Route
              path="/user-create"
              element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              }
            />
{/* ------------------------------------------------------- */}
            <Route 
              path="/verify-email" 
              element={<VerifyEmail />                
              } 
            />

            <Route 
              path="/success" 
              element={<Success />
              } 
            />
{/* --------------------------------------------------------- */}
            <Route
              path="/user-confirm"
              element={
                <PrivateRoute>
                  <Success />
                  {/* <SignupConfirmPage /> */}
                </PrivateRoute>
              }
            />
            <Route
              path="/user-enter"
              element={<SigninPage />}
            />
            <Route
              path="/recovery"
              element={
                <AuthRoute>
                  <RecoveryPage />
                </AuthRoute>
              }
            />
            <Route
              path="/recovery-confirm"
              element={
                <AuthRoute>
                  <RecoveryConfirmPage />
                </AuthRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <BalancePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/receive"
              element={
                <PrivateRoute>
                  <ReceiveSum />
                </PrivateRoute>
              }
            />
            <Route
              path="/send"
              element={
                <PrivateRoute>
                  <SendSum />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/transaction/:transactionId"
              element={
                <PrivateRoute>
                  <TransactionPage />
                </PrivateRoute>
              }
            /> */}
            {/* <Route path="*" element={<Error />} /> */}
           
          </Routes>
          
      </BrowserRouter>
    </AuthProvider>
  );
};


export default App;