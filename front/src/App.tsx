import React from "react";
import Page from "./component/page";
import UserCreate from "./container/user-create"

// import RegisterForm from './component/fields';
// import UserCreate from './container/user-create'

const App: React.FC = () => {
  return (
    <Page>
      <UserCreate />
    </Page>
  );
};


export default App;
