import React, { useState } from 'react';
import { useAuthentication } from "../../context/AuthenticationContext";
import NavigationButton from './NavigationButton';
import AuthenticationForm from './AuthenticationForm';

import '../../styles/NavigationTitleBar.css';

const Navigation = () => {
    const { isLoggedIn, login, logout } = useAuthentication();
    const [ showAuthenticationForm, setShowAuthenticationForm ] = useState(false);

    const openAuthenticationForm = () => {
        setShowAuthenticationForm(true);
    }

    const closeAuthenticationForm = () => {
        setShowAuthenticationForm(false);
    }

    const handleLogin = (token) => {
        login(token);
        closeAuthenticationForm();
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <div className = "navigation-title-bar">
            <NavigationButton to = "/" label="Home"/>
            <NavigationButton to = "/volcanoes-list" label = "Volcano List"/>

            {!isLoggedIn ? (
                <NavigationButton to = "/" label = "Login" onClick={() => openAuthenticationForm()}/>
            ) : (
                <NavigationButton to = "/" label = "Logout" onClick = { handleLogout }/>
            )}

            <AuthenticationForm
                onOpen = { showAuthenticationForm }
                onClose = { closeAuthenticationForm }
                onLogin = { handleLogin }
            />
        </div>
    );
};

export default Navigation;