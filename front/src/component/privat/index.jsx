// import React, { ReactNode, useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// interface PrivateRouteProps {
//   children: ReactNode;
// }

// const PrivateRoute = ({ children }: PrivateRouteProps) => {
//   const { state } = useContext(AuthContext);

//   return state.token ? <>{children}</> : <Navigate to="/signin" />;
// };

// export default PrivateRoute;
