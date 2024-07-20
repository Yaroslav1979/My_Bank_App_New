import React, { useContext, ReactNode } from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import Page from "./component/page";
import SignupPage from "./container/user-create";
import WellcomePage from "./container/start-page";
// import SigninPage from "./container/signin-page";
// import RecoveryPage from "./container/recovery-page";
// import RecoveryConfirmPage from "./container/recovery-confirm-page";
// import BalancePage from "./container/balance-page";
// import NotificationsPage from "./container/notifications-page";
// import SettingsPage from "./container/settings-page";
// import RecivePage from "./container/recive-page";
// import SendPage from "./container/send-page";
// import TransactionPage from "./container/transaction-page";
// import Error from "./component/error-page";
import SignupConfirmPage from "./container/user-confirm";
import { AuthProvider, AuthContext } from './context/authContext';

import VerifyEmail from "./component/verify-email";
import Success from "./component/success";



const AuthRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (authContext && authContext.state.token) {
    return <Navigate to="/balance" />;
  }

  return <>{children}</>;
};

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.state.token) {
    return <Navigate to="/signin" />;
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
                  <SignupConfirmPage />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/signin"
              element={<SigninPage />}
            />
            <Route
              path="/recovery"
              element={
                <AuthRoute>
                  <RecoveryPage />
                </AuthRoute>
              }
            /> */}
            {/* <Route
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
            /> */}
            {/* <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            /> */}
            {/* <Route
              path="/recive"
              element={
                <PrivateRoute>
                  <RecivePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/send"
              element={
                <PrivateRoute>
                  <SendPage />
                </PrivateRoute>
              }
            /> */}
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