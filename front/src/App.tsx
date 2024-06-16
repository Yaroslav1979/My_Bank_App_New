
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page from "./component/page";
import UserCreate from "./container/user-create";
import VerifyEmail from "./component/verify-email";
import Success from "./component/success";

const App: React.FC = () => {
  return (
    <Router>
      <Page>
        <Routes>
          <Route path="/user-create" element={<UserCreate />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Page>
    </Router>
  );
};

export default App;
