import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthenticationContext = createContext();

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
    const [ isLoggedIn, setIsLoggedIn ] = useState(!!sessionStorage.getItem('authToken'));

    useEffect(() => {
        setIsLoggedIn(!!sessionStorage.getItem('authToken'));
    }, []);

    const login = (token) => {
        sessionStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    }

    const logout = () => {
        sessionStorage.removeItem('authToken');
        setIsLoggedIn(false);
    }

    return (
        <AuthenticationContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    );
};