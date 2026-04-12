import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LoginRoute = ({ children }) => {
    // const token = localStorage.getItem('elk_authorization_token');
    const { token, isAdmin } = useSelector((state) => state.auth);
    if(!token){
        return children;
    }
    return <Navigate to="/home" replace />;
};

export default LoginRoute;
